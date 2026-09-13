# Open Video Downloader 简体中文维护版：部署、同步与发布手册

> 本文面向本项目维护者。所有命令均在仓库根目录 `open-video-downloader-zh-cn/` 执行。

## 目录

1. [项目边界与许可义务](#项目边界与许可义务)
2. [功能与支持平台](#功能与支持平台)
3. [首次创建独立 GitHub 仓库](#首次创建独立-github-仓库)
4. [本地开发环境](#本地开发环境)
5. [简体中文维护](#简体中文维护)
6. [持续集成与候选构建](#持续集成与候选构建)
7. [每周审阅式上游同步](#每周审阅式上游同步)
8. [版本管理与发布](#版本管理与发布)
9. [安装、升级、卸载和校验](#安装升级卸载和校验)
10. [macOS 与代码签名](#macos-与代码签名)
11. [工具更新、应用更新与遥测](#工具更新应用更新与遥测)
12. [故障恢复与安全事件](#故障恢复与安全事件)
13. [仓库治理清单](#仓库治理清单)

## 项目边界与许可义务

本仓库是 `jely2002/youtube-dl-gui` 的独立派生项目，并不是上游官方版本。仓库保留上游 Git 历史，来源基线位于 [`.fork/upstream.json`](../.fork/upstream.json)，归属与许可说明位于 [`NOTICE`](../NOTICE)。

上游和本项目均使用 AGPL-3.0-or-later。发布安装包、容器、网络服务或修改版时必须：

- 保留 `LICENSE`、`NOTICE`、上游版权声明和第三方许可证；
- 提供与二进制精确对应的完整源代码；
- 标明这是独立派生版本，不冒充上游官方发布；
- 不因更名、本地化或重新打包而删除第三方许可证；
- 在发布说明中写明所依据的上游提交。

## 功能与支持平台

应用提供视频、音频、字幕和元数据下载；支持播放列表、下载队列、输出模板、格式选择、Cookie 文件和认证信息。

首期工作流分为两类：

| 平台 | 候选构建 | 正式发布 | 说明 |
| --- | --- | --- | --- |
| Windows x64 | 是 | 是 | 首期可为未签名安装包。 |
| Windows ARM64 | 是 | 是 | 使用 ARM64 目标构建。 |
| Linux x64 | 是 | 是 | 构建 AppImage、Deb 和 RPM 等 Tauri 默认目标。 |
| Linux ARM64 | 是 | 是 | 在 ARM64 运行器构建。 |
| macOS Intel | 是 | 否 | 先验证裸构建，不以未签名候选作为正式交付。 |
| macOS Apple Silicon | 是 | 否 | 先验证裸构建，不以未签名候选作为正式交付。 |

macOS 只有在本项目拥有合法的 Developer ID 签名和公证能力、且通过真实设备安装验证后，才可扩展到正式发布矩阵。

## 首次创建独立 GitHub 仓库

### 1. 创建仓库

在自己的 GitHub 账号或组织下创建一个**空白普通仓库**，不要选择 GitHub Fork 关系。推荐仓库名：

```text
open-video-downloader-zh-cn
```

不要初始化 README、许可证或 `.gitignore`，因为本地项目已经包含历史和这些文件。

### 2. 确认项目身份

本项目的正式发布身份已固定为：

```text
GitHub 仓库：https://github.com/hopol/open-video-downloader-zh-cn
应用标识：io.github.hopol.open-video-downloader-zh-cn
```

首次推送前，至少核对下列位置均使用上述项目身份：

- `package.json` 的 `repository.url`；
- `.fork/upstream.json` 的 `fork.repository`；
- `src-tauri/tauri.conf.json` 的 `identifier`；
- `src-tauri/src/stronghold/stronghold_state.rs` 的钥匙串服务名；
- `src-tauri/src/menu.rs` 的关于页面地址；
- `src/views/app/settings/SettingsAboutTab.vue` 的 GitHub、Wiki 和问题反馈地址；
- README、隐私页、发布说明、GitHub Pages 文档和 Cookie 身份验证说明。

`npm run verify:identity` 会验证正式仓库身份、独立应用标识、已关闭的应用自动更新和遥测配置。常规验证、候选构建和正式发布均严格使用本仓库的固定身份。

本项目使用的反向域名应用标识为：

```text
io.github.hopol.open-video-downloader-zh-cn
```

它必须是新标识，不能继续使用 `com.jelleglebbeek.youtube-dl-gui`。改标识会让派生版与上游版拥有独立配置目录和系统应用身份；如需迁移已有用户数据，应另行实现一次性、显式且可撤销的迁移功能。

### 3. 配置远程地址

```bash
git remote set-url origin https://github.com/hopol/open-video-downloader-zh-cn.git
git remote set-url --push upstream no_push
git remote -v
```

期望结果：

- `origin` 指向你控制的独立仓库；
- `upstream` 获取地址为 `https://github.com/jely2002/youtube-dl-gui.git`；
- `upstream` 推送地址是 `no_push`，避免把派生改动误推给上游。

### 4. 首次检查、提交和推送

```bash
npm ci
npm run verify:identity
npm run check:locales
npm run test:unit
npm run build

git add -A
git commit -m '创建: 独立简体中文维护版'
git push -u origin main
```

之后按 [GitHub 仓库治理建议](GITHUB-GOVERNANCE.zh-CN.md) 配置分支规则、标签保护和维护者审阅。

## 本地开发环境

### 必需工具

- Git；
- Node.js 24 或更新版本；
- npm；
- Rust 1.94.1，以及 `clippy`、`rustfmt`；
- Tauri 需要的系统依赖。

在 Ubuntu/Debian 上可参照 `.github/actions/install-tauri-deps/action.yml` 安装 WebKitGTK、GTK、图标和构建依赖。持续集成会安装同一组依赖。

### 安装与常规检查

```bash
npm ci
npm run verify:identity
npm run check:locales
npm run lint
npm run test:unit
npm run build
npm run rust:lint
npm run rust:test
```

运行桌面开发版：

```bash
npm run tauri dev
```

本地缺少 Rust、系统库或图形环境时，前端检查仍可执行；完整桌面构建应交给具备 Tauri 环境的持续集成或开发机验证。

## 简体中文维护

### 语言文件

| 文件 | 用途 |
| --- | --- |
| `src/locales/en.json` | 前端语言键的唯一结构基准。 |
| `src/locales/zh-CN.json` | 简体中文前端翻译。 |
| `src-tauri/locales/en.json` | 原生菜单与通知键的结构基准。 |
| `src-tauri/locales/zh-CN.json` | 简体中文原生菜单与通知翻译。 |

添加上游新语言键时：

1. 先同步英文基准结构；
2. 在两个简体中文文件中补齐相同路径的键；
3. 保持 `{变量名}`、复数规则、技术参数和格式占位符不变；
4. 执行：

   ```bash
   npm run check:locales
   ```

该脚本会拒绝缺失键、多余键、类型不一致和插值变量不一致。

### 默认语言验证

下列浏览器语言必须保持对应关系：

| 浏览器语言 | 默认界面语言 |
| --- | --- |
| `zh-CN` | `zh-CN` |
| `zh-Hans` | `zh-CN` |
| `zh` | `zh-CN` |
| `zh-TW` | `zh-TW` |
| `zh-Hant` | `zh-TW` |

对应测试：

```bash
npm run test:unit -- --run tests/unit/i18n.spec.ts
```

Windows 安装程序的简体中文由 Tauri 配置中的 `SimpChinese` 控制，它与应用内 `zh-CN` 文件互相独立，二者都不能漏测。

## 持续集成与候选构建

### `持续集成`

`.github/workflows/ci.yml` 在 `main` 推送、拉取请求和手动触发时执行：

- 派生身份检查；
- 简体中文结构检查；
- 前端静态检查、单元测试和构建；
- Rust 格式、Clippy 与测试。

首期不上传 Codecov，也不需要 Codecov 令牌。

### `候选构建`

`.github/workflows/build.yml` 会在手动触发和相关拉取请求时，为 Windows x64/ARM64、Linux x64/ARM64 与 macOS Intel/Apple Silicon 生成临时候选安装包。

它不会创建 Release，也不会导入 Apple 证书、Windows 证书、Tauri 签名私钥或任何上游凭据。候选产物只保留七天，目的是确认上游构建逻辑在派生项目中可运行。

对于 macOS：

- 成功生成未签名产物，只能证明编译和打包基本可行；
- 未经 Developer ID 签名和 Apple 公证，不能作为面向普通用户的正式交付；
- 失败时保留工作流日志并在问题跟踪中记录原因，不要尝试绕过 Gatekeeper 或使用上游证书。

## 每周审阅式上游同步

### 自动同步工作流

`.github/workflows/sync-upstream.yml` 每周一 03:17（UTC）运行，也可以手动触发。

它仅执行：

1. 从受保护的 `main` 检出；
2. 验证上游地址后拉取 `upstream/main`；
3. 无新提交时成功退出；
4. 有变更时创建 `sync/upstream-<短提交号>`；
5. 进行非快进合并并更新 `.fork/upstream.json`；
6. 推送候选分支并创建指向 `main` 的拉取请求。

它不会安装依赖、执行上游脚本、推送 `main`、批准或合并拉取请求，也不接触部署环境和私密凭据。发生合并冲突时工作流会失败，且不应推送半成品。

### 本地同步脚本

先保证工作区干净且位于 `main`：

```bash
git switch main
git pull --ff-only origin main
./scripts/sync-upstream.sh
```

脚本会拒绝：

- 有未提交改动；
- 当前不在 `main`；
- `upstream` 地址不正确；
- 同步分支已存在。

成功后它创建本地 `sync/upstream-<短提交号>` 分支并提交来源记录，但不会推送、创建拉取请求或合并 `main`。随后依次执行：

```bash
npm ci
npm run verify:identity
npm run check:locales
npm run test:unit
npm run build
npm run rust:lint
npm run rust:test
```

审阅代码、更新翻译与文档后，手动推送并创建拉取请求：

```bash
git push -u origin sync/upstream-<短提交号>
```

合并冲突必须由维护者逐项解决。若决定放弃同步：

```bash
git merge --abort
git switch main
git branch -D sync/upstream-<短提交号>
```

不要在不理解冲突含义时盲目选择“上游版本”或“当前版本”。特别审阅身份、更新、遥测、发布和语言文件。

## 版本管理与发布

### 版本规则

三个位置必须保持一致：

- `package.json`；
- `src-tauri/Cargo.toml`；
- `src-tauri/tauri.conf.json`。

用脚本更新，避免手工遗漏：

```bash
npm run set:version -- 3.2.2
npm install --package-lock-only --ignore-scripts
npm run verify:version
```

发布标签严格使用：

```text
zh-cn-v<版本号>
```

例如 `zh-cn-v3.2.2`。不能使用上游的 `app-v*` 标签。

### 发布前检查

```bash
npm ci
npm run verify:identity
npm run verify:version -- zh-cn-v3.2.2
npm run check:locales
npm run lint
npm run test:unit
npm run build
npm run rust:lint
npm run rust:test
```

审阅以下内容：

- `git status` 为空；
- `NOTICE` 和 `.fork/upstream.json` 正确；
- 没有未替换的 GitHub 所有者、仓库或应用标识占位符；
- 没有上游应用更新端点和上游遥测；
- 上游基线和简体中文翻译已审阅；
- 候选构建中的 Windows 与 Linux 资产可正常安装、启动和下载；
- Windows 未签名警告、平台支持与已知限制已在说明中准确告知。

### 创建发布

```bash
git switch main
git pull --ff-only origin main
git tag -a zh-cn-v3.2.2 -m '发布: 3.2.2'
git push origin zh-cn-v3.2.2
```

`.github/workflows/release.yml` 的流程：

1. 验证标签和三个版本字段；
2. 构建 Windows x64/ARM64 与 Linux x64/ARM64；
3. 上传临时资产；
4. 仅在所有构建任务成功后，创建一个草稿 Release；
5. 生成 `SHA256SUMS.txt` 并随资产上传；
6. 检查同名 Release 是否存在，存在则失败，绝不覆盖资产。

工作流不启用 `latest.json`、Tauri 自动更新 JSON、MSIX、Microsoft Store、WinGet、Snap、Sentry 或任何代码签名。创建草稿后，维护者应下载资产复核、安装测试、核对摘要和发布说明，然后在 GitHub 网页手动公开草稿。

## 安装、升级、卸载和校验

### 校验资产

Linux/macOS：

```bash
sha256sum -c SHA256SUMS.txt
```

Windows PowerShell：

```powershell
Get-FileHash .\安装包文件名.exe -Algorithm SHA256
```

将输出与 `SHA256SUMS.txt` 对照。校验不匹配时，停止安装、删除文件并调查发布过程。

### Windows

运行匹配架构的 NSIS 安装程序。首期无独立 Authenticode 证书时，可能出现 SmartScreen 提示；只应从项目 Release 页面下载，且必须先校验摘要。升级时手动运行新版安装器。卸载通过系统“已安装的应用”执行。

### Linux

- AppImage：赋予执行权限后运行；
- Deb：使用系统包管理器安装；
- RPM：使用发行版的包管理器安装。

升级时安装新包或替换 AppImage。卸载使用对应包管理器或删除 AppImage。不要混用上游和派生版的同一数据目录；本项目使用独立应用标识。

## macOS 与代码签名

正式发行 macOS 版本需要本项目自己的：

- Apple Developer Program 账户；
- Developer ID Application 证书；
- 公证 API 密钥与 Apple 团队信息；
- 持续的真实机器安装测试。

这些身份不得来自上游。只有完成签名、公证、装订和用户安装验证后，才可以把 macOS 加回 `release.yml` 的正式构建矩阵。未具备条件时，应继续保留候选构建或完全移除 macOS 任务，并如实告知用户不提供 macOS 正式安装包。

## 工具更新、应用更新与遥测

### 应用更新

首期已经移除 Tauri updater 插件、前端更新界面、更新权限和 `latest.json` 生成配置。用户必须从本项目的 Release 页面手动升级。

如未来引入应用自动更新，必须先：

1. 生成仅由本项目保管的 Tauri 签名密钥；
2. 部署本项目控制的 HTTPS 更新端点；
3. 实现密钥轮换、回滚、资产签名和审计；
4. 更新隐私文档、用户界面和发布流程；
5. 进行独立安全审查。

### 工具更新

下载器工具更新仍与“应用更新”分离。目前代码使用上游公开的签名清单：

```text
https://jely2002.github.io/youtube-dl-gui/manifest/manifest.json
https://jely2002.github.io/youtube-dl-gui/manifest/manifest.sig
```

客户端内置上游 Ed25519 公钥来验证清单。这意味着上游签名者仍是工具更新信任链的一部分。它并不会更新本桌面应用，但可影响下载器工具版本。

迁移到完全独立服务时，必须**同时**更换清单 URL、签名 URL、客户端公钥和 GitHub Actions 的私钥机密。仅替换网页地址不足以独立；不得复制或复用上游私钥。

### 遥测

首期不包含上游 Sentry、前端 Sentry 或应用内诊断上报，也不使用 Google Analytics。发布前运行：

```bash
npm run verify:identity
```

该脚本会检查关键源文件是否重新引入应用更新器或 Sentry 引用。任何将用户数据发送到外部服务的新功能，都必须先经过隐私和安全审查，更新 [`docs/privacy.html`](privacy.html)，并取得维护者批准。

## 故障恢复与安全事件

### 发布错误

草稿 Release 出现错误时，先停止公开发布：

1. 删除草稿或标记为已弃用；
2. 不覆盖相同标签的资产；
3. 修复问题、递增版本并使用新标签；
4. 在问题记录中保存影响范围和处理过程。

已经公开的错误版本应撤回发布说明、告知用户、提供新的校验和和安全升级路径；不要静默替换已下载资产。

### 凭据泄露

若私钥、证书、令牌或商店凭据泄露：

1. 立即在对应平台撤销令牌或证书；
2. 停止相关工作流和发布；
3. 评估已发布资产是否受影响；
4. 生成新凭据并更新受保护机密；
5. 记录事故、通知受影响用户，并在需要时发布安全版本；
6. 对应用更新签名密钥泄露，必须暂停更新通道并设计可信的迁移/轮换方案。

不要在议题、提交、工作流日志、文档或聊天记录中粘贴私钥和令牌。

### 无法构建

优先检查：

- `npm ci` 是否与锁文件一致；
- Node.js 和 Rust 是否为工作流固定版本；
- Linux Tauri 系统依赖是否完整；
- `npm run check:locales`、`npm run verify:identity` 是否报错；
- 上游同步是否引入新的构建前置条件；
- 平台运行器是否仍可用。

保留失败日志和提交号。不要为了让构建通过而临时关闭语言检查、身份验证或安全限制。

## 仓库治理清单

在首次推送后，按 [GitHub 仓库治理建议](GITHUB-GOVERNANCE.zh-CN.md) 配置：

- `main` 分支保护；
- `zh-cn-v*` 标签保护；
- 必需持续集成检查；
- 至少一位维护者审阅；
- 高敏感文件的 CODEOWNERS；
- 禁止 Actions 自动合并；
- 最小化的 `contents: write` 和 `pull-requests: write` 权限。

完整的日常与发布检查项目见 [维护检查清单](MAINTENANCE-CHECKLIST.zh-CN.md)。
