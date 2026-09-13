# 贡献指南

感谢关注 Open Video Downloader 简体中文维护版。本项目基于 Tauri（Rust 后端）和 Vue 3 + TypeScript 前端，使用 yt-dlp 提供多网站的视频、音频、字幕和元数据下载能力。

> 本仓库是独立维护的派生项目，并非上游官方仓库。提交前请先阅读 [`AGENTS.md`](AGENTS.md)、[`NOTICE`](NOTICE) 和[部署手册](docs/DEPLOYMENT.zh-CN.md)。

## 分支与合并

- 所有变更应通过拉取请求合并到 `main`。
- 不要直接推送 `main`，也不要让自动化工作流审批或合并拉取请求。
- 上游同步只能通过 `sync/upstream-<短提交号>` 候选分支进行审阅。
- 发布标签仅使用 `zh-cn-v<版本号>`，不要使用上游的 `app-v*` 格式。

## 开发环境

需要 Node.js 24 或更高版本；修改 Rust 或打包时还需要 Rust 1.94.1 和 Tauri 的系统依赖。

```bash
npm ci
npm run verify:identity
npm run check:locales
npm run lint
npm run test:unit
npm run build
npm run tauri dev
```

修改 Rust 后，在具备相应环境时还应运行：

```bash
npm run rust:lint
npm run rust:test
```

## 代码与提交要求

- 前端使用 `npm run lint` 检查；不要绕过静态检查。
- Rust 代码须通过格式化、Clippy 和单元测试。
- 提交信息使用 `类型: 简短说明`，例如 `修复: 更正简体中文默认语言识别`。
- 新功能和缺陷修复应添加覆盖常见场景的测试。
- 不要提交私钥、令牌、证书、构建产物或个人数据。

## 翻译维护

英文语言文件是所有翻译键、结构和插值变量的唯一基准：

```text
src/locales/en.json
src-tauri/locales/en.json
```

简体中文翻译位于：

```text
src/locales/zh-CN.json
src-tauri/locales/zh-CN.json
```

维护翻译时：

1. 不要修改键名、对象结构或 `{变量名}`；
2. 保留复数规则、格式占位符和必要标记；
3. 保持界面用语简洁、准确；
4. 每次修改后运行：

   ```bash
   npm run check:locales
   npm run test:unit -- --run tests/unit/i18n.spec.ts
   ```

## 派生项目安全边界

- 不得恢复应用内自动更新、上游 Sentry 或未经声明的遥测。
- 不得复用上游的证书、签名密钥、令牌、商店身份或其他私密配置。
- 下载器工具更新目前仍使用上游的公开签名清单；更改其地址或内置公钥前，必须先完成本项目的独立 Ed25519 密钥、签名、托管和验证迁移。
- 修改 `.github/workflows/`、`scripts/`、`src-tauri/tauri.conf.json`、`src-tauri/Cargo.toml`、`.fork/upstream.json` 或 `NOTICE` 时，必须在拉取请求中明确说明影响并由代码所有者审阅。

## 提交拉取请求前

确认：

1. 目标分支是 `main`；
2. 持续集成所需检查均通过；
3. 文档和简体中文翻译与改动同步；
4. 未改变项目的独立身份或安全边界；
5. 如涉及上游同步，已审查语言、更新器、遥测、依赖和发布配置差异。

## 许可证

提交到本仓库的代码依照 [AGPL-3.0-or-later](LICENSE) 许可。上游版权声明、贡献者归属和第三方许可证必须保留。
