# AI技术文档视频化生产系统

> 基于Harness+Ralph+Remotion的自动化知识IP生产流水线

## 🎯 视频规格

| 参数 | 值 |
|------|------|
| **时长** | 5-10分钟 |
| **分辨率** | 1920x1080 |
| **帧率** | 30fps |
| **格式** | MP4 |

## 📹 内容结构 (10分钟示例)

```
开篇 (10秒)
├── 标题动画
└── 副标题

主体内容 (520秒)
├── Ralph模式介绍 (90秒)
├── Harness框架说明 (90秒)
├── Remotion工具展示 (90秒)
├── 完整流程讲解 (90秒)
├── 质量体系说明 (90秒)
└── 平台分发策略 (70秒)

结尾 (30秒)
├── 总结要点
└── 引导关注
```

## 🚀 使用方法

### 1. 安装依赖
```bash
cd docs/video-production
npm install
```

### 2. 修改配置
编辑 `src/config.json` 调整视频内容和时长

### 3. 渲染视频
```bash
npm run build
```

### 4. 输出
视频文件输出到 `out/` 目录

## 📁 项目结构

```
docs/video-production/
├── Video_Production_Framework.md    # 框架说明文档
├── package.json                    # 项目配置
├── prd.json                       # PRD规格
├── scripts/
│   └── generate.js                # 文档解析脚本
└── src/
    ├── config.json                # 视频配置
    └── components/
        ├── VideoComponents.tsx   # 基础组件
        └── EnhancedComponents.tsx  # 增强组件
```

## ⚡ 快速生成

```bash
# 从Markdown生成视频配置
node scripts/generate.js ../AI-Tech-xxx.md

# 渲染所有视频
node scripts/batch-render.js
```

## 📊 质量标准

- 总分 ≥ 75 通过
- 内容深度 ≥ 80
- 实用性 ≥ 75
- 格式规范 ≥ 90
- 原创性 ≥ 85

---

**目标**: 每天15篇文档 + 15个视频 → 每周10000+曝光