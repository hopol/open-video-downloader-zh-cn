<p align="center">
  <img src="docs/icon.png" alt="Open Video Downloader" width="120">
</p>

<h1 align="center">Open Video Downloader</h1>

<p align="center">
  <strong>简体中文维护版 · 简洁、快速、跨平台的视频下载工具</strong>
</p>

<p align="center">
  <a href="https://github.com/hopol/open-video-downloader-zh-cn/releases/latest">
    <img src="https://img.shields.io/github/v/release/hopol/open-video-downloader-zh-cn?label=最新版本" alt="最新版本">
  </a>
  <a href="https://github.com/hopol/open-video-downloader-zh-cn/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/hopol/open-video-downloader-zh-cn/ci.yml?branch=main&label=构建状态" alt="构建状态">
  </a>
  <a href="https://github.com/hopol/open-video-downloader-zh-cn/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/hopol/open-video-downloader-zh-cn?label=开源协议" alt="开源协议">
  </a>
</p>

---

<p align="center">
  基于 <a href="https://github.com/jely2002/youtube-dl-gui">jely2002/youtube-dl-gui</a> 的独立维护版本<br>
  本项目不是上游官方发布，也不隶属于上游维护者
</p>

---

## ✨ 功能特性

<table>
  <tr>
    <td>🎬 <strong>视频下载</strong></td>
    <td>支持从 YouTube、Bilibili、Twitter 等数千个网站下载视频</td>
  </tr>
  <tr>
    <td>🎵 <strong>音频提取</strong></td>
    <td>支持 MP3、M4A、FLAC 等多种音频格式</td>
  </tr>
  <tr>
    <td>📝 <strong>字幕下载</strong></td>
    <td>支持自动/手动字幕，多种字幕格式</td>
  </tr>
  <tr>
    <td>📋 <strong>播放列表</strong></td>
    <td>一键下载整个播放列表，支持并发控制</td>
  </tr>
  <tr>
    <td>🔐 <strong>身份验证</strong></td>
    <td>支持 Cookie、基本认证、Bearer Token</td>
  </tr>
  <tr>
    <td>⚙️ <strong>自定义设置</strong></td>
    <td>代理、质量选择、输出模板、主题切换</td>
  </tr>
  <tr>
    <td>🖥️ <strong>跨平台</strong></td>
    <td>Windows 10/11、Ubuntu/Debian、Fedora</td>
  </tr>
  <tr>
    <td>🌍 <strong>简体中文</strong></td>
    <td>完整的中文界面、托盘菜单和系统通知</td>
  </tr>
</table>

---

## 📦 快速开始

### 下载

前往 [Releases 页面](https://github.com/hopol/open-video-downloader-zh-cn/releases/latest) 下载对应平台的安装包。

| 平台 | 文件格式 | 安装方式 |
|------|----------|----------|
| **Windows x64** | `.exe` / `.zip` | 双击安装 / 解压运行 |
| **Windows ARM64** | `.exe` / `.zip` | 双击安装 / 解压运行 |
| **Linux x64** | `.deb` / `.rpm` / `.AppImage` | `sudo apt install` / `sudo dnf install` / 赋权运行 |
| **Linux ARM64** | `.deb` / `.rpm` / `.AppImage` | `sudo apt install` / `sudo dnf install` / 赋权运行 |

### 验证完整性

下载后请使用 SHA-256 校验文件验证完整性：

```bash
# Linux / macOS
sha256sum -c SHA256SUMS.txt

# Windows PowerShell
Get-FileHash .\下载的文件名 -Algorithm SHA256
```

将结果与 `SHA256SUMS.txt` 中的哈希值对照。

---

## 🛠️ 从源码构建

### 前置条件

- [Node.js](https://nodejs.org/) 24+
- [Rust](https://rustup.rs/) 工具链
- Tauri 系统依赖（[安装指南](https://v2.tauri.app/start/prerequisites/#linux)）

### 构建步骤

```bash
# 克隆仓库
git clone https://github.com/hopol/open-video-downloader-zh-cn.git
cd open-video-downloader-zh-cn

# 安装依赖
npm ci

# 运行检查
npm run check:locales
npm run test:unit
npm run build

# 启动开发模式
npm run tauri dev

# 构建发行版
npm run tauri build
```

### Rust 检查

```bash
npm run rust:lint
npm run rust:test
```

---

## 🖼️ 界面预览

<!-- 在此处添加应用截图 -->
<!-- ![界面预览](docs/screenshot.png) -->

应用支持浅色、深色和跟随系统三种主题模式。

---

## 🔄 与上游的关系

本项目保留上游 Git 历史，并通过独立的 `upstream` 远程跟踪上游变化。

- **同步策略**：每周自动检查上游更新，创建可审阅的 PR
- **不会**自动合并到 main，需要人工审核
- **工具更新**：yt-dlp 等下载工具的更新可在应用内单独控制

详细说明请参阅：[部署与维护文档](docs/DEPLOYMENT.zh-CN.md)

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| [部署与维护](docs/DEPLOYMENT.zh-CN.md) | CI/CD、发布、上游同步详细流程 |
| [维护检查清单](docs/MAINTENANCE-CHECKLIST.zh-CN.md) | 发布前的完整检查项 |
| [Cookie 认证](docs/COOKIE-AUTHENTICATION.zh-CN.md) | 如何配置 Cookie 以访问私有内容 |
| [贡献指南](CONTRIBUTING.md) | 如何参与项目贡献 |

---

## 🐛 问题反馈

如果遇到问题或有功能建议，请使用 GitHub Issues：

👉 [提交 Issue](https://github.com/hopol/open-video-downloader-zh-cn/issues/new?template=bug_report.md)

⚠️ 请勿将问题发送给上游维护者，本项目是独立维护版本。

---

## 📜 许可证

本项目采用 [GNU Affero General Public License v3.0](LICENSE) 发布。

作为上游项目的派生版本，本项目持续提供完整的源代码，并保留所有必要的许可证和版权声明。

---

## 🙏 致谢

感谢 [jely2002](https://github.com/jely2002) 创建的优秀上游项目。

---

<p align="center">
  <sub>用 ❤️ 制作 · 如果觉得有用请给个 ⭐</sub>
</p>
