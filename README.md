# Open Video Downloader 简体中文维护版

> 基于 [jely2002/youtube-dl-gui](https://github.com/jely2002/youtube-dl-gui) 的独立维护版本。
> 本项目不是上游官方发布，也不隶属于上游维护者。

这是一个跨平台桌面视频下载器的简体中文维护版。它以图形界面封装 [yt-dlp](https://github.com/yt-dlp/yt-dlp)，可从其支持的网站下载视频、音频、字幕与元数据。

## 当前状态

- 已加入完整的简体中文界面、托盘菜单、原生通知和 Windows 简体中文安装器界面。
- 浏览器语言为 `zh-CN`、`zh-Hans` 或 `zh` 时，首次启动会默认选择简体中文；`zh-TW` 与 `zh-Hant` 保持繁体中文。
- 应用自身的自动更新已关闭。请从本项目的发布页面手动下载安装新版，并校验发布页提供的校验和。
- 首期不启用应用内错误遥测；不会向上游的 Sentry 项目发送应用错误或诊断数据。
- 下载器工具（例如 yt-dlp 和 FFmpeg）的更新功能仍可在设置中单独控制。当前它使用上游公开、经签名的工具清单；这**不是**本应用的自动更新通道。自建签名清单服务前，请审阅其供应链风险说明。
- 正式发布仅在工作流验证后提供。发布资产会发布到 [hopol/open-video-downloader-zh-cn 的 Releases 页面](https://github.com/hopol/open-video-downloader-zh-cn/releases)。

## 功能

- 下载视频、仅音频、字幕与元数据。
- 支持播放列表、输出模板、质量选择、下载队列和多任务并发控制。
- 支持浏览器 Cookie 文件、基本认证和视频密码。
- 支持 Windows、Linux 与 macOS 的源代码构建；正式 macOS 发行需要独立的 Apple 签名和公证资质，未具备该条件时不会发布 macOS 安装包。
- 支持浅色、深色和跟随系统主题。

## 下载与安装

发布完成后，请仅从 [hopol/open-video-downloader-zh-cn 的 GitHub Releases 页面](https://github.com/hopol/open-video-downloader-zh-cn/releases) 下载文件。

由于首期不使用 Windows 代码签名证书，Windows 可能显示 SmartScreen 警告。请仅下载可验证来源的发布资产，并在安装前核对 `SHA256SUMS.txt`：

```bash
sha256sum -c SHA256SUMS.txt
```

Windows PowerShell 可使用：

```powershell
Get-FileHash .\下载的资产文件名 -Algorithm SHA256
```

请将结果与发布页的 `SHA256SUMS.txt` 对照。

Windows 提供两种 x64/ARM64 分发方式：NSIS 安装包，以及 `*-portable.zip` 便携包。便携包需完整解压到可写目录后运行，保留主程序同级的 `open-video-downloader-zh-cn-portable` 目录；不要在压缩包预览中直接启动，也不要删除该目录。它需要系统已安装 Microsoft Edge WebView2 Evergreen Runtime，且不保证没有钥匙串、自动启动或通知等系统级痕迹。

Linux 的 Deb 包内部名称固定为 `open-video-downloader-zh-cn`，以符合 Debian 包名规则；安装时请使用 `sudo apt install ./<下载的 .deb 文件>`，不要依赖旧版带中文名称的 Deb 文件。

## 本地开发

前置条件：

- Node.js 24 或更高版本；
- Rust 工具链（版本由持续集成工作流固定）；
- Linux 上构建桌面应用还需要 Tauri、WebKitGTK 和系统托盘相关系统依赖。

```bash
npm ci
npm run check:locales
npm run test:unit
npm run build
npm run tauri dev
```

Rust 检查：

```bash
npm run rust:lint
npm run rust:test
```

详细环境、持续集成、发布、回滚和上游同步说明请查看：

- [部署与维护文档](docs/DEPLOYMENT.zh-CN.md)
- [维护检查清单](docs/MAINTENANCE-CHECKLIST.zh-CN.md)
- [上游来源记录](.fork/upstream.json)

## 上游同步与贡献

本项目保留上游 Git 历史，并通过独立的 `upstream` 远程跟踪：

```text
https://github.com/jely2002/youtube-dl-gui.git
```

同步只会创建可审阅的候选分支和拉取请求，绝不应自动向 `main` 直接合并。有关冲突解决和安全审查步骤，请参阅部署文档。

提交问题、功能建议和安全报告时，请使用本项目的 [问题页面](https://github.com/hopol/open-video-downloader-zh-cn/issues)。不要把派生版问题发送给上游维护者。

## 许可证与免责声明

本项目按 [GNU Affero General Public License v3.0 或更高版本](LICENSE) 发布。作为上游项目的派生版本，必须持续提供与所分发二进制对应的完整源代码，并保留许可证、版权声明与来源信息；详见 [NOTICE](NOTICE)。

请在遵守所在地法律、网站条款和内容权利人的授权范围内使用本软件。维护者不鼓励或支持绕过访问控制、侵害版权或违反服务条款的行为。
