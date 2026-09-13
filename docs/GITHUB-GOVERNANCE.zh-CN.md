# GitHub 仓库治理建议

GitHub 的分支保护、规则集、环境和机密配置由仓库管理员在网页或组织策略中配置，不能安全地由代码自动绕过。创建派生仓库后，应按以下要求配置。

## `main` 分支

1. 禁止直接推送；所有变更通过拉取请求合并。
2. 要求至少一名维护者审阅。
3. 要求“持续集成 / 前端检查”和“持续集成 / Rust 检查”均成功。
4. 要求分支在合并前与 `main` 同步。
5. 禁止管理员绕过规则，除非发生经过记录的紧急事故。
6. 禁止 GitHub Actions 自行审批或合并拉取请求。

## 发布标签

1. 保护 `zh-cn-v*` 标签，只允许指定维护者创建。
2. 创建前运行：

   ```bash
   npm run verify:identity
   npm run verify:version -- zh-cn-v<版本号>
   ```

3. 发布工作流只创建草稿 Release；维护者审核资产、校验和和说明后才手动公开。
4. 若标签或 Release 已存在，必须调查原因，严禁覆盖上传。

## 代码所有者

建议新增 `.github/CODEOWNERS`，将下列高敏感路径分配给 GitHub 账号 `@hopol` 及至少一位额外维护者审核：

```text
/.github/workflows/       @hopol
/scripts/                 @hopol
/src-tauri/tauri.conf.json @hopol
/src-tauri/Cargo.toml     @hopol
/.fork/upstream.json      @hopol
/NOTICE                   @hopol
```

当前唯一维护者为 `@hopol`。GitHub 对仓库所有者不能进行自我审批；若要强制“至少一名维护者审批”，请先增加第二位可信维护者，再将其加入 `CODEOWNERS` 和分支保护规则。

## 机密与凭据

首期工作流不需要以下上游私密信息，且不得从上游复制：

- Apple Developer ID 证书、公证密钥或 App Store 凭据；
- Windows 代码签名证书；
- Tauri 应用更新签名私钥；
- 上游 Sentry、Codecov、Google Analytics、Snapcraft、WinGet 或 Microsoft Store 凭据。

需要自建工具清单服务时，单独建立 Ed25519 密钥对、部署环境和密钥轮换流程；在客户端切换 URL 与内置公钥前，先通过独立安全审查。
