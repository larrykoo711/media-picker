# Release Guide

本文档描述 `@koo-labs/media-picker` 的发布流程。

## 前置条件

- GitHub CLI (`gh`) 已安装并登录
- npm 已登录 (`npm whoami`)
- 在 `main` 分支上
- 工作目录干净 (`git status` 无未提交更改)

## GitHub Secrets 配置

以下 Secrets 需要在 GitHub 仓库中配置：

| Secret | 说明 |
|--------|------|
| `NPM_TOKEN` | npm automation token，用于发布包 |
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Vercel Organization ID |
| `VERCEL_PROJECT_ID` | Vercel Project ID |

## 发布流程

### Step 1: 更新版本号

编辑 `package.json`，更新 `version` 字段：

```bash
# 查看当前版本
grep '"version"' package.json

# 手动编辑 package.json 中的 version 字段
# 或使用 npm version（会自动创建 git tag，不推荐）
```

**版本号规范：**
- 预发布版本：`0.0.1-pre`, `0.0.2-pre`, `0.1.0-pre`
- 正式版本：`0.1.0`, `0.2.0`, `1.0.0`
- 遵循 [Semantic Versioning](https://semver.org/)

### Step 2: 提交版本变更

```bash
git add package.json
git commit -m "chore: bump version to <VERSION>"
```

### Step 3: 推送到远程

```bash
git push origin main
```

### Step 4: 创建 GitHub Release

```bash
gh release create v<VERSION> \
  --title "v<VERSION>" \
  --notes "<RELEASE_NOTES>"
```

**示例：**

```bash
gh release create v0.0.1-pre \
  --title "v0.0.1-pre" \
  --notes "First pre-release version

## Features
- Pexels-powered photo and video search
- Headless, composable React components
- Built-in lightbox preview
- Multi-select support
- Dark mode support"
```

**预发布版本（带 `-pre` 后缀）会自动标记为 Pre-release。**

### Step 5: 监控 CI 状态

```bash
# 实时监控最新的 workflow 运行
gh run watch

# 或查看运行列表
gh run list --limit 5
```

## CI/CD 自动化流程

创建 GitHub Release 后，自动触发 `.github/workflows/release.yml`：

```
GitHub Release Created
        ↓
   Job 1: npm-publish
   ├── Checkout 代码
   ├── Setup pnpm & Node.js
   ├── Install dependencies (排除 website)
   ├── Run tests
   ├── Type check
   ├── Build
   └── Publish to npm
        ↓
   Job 2: deploy-website (依赖 npm-publish 成功)
   ├── Checkout 代码
   ├── Install Vercel CLI
   └── Deploy to Vercel Production
```

## 验证发布结果

### npm 包

```bash
# 查看已发布版本
npm view @koo-labs/media-picker versions

# 查看最新版本详情
npm view @koo-labs/media-picker
```

### Vercel 部署

- 生产站点：https://media-picker-nine.vercel.app

## 回滚

### 删除 GitHub Release

```bash
gh release delete v<VERSION> --yes
git push --delete origin v<VERSION>
git tag -d v<VERSION>
```

### 撤销 npm 发布（72小时内）

```bash
npm unpublish @koo-labs/media-picker@<VERSION>
```

## 常见问题

### Q: CI 报错 `ERR_PNPM_OUTDATED_LOCKFILE`

**原因：** website/package.json 依赖版本与 pnpm-lock.yaml 不同步

**解决：** workflow 已配置 `--filter "!media-picker-docs"` 排除 website

### Q: Vercel 部署失败

**检查项：**
1. `VERCEL_TOKEN` 是否有效
2. `VERCEL_ORG_ID` 和 `VERCEL_PROJECT_ID` 是否正确
3. Vercel Dashboard 中 Root Directory 应为空（workflow 中已指定 `./website`）

### Q: npm publish 失败

**检查项：**
1. `NPM_TOKEN` 是否有效且有 publish 权限
2. 版本号是否已存在（不能重复发布相同版本）
3. 包名是否被占用
