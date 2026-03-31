# Ralphy 深度分析 - 自主AI编程循环

> Ralphy Autonomous AI Coding Loop  
> 文档编号：AI-Tech-039  
> 关键词：Ralphy、Loop、Coding Agent、Autonomous、Parallel  
> 更新日期：2026-03-31

---

## 一、项目概述

### 1.1 什么是Ralphy

**自主AI编程循环工具**，让AI Agent循环执行任务直到PRD完成。

| 指标 | 数值 |
|------|------|
| ⭐ | **2,685** |
| 维护者 | michaelshimeles |
| NPM | ralphy-cli |

### 1.2 核心理念

```
Ralphy = 任务循环 → Agent执行 → 自动继续
       = PRD定义 → 多Agent并行 → 自动完成
```

---

## 二、核心功能

### 2.1 任务执行

```bash
# 单任务
ralphy "add dark mode"
ralphy "fix the auth bug"

# PRD任务列表
ralphy --prd PRD.md
```

### 2.2 支持的引擎

| 引擎 | 命令 |
|------|------|
| Claude Code | `--claude` |
| OpenCode | `--opencode` |
| Cursor | `--cursor` |
| Codex | `--codex` |
| Qwen | `--qwen` |
| Factory Droid | `--droid` |
| GitHub Copilot | `--copilot` |
| Gemini CLI | `--gemini` |

### 2.3 并行执行

```bash
# 3个并行
ralphy --parallel

# 5个并行
ralphy --parallel --max-parallel 5
```

**并行架构**：

```
Agent 1 → worktree/branch: agent-1-task1
Agent 2 → worktree/branch: agent-2-task2  
Agent 3 → worktree/branch: agent-3-task3
       ↓
   自动合并 / PR创建
```

---

## 三、PRD定义

### 3.1 Markdown格式

```markdown
## Tasks
- [ ] create auth
- [ ] add dashboard
- [x] done task
```

### 3.2 文件夹格式

```
prd/
├── backend.md   # - [ ] create user API
├── frontend.md # - [ ] add login page
└── infra.md    # - [ ] setup CI/CD
```

### 3.3 YAML格式

```yaml
tasks:
  - title: create auth
    completed: false
  - title: add dashboard
    completed: false
```

### 3.4 JSON格式

```json
{
  "tasks": [
    {"title": "create auth", "completed": false}
  ]
}
```

### 3.5 GitHub Issues

```bash
ralphy --github owner/repo
ralphy --github owner/repo --github-label "ready"
```

---

## 四、配置

### 4.1 项目初始化

```bash
ralphy --init # 自动检测项目设置
```

### 4.2 生成配置

```yaml
# .ralphy/config.yaml
project:
  name: "my-app"
  language: "TypeScript"
  framework: "Next.js"

commands:
  test: "npm test"
  lint: "npm run lint"
  build: "npm run build"

rules:
  - "use server actions not API routes"
  - "follow error pattern"

boundaries:
  never_touch:
    - "src/legacy/**"
    - "*.lock"
```

---

## 五、工作流程

### 5.1 单任务流程

```
用户输入 → Ralphy → Claude Code执行 → 结果
    ↓
是否完成？ ← 是 → 结束
    ↓
否 → 继续
```

### 5.2 PRD流程

```
PRD.md → 解析任务列表
    ↓
遍历任务 → Agent执行
    ↓
自动继续下一个任务
    ↓
完成所有任务
```

### 5.3 并行流程

```
任务分组 → 分配到多个Agent
    ↓
并行执行 → Git worktree + branch
    ↓
自动合并 / PR创建
```

---

## 六、高级特性

### 6.1 分支管理

```bash
ralphy --branch-per-task # 每任务一个分支
ralphy --branch-per-task --create-pr # +PR
ralphy --branch-per-task --draft-pr # +草稿PR
ralphy --base-branch main
```

### 6.2 依赖分组

```yaml
tasks:
  - title: Create User model
    parallel_group: 1
  - title: Create Post model
    parallel_group: 1  # 同一组，并行
  - title: Add relationships
    parallel_group: 2  # 等待组1完成
```

---

## 七���文档信息

| 项目 | 内容 |
|------|------|
| 作者 | AI Assistant |
| 审阅 | 待审阅 |
| 版本 | V1.0 |
| 字数 | ~1800 |
| 更新 | 2026-03-31 |
| 状态 | 待提交 |

---

*本文档为 AI 研究技术文档系列之一 | 项目：ai-research*