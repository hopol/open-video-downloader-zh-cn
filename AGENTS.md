# 项目维护说明

## 项目定位

本仓库是 Open Video Downloader 的独立简体中文维护版本，并非上游官方仓库。必须保留 `LICENSE`、`NOTICE`、`.fork/upstream.json` 与上游 Git 历史；不得删除上游贡献者和第三方依赖的许可信息。

## 目录

- `src/`：Vue 3 与 TypeScript 前端。
- `src/locales/`：前端界面翻译；英文语言包是键结构基准。
- `src-tauri/`：Rust 与 Tauri 后端。
- `src-tauri/locales/`：托盘和原生通知翻译；语言文件会由 Rust 自动嵌入。
- `src-isolation/`：Tauri 隔离页面。
- `scripts/`：语言、版本、身份和同步验证脚本。
- `.github/workflows/`：持续集成、候选构建、发布和上游同步。
- `.fork/upstream.json`：上游基线与派生边界的机器可读记录。
- `docs/`：中文部署、维护和发布文档。

## 强制约束

1. 不得恢复或新建应用内自动更新功能，除非先建立属于本项目的更新端点、签名密钥、密钥轮换和发布审计方案。
2. 不得恢复上游 Sentry、Google Analytics 或其他未声明的用户遥测；任何新遥测均需先更新隐私文档并取得维护者批准。
3. 下载器工具更新与应用更新不同。目前工具清单暂用上游经签名服务；更改 `MANIFEST_URL`、`MANIFEST_SIG_URL` 或公钥时，必须同时完成自有 Ed25519 密钥、签名和部署验证。
4. 不得复用上游 Apple 证书、公证凭据、Windows 证书、Tauri 私钥、Sentry 令牌、商店身份或任何其他私密配置。
5. 本仓库的正式身份固定为 `hopol/open-video-downloader-zh-cn`；不得更改为其他发布主体，除非先完成独立的身份迁移审查。
6. 上游同步只能形成可审阅分支和拉取请求，禁止自动直接合并到 `main`。
7. 英文语言包增删键后，必须同步维护简体中文并执行语言检查。

## 本地检查

修改前端或语言包后，至少运行：

```bash
npm ci
npm run check:locales
npm run test:unit
npm run build
```

修改 Rust 后，还应在具备 Rust 工具链和 Tauri 系统依赖的环境中运行：

```bash
npm run rust:lint
npm run rust:test
```

发布前还必须执行身份和版本验证脚本；具体命令见 `docs/DEPLOYMENT.zh-CN.md`。

## 文档与提交

- 用户可见文档优先使用简体中文；技术名词和代码字段可以保留原样。
- 提交信息采用 `类型: 简短说明`，例如 `修复: 修正简体中文默认语言识别`。
- 不要手工编辑自动生成的第三方许可证内容；先改生成脚本，再重新生成。
