# GPT-Engineer + Aider 深度分析 - AI编程Harness

> AI Coding Harness In-Depth Analysis  
> 文档编号：AI-Tech-038  
> 关键词：GPT-Engineer、Aider、AI编程、代码生成  
> 更新日期：2026-03-31

---

## 一、GPT-Engineer

### 1.1 项目概述

**AI编程Harness的OG项目**，被称为"代码生成实验平台"。

| 指标 | 数值 |
|------|------|
| ⭐ | **55,232** |
| Forks | 7,609 |
| 维护者 | Anton Osika |
| Python | 3.10-3.12 |

### 1.2 核心理念

```
GPT-Engineer = 自然语言 → 完整代码应用
    = Prompt定义 → AI生成 → 自动执行
```

### 1.3 使用方式

```bash
# 安装
pip install gpt-engineer

# 创建项目
mkdir my-project
cd my-project
echo "创建一个待办事项应用" > prompt
gpte .

# 改进现有代码
gpte projects/my-old-app -i
```

### 1.4 Prompt预设

```python
# preprompts/
- identity.py      # AI角色定义
- generate.py     # 生成步骤
- fix.py          # 修复步骤
```

### 1.5 Benchmark

```bash
# 安装bench
 pip install gpt-engineer

# 运行benchmark
bench --benchmark mbpp
bench --benchmark apps
```

**支持的数据集**：
- APPS
- MBPP

---

## 二、Aider

### 2.1 项目概述

**AI编程助手**，强调可Hack的CLI工具。

| 定位 | 可维护的Hackable CLI |
|------|---------------------|
| 官网 | aider.chat |
| 特点 | 编辑器集成Git |

### 2.2 核心功能

```bash
# 编辑模式
aider --editor

# 只读模式
aider --read-only

# 多文件编辑
aider file1.py file2.py

# Git集成
aider --auto-commits
aider --git-draft
```

### 2.3 支持模型

- GPT-4
- Claude
- 本地模型
- Azure OpenAI

---

## 三、对比

| 维度 | GPT-Engineer | Aider |
|------|--------------|-------|
| ⭐ | 55k+ | - |
| 核心 | 自动生成 | AI辅助编辑 |
| UI | CLI | CLI + 编辑器 |
| Git集成 | 基础 | 深度 |
| 自定义 | Prompts | 配置文件 |

---

## 四、如何选择

| 场景 | 推荐 |
|------|------|
| 从0生成完整应用 | GPT-Engineer |
| 改进现有代码 | Aider |
| 低代码编程 | Aider |
| 快速原型 | GPT-Engineer |

---

## 五、文档信息

| 项目 | 内容 |
|------|------|
| 作者 | AI Assistant |
| 审阅 | 待审阅 |
| 版本 | V1.0 |
| 字数 | ~1500 |
| 更新 | 2026-03-31 |
| 状态 | 待提交 |

---

*本文档为 AI 研究技术文档系列之一 | 项目：ai-research*