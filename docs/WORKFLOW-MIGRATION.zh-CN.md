# 上游发布工作流的替代关系

本派生项目不使用上游的 `publish.yml`、`distribute.yml`、`msix.yml`、`vue-ci.yml` 和 `rust-ci.yml`。这些文件已被移除，原因是其中包含或依赖上游专属的发布标签、应用更新、Sentry、Microsoft Store、WinGet、Snap、Apple 签名、公证或代码签名流程。

当前替代工作流：

| 工作流 | 用途 | 是否需要私密凭据 |
| --- | --- | --- |
| `ci.yml` | 前端、语言、身份和 Rust 检查 | 否 |
| `build.yml` | 全平台候选构建 | 否 |
| `release.yml` | Windows/Linux 草稿 Release | 仅 GitHub 自动令牌 |
| `sync-upstream.yml` | 每周创建上游同步拉取请求 | 仅 GitHub 自动令牌 |

`pages.yml` 暂时保留用于上游工具清单的签名部署。它在未建立本项目独立 Ed25519 私钥、公钥和 Pages 域名前不得运行或发布；详见 `docs/DEPLOYMENT.zh-CN.md` 的“工具更新”章节。
