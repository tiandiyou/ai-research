# Claude Code Best Practice - 开源项目整理

> 文档编号：AI-Tech-Viral-012
> 关键词：Claude Code、Best Practice、Agent、Subagent、Skill、MCP
> 来源：https://github.com/shanraisshan/claude-code-best-practice (35.2k stars)
> 更新日期：2026-04-10

---

## 项目简介

> from vibe coding to agentic engineering - practice makes claude perfect

**核心概念**：从"感觉编程"到"代理工程"的最佳实践

---

## 🧠 核心概念

| 特性 | 位置 | 描述 |
|------|------|------|
| 🟢 **Subagents** | `.claude/agents/<name>.md` | 自主actor在新隔离上下文中 — 自定义工具、权限、模型、内存和持久身份 |
| 🟢 **Commands** | `.claude/commands/<name>.md` | 注入现有上下文的知识 — 用户触发的简单提示模板，用于工作流编排 |
| 🟢 **Skills** | `.claude/skills/<name>/SKILL.md` | 注入现有上下文的知识 — 可配置、可预加载、可自动发现，支持上下文fork和渐进式披露 |
| **Workflows** | `.claude/commands/weather-orchestrator.md` | 工作流模式 |
| **Hooks** | `.claude/hooks/` | 用户定义的处理器(脚本、HTTP、提示、agent)在特定事件时运行 |
| **MCP Servers** | `.claude/settings.json`, `.mcp.json` | Model Context Protocol连接外部工具、数据库和API |
| **Plugins** | distributable packages | 技能、subagent、hook、MCP服务器的打包分发 |
| **Settings** | `.claude/settings.json` | 分层配置系统 |
| **Memory** | `CLAUDE.md`, `.claude/rules/`, `~/.claude/rules/` | 通过CLAUDE.md文件的持久上下文 |
| **Checkpointing** | automatic (git-based) | 自动跟踪文件编辑，支持回滚 |

---

## 🔥 热门特性

| 特性 | 位置 | 描述 |
|------|------|------|
| **Power-ups** | `/powerup` | 交互式课程教授Claude Code功能（v2.1.90） |
| **Ultraplan** | `/ultraplan` | 云端草稿计划，带浏览器审查和内联评论 |
| **Claude Code Web** | `claude.ai/code` | 在云基础设施上运行任务 |
| **Agent SDK** | `npm` / `pip` | 使用Claude Code构建生产AI agent |
| **No Flicker Mode** | `CLAUDE_CODE_NO_FLICKER=1` | 无闪烁的alt-screen渲染 |
| **Computer Use** | `computer-use` MCP server | 让Claude控制屏幕 |
| **Auto Mode** | `claude --enable-auto-mode` | 后台安全分类器替换手动权限提示 |
| **Channels** | `--channels`, plugin-based | 从Telegram、Discord或webhook推送事件 |
| **Scheduled Tasks** | `/loop`, `/schedule`, cron | 定时运行提示 |
| **Voice Dictation** | `/voice` | 语音输入提示 |
| **Simplify & Batch** | `/simplify`, `/batch` | 代码质量和批量操作 |
| **Agent Teams** | built-in (env var) | 多agent并行工作 |
| **Remote Control** | `/remote-control`, `/rc` | 从任何设备继续本地会话 |
| **Git Worktrees** | built-in | 并行开发的隔离git分支 |

---

## 🎯 开发工作流

所有主要工作流都收敛于相同的架构模式：**Research → Plan → Execute → Review → Ship**

### 知名工作流

| 名称 | Stars | 特点 |
|------|------|------|
| Everything Claude Code | 148k | 直觉评分、AgentShield、多语言规则 |
| Superpowers | 143k | TDD-first、铁律、整体计划审查 |
| Spec Kit | 87k | Spec驱动、宪法、22+工具 |
| gstack | 68k | 角色人格、/codex review、并行sprint |
| Get Shit Done | 50k | 新鲜200K上下文、wave执行、XML计划 |
| OpenSpec | 39k | Delta specs、brownfield、artifact DAG |
| oh-my-claudecode | 27k | 团队编排、tmux worker、skill自动注入 |

---

## 📁 目录结构

```
.claude/
├── agents/                 # Subagents
│   └── <name>.md
├── commands/              # Commands
│   └── <name>.md
├── skills/                # Skills
│   └── <name>/
│       └── SKILL.md
├── hooks/                 # Hooks
│   └── <event>/
├── settings.json          # 设置
├── rules/                # 规则
└── projects/             # 项目内存
    └── <project>/

.mcp.json                 # MCP配置
CLAUDE.md                 # 项目级内存
```

---

## 🔧 配置示例

### MCP配置 (`.mcp.json`)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/filesystem"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/github"]
    }
  }
}
```

### 设置配置 (`.claude/settings.json`)

```json
{
  "permissions": {
    "allow": ["Read", "Write", "Edit", "Bash"],
    "deny": ["Network"]
  },
  "model": "claude-sonnet-4-20250514",
  "customInstructions": "项目特殊指令..."
}
```

---

## 📚 参考资源

- 官方文档：https://code.claude.com/docs
- 官方技能：https://github.com/anthropics/skills/tree/main/skills
- Agent SDK：https://github.com/anthropics/claude-agent-sdk-demos

---

## 🎓 学习路径

1. **入门**：阅读官方最佳实践文档
2. **进阶**：掌握Commands → Skills → Subagents
3. **专家**：工作流编排 + MCP + Agent Teams
4. **大师**：自定义Plugin + Agent SDK

---

*文档根据 https://github.com/shanraisshan/claude-code-best-practice 整理*