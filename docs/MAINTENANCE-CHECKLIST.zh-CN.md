# 维护检查清单

> 每一项都应在对应的拉取请求、发布记录或事故记录中留下证据。无法完成时，写明原因和风险，不要假装通过。

## 每次上游同步前

- [ ] 当前分支是 `main`，且与远程一致。
- [ ] 工作区没有未提交改动。
- [ ] `upstream` 获取地址是 `https://github.com/jely2002/youtube-dl-gui.git`。
- [ ] `upstream` 推送地址是 `no_push`。
- [ ] 已阅读上游发布说明、提交列表和安全公告。
- [ ] 已确认不会在同步过程中执行未经审查的上游脚本。

## 上游同步候选分支

- [ ] 使用 `./scripts/sync-upstream.sh` 或“审阅上游同步”工作流创建候选分支。
- [ ] 无冲突时，`.fork/upstream.json` 的提交、版本和时间已更新。
- [ ] 有冲突时已中止，未推送半成品。
- [ ] 审阅了 `src-tauri/tauri.conf.json`、`Cargo.toml`、工作流、脚本、依赖锁文件、权限和网络端点。
- [ ] 审阅了所有新增或修改的英文语言键。
- [ ] 简体中文前端与原生语言包已补齐且经人工校对。
- [ ] 不存在重新启用上游应用自动更新、上游 Sentry 或其他未声明遥测的改动。

## 代码检查

- [ ] `npm ci`
- [ ] `npm run verify:identity`
- [ ] `npm run check:locales`
- [ ] `npm run lint`
- [ ] `npm run test:unit`
- [ ] `npm run build`
- [ ] `npm run rust:lint`
- [ ] `npm run rust:test`
- [ ] 在可用桌面环境中试运行 `npm run tauri dev`。
- [ ] 浏览器语言 `zh-CN`、`zh-Hans`、`zh` 默认使用简体中文。
- [ ] 浏览器语言 `zh-TW`、`zh-Hant` 默认使用繁体中文。
- [ ] 设置中切换语言、托盘和通知显示正确。

## 候选构建

- [ ] 手动运行“候选构建”工作流。
- [ ] Windows x64 构建成功，并在 x64 Windows 安装、启动和下载测试。
- [ ] Windows x64 候选资产同时包含 NSIS 安装器与 `*-windows-x64-portable.zip`；已检查 ZIP 内有主程序、`open-video-downloader-zh-cn-portable/.keep` 和第三方许可证资源。
- [ ] Windows x64 便携 ZIP 已完整解压到可写位置，首次启动、重启和数据持久化均已验证。
- [ ] Windows ARM64 构建成功，并在相应环境验证，或记录运行器/硬件限制。
- [ ] Windows ARM64 候选资产同时包含 NSIS 安装器与 `*-windows-arm64-portable.zip`；已在 ARM64 环境验证或记录限制。
- [ ] Linux x64 构建成功并完成安装、启动和下载测试。
- [ ] Linux x64 与 ARM64 的依赖安装日志确认 `xdg-utils` 和 `/usr/bin/xdg-open` 可用。
- [ ] Linux x64 与 ARM64 的 Deb `Package` 字段都精确为 `open-video-downloader-zh-cn`，版本与构建版本一致、架构正确，且包内有 `usr/bin/open-video-downloader-zh-cn` 和相应 desktop 文件。
- [ ] Windows/macOS 的中文产品显示名和窗口标题仍为 `Open Video Downloader 简体中文维护版`；Linux 覆盖配置未改变应用标识或主二进制名称。
- [ ] Linux ARM64 构建成功并在相应环境验证，或记录运行器/硬件限制。
- [ ] 两个 Linux 架构的候选资产均确实含有 AppImage，而非仅上传 Deb/RPM。
- [ ] macOS Intel 和 Apple Silicon 仅作为未签名候选验证；不把未公证产物当作正式版本。
- [ ] 候选资产命名、应用标识和数据目录不与上游客户端冲突。

## 发布前

- [ ] 三个版本字段已同步：`package.json`、`src-tauri/Cargo.toml`、`src-tauri/tauri.conf.json`。
- [ ] 已运行 `npm run verify:version -- zh-cn-v<版本号>`。
- [ ] 标签遵循 `zh-cn-v<版本号>`，不使用上游 `app-v*`。
- [ ] `NOTICE`、`LICENSE` 和 `.fork/upstream.json` 已保留且准确。
- [ ] Release 说明包含上游基线、手动升级、无遥测和校验说明。
- [ ] 仓库身份固定为 `hopol/open-video-downloader-zh-cn`，且应用标识为 `io.github.hopol.open-video-downloader-zh-cn`。
- [ ] 已审查 GitHub 仓库、应用标识、钥匙串服务名和问题反馈地址属于本项目。
- [ ] 未复用上游任何签名私钥、证书、令牌或商店身份。
- [ ] 同名标签和 Release 不存在。

## 草稿 Release 审核

- [ ] 所有 Windows 和 Linux 构建任务成功。
- [ ] 草稿 Release 创建成功，且只由一个发布任务上传资产。
- [ ] 存在 `SHA256SUMS.txt`。
- [ ] 在干净环境中用 `sha256sum -c SHA256SUMS.txt` 验证资产。
- [ ] Windows PowerShell 哈希与摘要文件一致。
- [ ] 安装包和 AppImage/包管理器资产已在目标平台启动测试。
- [ ] 未签名 Windows 安装包的风险提示准确。
- [ ] 不存在 `latest.json`、自动更新资产或上游发布链接。
- [ ] 审阅完成后才手动公开草稿。

## 发布后

- [ ] 发布页下载链接、仓库地址、隐私说明和问题反馈地址正确。
- [ ] 检查从上游应用更新端点和上游 Sentry 没有收到派生应用流量。
- [ ] 工具更新说明仍明确指出其与应用更新不同。
- [ ] 记录实际测试系统、构建运行器和已知问题。
- [ ] 如存在安全问题或回滚需要，建立公开透明的处理记录。

## 安全事件

- [ ] 已立即撤销泄露的凭据。
- [ ] 已暂停受影响工作流或发布。
- [ ] 已评估已有资产和用户影响。
- [ ] 已生成新凭据并审阅访问范围。
- [ ] 已通知用户并记录时间线。
- [ ] 没有在日志、提交、议题或文档中暴露私密材料。
