#!/usr/bin/env bash
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
cd "$root"

target_branch="${1:-main}"
upstream_remote="upstream"
expected_upstream_url="https://github.com/jely2002/youtube-dl-gui.git"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "同步已取消：工作区存在未提交改动。请先提交、暂存或还原改动。" >&2
  exit 1
fi

if [[ "$target_branch" != "main" ]]; then
  echo "同步已取消：只允许从 main 创建同步候选分支。" >&2
  exit 1
fi

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "$target_branch" ]]; then
  echo "同步已取消：当前分支为 $current_branch，必须先切换到 $target_branch。" >&2
  exit 1
fi

actual_upstream_url="$(git remote get-url "$upstream_remote")"
if [[ "$actual_upstream_url" != "$expected_upstream_url" ]]; then
  echo "同步已取消：$upstream_remote 地址不符合预期：$actual_upstream_url" >&2
  exit 1
fi

git fetch --no-tags "$upstream_remote" main
upstream_commit="$(git rev-parse "$upstream_remote/main")"

if git merge-base --is-ancestor "$upstream_commit" HEAD; then
  echo "无需同步：当前分支已包含上游提交 $upstream_commit。"
  exit 0
fi

short_commit="$(git rev-parse --short "$upstream_commit")"
sync_branch="sync/upstream-$short_commit"

if git show-ref --verify --quiet "refs/heads/$sync_branch"; then
  echo "同步已取消：本地分支 $sync_branch 已存在。请审阅或删除后重试。" >&2
  exit 1
fi

git switch -c "$sync_branch"

if ! git merge --no-ff --no-commit "$upstream_commit"; then
  echo "同步发生冲突，正在中止合并并返回 $target_branch。" >&2
  git merge --abort || true
  git switch "$target_branch"
  git branch -D "$sync_branch" || true
  exit 1
fi

UPSTREAM_COMMIT="$upstream_commit" UPSTREAM_VERSION="$(node -p 'require("./package.json").version')" node --input-type=module <<'NODE'
import { readFile, writeFile } from 'node:fs/promises';

const path = '.fork/upstream.json';
const state = JSON.parse(await readFile(path, 'utf8'));
const commit = process.env.UPSTREAM_COMMIT;
const version = process.env.UPSTREAM_VERSION;
state.upstream.commit = commit;
state.upstream.version = version;
state.lastSynchronizedAt = new Date().toISOString();
await writeFile(path, `${JSON.stringify(state, null, 2)}\n`);
NODE

git add .fork/upstream.json
git commit -m "同步: 合并上游 $short_commit"

echo "已创建同步候选分支：$sync_branch"
echo "请先执行 npm ci、npm run check:locales、npm run verify:identity、npm run test:unit、npm run build 及 Rust 检查。"
echo "审阅后手动推送该分支并创建指向 main 的拉取请求；本脚本不会推送或合并 main。"
