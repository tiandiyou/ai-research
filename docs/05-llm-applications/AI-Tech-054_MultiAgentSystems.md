# Multi-Agent Systems 完全指南

> 2026-04-01 | 技术文档 | 预计阅读时间：28分钟

---

## 目录

1. [多代理系统概述](#多代理系统概述)
2. [架构模式](#架构模式)
3. [通信机制](#通信机制)
4. [协作策略](#协作策略)
5. [实现框架](#实现框架)
6. [实践案例](#实践案例)
7. [最佳实践](#最佳实践)

---

## 多代理系统概述

### 什么是 Multi-Agent Systems

Multi-Agent Systems（多代理系统）是由多个独立但协作的 AI Agent 组成的系统，每个 Agent 有特定角色和能力，通过协作完成复杂任务。

```python
# 多代理系统
class MultiAgentSystem:
    """多代理系统"""
    
    # 核心组件
    COMPONENTS = {
        "Agent": "独立个体，有自己的角色和能力",
        "Environment": "共享环境，代理交互的场所",
        "Communication": "代理间消息传递机制",
        "Coordination": "任务分配和协作机制"
    }
    
    # vs 单代理
    COMPARISON = {
        "单代理": {
            "能力": "全能但深度有限",
            "扩展": "靠增加模型能力",
            "复杂任务": "处理能力有限"
        },
        "多代理": {
            "能力": "分工明确，专业深入",
            "扩展": "增加代理数量",
            "复杂任务": "分工协作，处理能力强"
        }
    }
```

### 为什么需要多代理

| 场景 | 单代理局限 | 多代理优势 |
|------|------------|------------|
| 软件开发 | 全栈但深度不够 | 前端/后端/测试分工 |
| 客服 | 回答不够专业 | 售前/售后/技术分工 |
| 研究 | 能力有限 | 检索/分析/写作分工 |
| 内容创作 | 质量一般 | 策划/写作/审核分工 |

---

## 架构模式

### 1. 层级架构

```python
# 层级架构
class HierarchicalArchitecture:
    """层级架构"""
    
    """
    ┌─────────────┐
    │   Manager   │  ← 任务分配、统筹协调
    │   Agent     │
    └──────┬──────┘
           │
    ┌──────┼──────┐
    ▼      ▼      ▼
┌─────┐ ┌─────┐ ┌─────┐
│Sub1 │ │Sub2 │ │Sub3 │  ← 执行具体任务
└─────┘ └─────┘ └─────┘
    """

# 实现示例
class ManagerAgent:
    """管理代理"""
    
    def __init__(self):
        self.workers = [
            WorkerAgent("researcher"),
            WorkerAgent("writer"),
            WorkerAgent("reviewer")
        ]
    
    def process(self, task):
        # 分解任务
        subtasks = self.decompose(task)
        
        # 分配给worker
        results = []
        for subtask in subtasks:
            worker = self.select_worker(subtask)
            result = worker.execute(subtask)
            results.append(result)
        
        # 整合结果
        return self.integrate(results)
    
    def decompose(self, task):
        # 任务分解
        pass
    
    def select_worker(self, subtask):
        # 选择合适的worker
        return self.workers[0]
    
    def integrate(self, results):
        # 结果整合
        pass
```

### 2. 平行架构

```python
# 平行架构
class ParallelArchitecture:
    """平行架构"""
    
    """
    ┌──────────┐
    │  Task    │
    └────┬─────┘
         │
    ┌────┼────┬────┐
    ▼    ▼    ▼    ▼
  ┌───┐┌───┐┌───┐┌───┐
  │ A ││ B ││ C ││ D │  ← 同时执行
  └───┘└───┘└───┘└───┘
    │    │    │    │
    └────┼────┬────┘
         ▼    ▼
    ┌──────────┐
    │Integrator│  ← 结果整合
    └──────────┘
    """

# 实现
class ParallelAgents:
    def __init__(self, agents):
        self.agents = agents
    
    async def process(self, task):
        # 并行执行
        tasks = [agent.execute(task) for agent in self.agents]
        results = await asyncio.gather(*tasks)
        
        # 整合
        return self.integrate(results)
```

### 3. 网状架构

```python
# 网状架构
class MeshArchitecture:
    """网状架构（去中心化）"""
    
    """
        ┌───┐
        │ A │──┐
        └───┘  │
    ┌───────┐ │
    │   ┌───┴─┐
    ▼   ▼     ▼
  ┌───┐┌───┐┌───┐
  │ B ││ C ││ D │
  └───┘└───┘└───┘
    ↘ ↙ ↘ ↙
    ┌───┐┌───┐
    │ E ││ F │
    └───┘└───┘
    """
```

### 4. 圆环架构

```python
# 圆环架构（按序传递）
class PipelineArchitecture:
    """圆环/流水线架构"""
    
    """
    ┌────┐   ┌────┐   ┌────┐   ┌────┐
    │ A  │──▶│ B  │──▶│ C  │──▶│ D  │
    └────┘   └────┘   └────┘   └────┘
    """
    
# 实现
class PipelineAgent:
    def __init__(self, stages):
        self.stages = stages
    
    async def process(self, input_data):
        current = input_data
        
        for stage in self.stages:
            current = await stage.process(current)
        
        return current
```

---

## 通信机制

### 1. 消息类型

```python
# 消息类型
class MessageTypes:
    """代理间消息类型"""
    
    # 请求消息
    REQUEST = {
        "type": "request",
        "fields": ["action", "parameters", "callback"],
        "示例": "writer请求researcher提供素材"
    }
    
    # 响应消息
    RESPONSE = {
        "type": "response",
        "fields": ["status", "result", "error"],
        "示例": "researcher返回研究结果"
    }
    
    # 通知消息
    NOTIFICATION = {
        "type": "notification",
        "fields": ["event", "data"],
        "示例": "manager通知任务完成"
    }
    
    # 广播消息
    BROADCAST = {
        "type": "broadcast",
        "fields": ["message", "scope"],
        "示例": "全员广播新任务"
    }
```

### 2. 通信协议

```python
# 通信协议实现
class AgentCommunication:
    """代理通信"""
    
    def __init__(self):
        self.message_queue = asyncio.Queue()
        self.handlers = {}
    
    async def send(self, from_agent, to_agent, message):
        """发送消息"""
        envelope = {
            "from": from_agent,
            "to": to_agent,
            "message": message,
            "timestamp": time.time()
        }
        await self.message_queue.put(envelope)
    
    async def receive(self, agent):
        """接收消息"""
        while True:
            envelope = await self.message_queue.get()
            
            if envelope["to"] == agent:
                return envelope["message"]
    
    async def broadcast(self, from_agent, message):
        """广播"""
        for agent in self.all_agents:
            if agent != from_agent:
                await self.send(from_agent, agent, message)
```

### 3. 共享内存

```python
# 共享内存/黑板
class SharedMemory:
    """共享内存（黑板模式）"""
    
    def __init__(self):
        self.data = {}
        self.lock = asyncio.Lock()
    
    async def write(self, key, value):
        """写入"""
        async with self.lock:
            self.data[key] = {
                "value": value,
                "timestamp": time.time(),
                "author": asyncio.current_task().name
            }
    
    async def read(self, key):
        """读取"""
        async with self.lock:
            return self.data.get(key)
    
    async def subscribe(self, key, callback):
        """订阅变化"""
        # 监听key的变化
        pass
```

---

## 协作策略

### 1. 任务分配

```python
# 任务分配策略
class TaskAllocation:
    """任务分配"""
    
    # 静态分配
    STATIC = {
        "原理": "预先定义每个代理的职责",
        "优点": "简单、可预测",
        "缺点": "不够灵活"
    }
    
    # 动态分配
    DYNAMIC = {
        "原理": "根据任务动态选择代理",
        "优点": "灵活、效率高",
        "缺点": "复杂度高"
    }
    
    # 实现
    async def allocate(self, task, agents):
        # 评估每个代理的能力
        scores = []
        for agent in agents:
            score = await self.evaluate(task, agent)
            scores.append(score)
        
        # 选择最佳
        best_idx = scores.index(max(scores))
        return agents[best_idx]
    
    async def evaluate(self, task, agent):
        # 匹配度评估
        return agent.capability_match(task)
```

### 2. 结果融合

```python
# 结果融合
class ResultFusion:
    """结果融合策略"""
    
    # 投票
    VOTING = {
        "方法": "多个代理结果投票",
        "适用": "离散选择"
    }
    
    # 加权平均
    WEIGHTED_AVG = {
        "方法": "根据可信度加权",
        "适用": "连续值"
    }
    
    # 串联
    CHAINING = {
        "方法": "一个代理输出作为下一个输入",
        "适用": "逐步处理"
    }
    
    # 选择最佳
    SELECT_BEST = {
        "方法": "选择最符合标准的",
        "适用": "质量评估"
    }
```

### 3. 冲突解决

```python
# 冲突解决
class ConflictResolution:
    """冲突解决策略"""
    
    # 优先级
    PRIORITY = {
        "方法": "按预设优先级解决",
        "示例": "manager的决策优先"
    }
    
    # 协商
    NEGOTIATION = {
        "方法": "代理间协商达成一致",
        "示例": "讨论后决定"
    }
    
    # 投票
    VOTING = {
        "方法": "多数投票",
        "示例": "少数服从多数"
    }
    
    # 上报
    ESCALATE = {
        "方法": "上报给上级决策",
        "示例": "manager决定"
    }
```

---

## 实现框架

### 1. AutoGen

```python
# AutoGen 实现
from autogen import ConversableAgent, GroupChat, GroupChatManager

# 创建代理
assistant = ConversableAgent(
    name="assistant",
    system_message="你是一个助手",
    llm_config={"model": "gpt-4"}
)

critic = ConversableAgent(
    name="critic",
    system_message="你负责审查和批评",
    llm_config={"model": "gpt-4"}
)

# 创建群组
group_chat = GroupChat(
    agents=[assistant, critic],
    messages=[],
    max_round=5
)

# 创建管理器
manager = GroupChatManager(
    groupchat=group_chat,
    llm_config={"model": "gpt-4"}
)

# 启动对话
assistant.initiate_chat(
    manager,
    message="写一首关于春天的诗"
)
```

### 2. CrewAI

```python
# CrewAI 实现
from crewai import Agent, Task, Crew

# 创建代理
researcher = Agent(
    role="研究员",
    goal="收集相关信息",
    backstory="你是资深研究员，擅长信息收集",
    verbose=True
)

writer = Agent(
    role="作家",
    goal="撰写高质量内容",
    backstory="你是专业作家，擅长写作",
    verbose=True
)

# 创建任务
research_task = Task(
    description="研究AI最新发展",
    agent=researcher
)

write_task = Task(
    description="基于研究写文章",
    agent=writer,
    context=[research_task]  # 依赖research任务
)

# 创建crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    verbose=True
)

# 执行
result = crew.kickoff()
```

### 3. LangGraph

```python
# LangGraph 实现
from langgraph.graph import StateGraph, END
from typing import TypedDict

# 定义状态
class AgentState(TypedDict):
    messages: list
    current_task: str
    results: dict

# 创建节点
def researcher_node(state):
    # 执行研究
    result = research(state["current_task"])
    return {"results": {"research": result}}

def writer_node(state):
    # 执行写作
    result = write(state["results"]["research"])
    return {"results": {"writer": result}}

def reviewer_node(state):
    # 执行审查
    result = review(state["results"])
    return {"results": {"reviewer": result}}

# 构建图
graph = StateGraph(AgentState)
graph.add_node("researcher", researcher_node)
graph.add_node("writer", writer_node)
graph.add_node("reviewer", reviewer_node)

graph.set_entry_point("researcher")
graph.add_edge("researcher", "writer")
graph.add_edge("writer", "reviewer")
graph.add_edge("reviewer", END)

app = graph.compile()
```

---

## 实践案例

### 案例一：软件开发团队

```python
# 软件开发多代理系统
class SoftwareDevTeam:
    """软件开发团队"""
    
    AGENTS = {
        "architect": {
            "role": "架构师",
            "responsibility": "设计系统架构",
            "tools": ["design_patterns", "best_practices"]
        },
        "backend": {
            "role": "后端工程师",
            "responsibility": "实现后端逻辑",
            "tools": ["python", "database", "api"]
        },
        "frontend": {
            "role": "前端工程师",
            "responsibility": "实现前端界面",
            "tools": ["react", "css", "javascript"]
        },
        "tester": {
            "role": "测试工程师",
            "responsibility": "编写测试用例",
            "tools": ["pytest", "selenium"]
        },
        "reviewer": {
            "role": "代码审查员",
            "responsibility": "审查代码质量",
            "tools": ["lint", "security_scan"]
        }
    }
    
    WORKFLOW = """
    1. architect: 设计系统架构
    2. backend + frontend: 并行开发
    3. tester: 编写测试
    4. reviewer: 代码审查
    5. 整合发布
    """
```

### 案例二：内容生产团队

```python
# 内容生产团队
class ContentProduction:
    """内容生产多代理"""
    
    AGENTS = {
        "planner": {
            "role": "策划",
            "responsibility": "确定主题和结构"
        },
        "researcher": {
            "role": "资料收集",
            "responsibility": "收集素材和数据"
        },
        "writer": {
            "role": "写作",
            "responsibility": "撰写内容"
        },
        "editor": {
            "role": "编辑",
            "responsibility": "修改润色"
        },
        "designer": {
            "role": "设计",
            "responsibility": "配图和排版"
        }
    }
```

---

## 最佳实践

### 1. 设计原则

```python
# 多代理设计原则
DesignPrinciples = {
    "单一职责": "每个代理只负责特定任务",
    "清晰接口": "明确定义代理间接口",
    "松耦合": "减少代理间依赖",
    "可扩展": "容易添加新代理",
    "容错": "部分代理失败不影响整体"
}
```

### 2. 通信优化

```python
# 通信优化
CommunicationOptimization = {
    "减少通信": "只传递必要信息",
    "异步通信": "非关键路径异步处理",
    "批量处理": "多条消息合并处理",
    "压缩": "大消息进行压缩"
}
```

### 3. 监控

```python
# 多代理监控
class MultiAgentMonitor:
    """代理监控"""
    
    def __init__(self):
        self.metrics = {}
    
    def record_task(self, agent, task, duration, result):
        self.metrics[agent] = {
            "tasks": self.metrics.get(agent, {}).get("tasks", 0) + 1,
            "total_duration": self.metrics.get(agent, {}).get("total_duration", 0) + duration,
            "success_rate": self.calculate_success_rate(agent)
        }
    
    def get_stats(self):
        return self.metrics
```

---

## 总结

Multi-Agent Systems 核心要点：

1. **架构模式**：层级、平行、网状、流水线
2. **通信机制**：消息类型、协议、共享内存
3. **协作策略**：任务分配、结果融合、冲突解决
4. **框架**：AutoGen、CrewAI、LangGraph
5. **最佳实践**：单一职责、松耦合、可扩展

**应用场景**：软件开发、内容创作、客服系统、研究分析

---

*📅 更新时间：2026-04-01 | 版本：1.0*