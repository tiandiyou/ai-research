# AI Agent架构设计模式：企业级应用实战指南

> **文档编号**：AI-Tech-024  
> **撰写日期**：2026-03-30  
> **话题热度**：🔥🔥🔥🔥🔥（Agent核心架构）  
> **目标读者**：AI架构师、Agent开发者、技术负责人  
> **字数**：约10000字  
> **版本**：v1.0  
> **分类**：05-llm-applications

---

## 一、Agent架构概述

### 1.1 什么是AI Agent

AI Agent（智能代理）是一种能够自主感知环境、制定计划、执行动作并评估结果的AI系统。与简单的LLM调用不同，Agent具备：

1. **自主规划**：分解复杂任务为可执行步骤
2. **工具使用**：调用外部API、数据库、工具函数
3. **记忆系统**：保持会话上下文和长期知识
4. **反思能力**：评估自身行为并改进
5. **多Agent协作**：多个Agent分工合作完成复杂任务

### 1.2 Agent核心组件

```
AI Agent架构：

┌─────────────────────────────────────────────────────────┐
│                     用户交互层                           │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                     规划引擎                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ 任务分解    │  │ 步骤排序    │  │ 备选方案    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                     工具层                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  │搜索API  │ │数据库   │ │代码执行  │ │文件操作  │     │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                     记忆系统                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │短期记忆     │  │长期记忆     │  │向量存储     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                     反思评估                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ 结果验证    │  │ 错误恢复    │  │ 自我改进    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 1.3 Agent与传统LLM调用的区别

| 特性 | 传统LLM调用 | AI Agent |
|------|-------------|----------|
| 交互方式 | 单次请求-响应 | 多轮交互 |
| 工具使用 | 无 | 支持 |
| 规划能力 | 无 | 任务分解 |
| 记忆能力 | 无上下文 | 持久上下文 |
| 错误处理 | 无 | 自动重试 |
| 自主程度 | 低 | 高 |

## 二、ReAct架构模式

### 2.1 ReAct原理

ReAct（Reasoning + Acting）是一种结合推理和行动的架构模式，让Agent在思考过程中交替进行推理和行动。

```
ReAct流程：

Thought: 我需要先搜索相关信息
Action: search[量子计算]
Observation: 量子计算是一种利用量子力学原理...

Thought: 根据搜索结果，我需要了解更多细节
Action: search[量子计算应用]
Observation: 量子计算主要应用在密码学、药物研发...

Thought: 现在我有足够信息来回答用户问题了
Action: finish[量子计算是...]
```

### 2.2 ReAct实现

```python
from enum import Enum
from typing import List, Dict, Any, Optional
import json

class ActionType(Enum):
    SEARCH = "search"
    LOOKUP = "lookup"
    FINISH = "finish"
    CALCULATE = "calculate"

class ReActAgent:
    def __init__(self, llm, tools: Dict[str, callable], max_iterations=10):
        self.llm = llm
        self.tools = tools
        self.max_iterations = max_iterations
        self.temperature = 0.7
    
    def run(self, task: str) -> str:
        """执行任务"""
        history = []
        
        for i in range(self.max_iterations):
            # 构建Prompt
            prompt = self._build_prompt(task, history)
            
            # 调用LLM
            response = self.llm.generate(prompt, temperature=self.temperature)
            
            # 解析Action
            thought, action, action_input = self._parse_response(response)
            
            # 记录历史
            history.append({
                "thought": thought,
                "action": action,
                "action_input": action_input
            })
            
            # 执行Action
            if action == ActionType.FINISH.value:
                return action_input
            
            # 执行工具
            observation = self._execute_tool(action, action_input)
            history.append({"observation": observation})
        
        return "任务未完成"
    
    def _build_prompt(self, task: str, history: List[Dict]) -> str:
        """构建Prompt"""
        prompt = f"""任务: {task}

你是一个ReAct Agent。请按照以下格式思考和行动：
Thought: 你对当前情况的思考
Action: 要执行的动作（search/lookup/finish/calculate）
Action Input: 动作的输入

可用工具:
{', '.join(self.tools.keys())}

"""
        
        # 添加历史
        for h in history:
            if "thought" in h:
                prompt += f"\nThought: {h['thought']}"
                prompt += f"\nAction: {h['action']}"
                prompt += f"\nAction Input: {h['action_input']}"
            if "observation" in h:
                prompt += f"\nObservation: {h['observation']}"
        
        prompt += "\n\n请继续："
        
        return prompt
    
    def _parse_response(self, response: str) -> tuple:
        """解析LLM响应"""
        lines = response.strip().split("\n")
        
        thought = ""
        action = ""
        action_input = ""
        
        for line in lines:
            if line.startswith("Thought:"):
                thought = line.replace("Thought:", "").strip()
            elif line.startswith("Action:"):
                action = line.replace("Action:", "").strip()
            elif line.startswith("Action Input:"):
                action_input = line.replace("Action Input:", "").strip()
        
        return thought, action, action_input
    
    def _execute_tool(self, action: str, action_input: str) -> str:
        """执行工具"""
        if action in self.tools:
            try:
                result = self.tools[action](action_input)
                return str(result)
            except Exception as e:
                return f"Error: {str(e)}"
        return f"Unknown action: {action}"
```

### 2.3 ReAct改进版

```python
class ReActPlus(ReActAgent):
    """ReAct改进版，增加反思机制"""
    
    def run(self, task: str) -> str:
        history = []
        attempts = 0
        max_attempts = 3
        
        while attempts < max_attempts:
            for i in range(self.max_iterations):
                prompt = self._build_prompt(task, history)
                response = self.llm.generate(prompt, temperature=self.temperature)
                
                thought, action, action_input = self._parse_response(response)
                
                history.append({
                    "thought": thought,
                    "action": action,
                    "action_input": action_input
                })
                
                if action == ActionType.FINISH.value:
                    # 验证结果
                    result = self._verify_result(action_input, task)
                    if result["valid"]:
                        return result["response"]
                    else:
                        # 添加验证反馈到历史
                        history.append({
                            "observation": f"验证失败: {result['reason']}"
                        })
                
                observation = self._execute_tool(action, action_input)
                history.append({"observation": observation})
            
            attempts += 1
        
        return "多次尝试后任务仍未完成"
    
    def _verify_result(self, response: str, task: str) -> Dict:
        """验证结果质量"""
        # 简单验证：检查响应长度、关键词等
        if len(response) < 10:
            return {"valid": False, "reason": "响应过短"}
        
        # 可以调用LLM进行更复杂的验证
        verify_prompt = f"""任务: {task}
回答: {response}
请验证这个回答是否完整准确地回答了任务。"""
        
        # ... 验证逻辑
        
        return {"valid": True, "response": response}
```

## 三、Tool Use架构模式

### 3.1 工具注册与管理

```python
from typing import Dict, Callable, Any
import inspect

class ToolRegistry:
    def __init__(self):
        self.tools: Dict[str, Callable] = {}
        self.metadata: Dict[str, Dict] = {}
    
    def register(self, name: str = None, description: str = "", parameters: Dict = None):
        """装饰器注册工具"""
        def decorator(func: Callable) -> Callable:
            tool_name = name or func.__name__
            self.tools[tool_name] = func
            self.metadata[tool_name] = {
                "description": description or func.__doc__,
                "parameters": parameters or self._extract_parameters(func),
                "func": func
            }
            return func
        
        return decorator
    
    def _extract_parameters(self, func: Callable) -> Dict:
        """提取函数参数"""
        sig = inspect.signature(func)
        params = {}
        
        for name, param in sig.parameters.items():
            params[name] = {
                "type": param.annotation.__name__ if param.annotation != inspect.Parameter.empty else "any",
                "required": param.default == inspect.Parameter.empty
            }
        
        return params
    
    def get_tool(self, name: str) -> Callable:
        return self.tools.get(name)
    
    def list_tools(self) -> List[Dict]:
        return [
            {"name": name, **meta}
            for name, meta in self.metadata.items()
        ]
```

### 3.2 工具定义示例

```python
# 创建工具注册表
registry = ToolRegistry()

@registry.register(name="search", description="搜索互联网获取信息")
def search(query: str) -> str:
    """搜索互联网"""
    # 实际实现调用搜索API
    return f"搜索结果: {query}"

@registry.register(name="calculator", description="执行数学计算")
def calculate(expression: str) -> str:
    """计算数学表达式"""
    try:
        result = eval(expression)
        return str(result)
    except Exception as e:
        return f"计算错误: {e}"

@registry.register(name="read_file", description="读取文件内容")
def read_file(path: str) -> str:
    """读取文件"""
    with open(path, 'r') as f:
        return f.read()

@registry.register(name="write_file", description="写入文件")
def write_file(path: str, content: str) -> str:
    """写入文件"""
    with open(path, 'w') as f:
        f.write(content)
    return "文件写入成功"
```

### 3.3 动态工具选择

```python
class DynamicToolSelector:
    def __init__(self, llm, registry: ToolRegistry):
        self.llm = llm
        self.registry = registry
    
    def select_tools(self, task: str, max_tools: int = 3) -> List[str]:
        """根据任务动态选择工具"""
        # 构建工具选择Prompt
        tool_descriptions = "\n".join([
            f"- {name}: {meta['description']}"
            for name, meta in self.registry.metadata.items()
        ])
        
        select_prompt = f"""任务: {task}

可用工具:
{tool_descriptions}

请选择最多{max_tools}个最相关的工具，只返回工具名称，用逗号分隔。
"""
        
        response = self.llm.generate(select_prompt, temperature=0.3)
        
        # 解析工具名称
        tool_names = [
            name.strip() 
            for name in response.strip().split(",")
            if name.strip() in self.registry.tools
        ]
        
        return tool_names[:max_tools]
```

## 四、记忆架构模式

### 4.1 分层记忆系统

```python
from typing import List, Dict, Any
import json
from datetime import datetime

class MemorySystem:
    def __init__(self, vector_store, max_short_term=10):
        self.short_term: List[Dict] = []  # 短期记忆
        self.long_term: List[Dict] = []   # 长期记忆
        self.vector_store = vector_store  # 向量存储
        self.max_short_term = max_short_term
    
    def add(self, content: str, memory_type: str = "short"):
        """添加记忆"""
        memory = {
            "content": content,
            "type": memory_type,
            "timestamp": datetime.now().isoformat()
        }
        
        if memory_type == "short":
            self.short_term.append(memory)
            
            # 超过容量时转移到长期记忆
            if len(self.short_term) > self.max_short_term:
                self._compress_to_long_term()
        else:
            self.long_term.append(memory)
            
            # 同时存入向量存储
            self.vector_store.add(memory)
    
    def get_relevant(self, query: str, top_k: int = 5) -> List[str]:
        """获取相关记忆"""
        # 搜索向量存储
        results = self.vector_store.search(query, top_k)
        
        # 合并短期记忆
        relevant_short = self._search_short_term(query, top_k)
        
        # 合并结果
        all_results = results + relevant_short
        
        # 去重并返回
        seen = set()
        unique_results = []
        for r in all_results:
            if r["content"] not in seen:
                seen.add(r["content"])
                unique_results.append(r["content"])
        
        return unique_results[:top_k]
    
    def _compress_to_long_term(self):
        """压缩短期记忆到长期记忆"""
        if not self.short_term:
            return
        
        # 保留最近的几条
        recent = self.short_term[-self.max_short_term//2:]
        old = self.short_term[:-self.max_short_term//2]
        
        # 将旧的转移到长期记忆
        self.long_term.extend(old)
        self.short_term = recent
        
        # 存入向量存储
        for memory in old:
            self.vector_store.add(memory)
    
    def _search_short_term(self, query: str, top_k: int) -> List[Dict]:
        """搜索短期记忆"""
        # 简单关键词匹配
        results = []
        for memory in self.short_term[-top_k*2:]:
            if any(word in memory["content"].lower() for word in query.lower().split()):
                results.append(memory)
        
        return results[:top_k]
```

### 4.2 向量记忆实现

```python
import numpy as np
from typing import List, Tuple

class VectorMemory:
    def __init__(self, embedding_model, dimension: int = 768):
        self.embedding_model = embedding_model
        self.dimension = dimension
        self.vectors: List[np.ndarray] = []
        self.memories: List[Dict] = []
    
    def add(self, memory: Dict):
        """添加记忆到向量存储"""
        # 生成embedding
        embedding = self.embedding_model.encode(memory["content"])
        
        self.vectors.append(embedding)
        self.memories.append(memory)
    
    def search(self, query: str, top_k: int = 5) -> List[Dict]:
        """向量相似性搜索"""
        if not self.vectors:
            return []
        
        # 生成查询embedding
        query_embedding = self.embedding_model.encode(query)
        
        # 计算余弦相似度
        similarities = []
        for vec in self.vectors:
            sim = self._cosine_similarity(query_embedding, vec)
            similarities.append(sim)
        
        # 获取top_k
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        return [self.memories[i] for i in top_indices]
    
    def _cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        """计算余弦相似度"""
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
```

### 4.3 记忆总结机制

```python
class MemorySummary:
    def __init__(self, llm, max_tokens: int = 2000):
        self.llm = llm
        self.max_tokens = max_tokens
    
    def summarize_conversation(self, messages: List[Dict]) -> str:
        """总结对话"""
        # 构建对话文本
        conversation = "\n".join([
            f"{m.get('role', 'user')}: {m.get('content', '')}"
            for m in messages
        ])
        
        # 调用LLM总结
        summary_prompt = f"""请简洁总结以下对话的要点：
        
{conversation}

要点总结："""
        
        summary = self.llm.generate(summary_prompt, temperature=0.5)
        
        return summary.strip()
    
    def extract_key_info(self, content: str) -> Dict:
        """提取关键信息"""
        extract_prompt = f"""从以下内容中提取关键信息，JSON格式：

内容：{content}

提取信息：
{{
    "entities": [],  // 实体
    "facts": [],    // 事实
    "actions": [],  // 动作
    "dates": []     // 日期
}}
"""
        
        response = self.llm.generate(extract_prompt, temperature=0.3)
        
        try:
            return json.loads(response)
        except:
            return {"entities": [], "facts": [], "actions": [], "dates": []}
```

## 五、多Agent协作架构

### 5.1 Manager-Agent模式

```python
class ManagerAgent:
    def __init__(self, llm, workers: List['BaseAgent']):
        self.llm = llm
        self.workers = workers
        self.task_queue = []
    
    def assign_task(self, task: str) -> str:
        """分配任务给合适的Worker"""
        # 分析任务需求
        requirements = self._analyze_task(task)
        
        # 选择最合适的Worker
        selected_worker = self._select_worker(requirements)
        
        # 分配任务
        result = selected_worker.execute(task)
        
        # 整合结果
        return self._integrate_result(task, result)
    
    def _analyze_task(self, task: str) -> Dict:
        """分析任务需求"""
        analysis_prompt = f"""分析以下任务的需求：

任务: {task}

请输出JSON格式的分析结果：
{{
    "required_skills": [],
    "complexity": "high/medium/low",
    "domain": "general/coding/research/..."
}}
"""
        
        response = self.llm.generate(analysis_prompt, temperature=0.3)
        
        try:
            return json.loads(response)
        except:
            return {"required_skills": [], "complexity": "medium", "domain": "general"}
    
    def _select_worker(self, requirements: Dict) -> 'BaseAgent':
        """选择最合适的Worker"""
        # 简单选择：随机或轮询
        # 实际可以根据Worker的能力标签选择
        return self.workers[len(self.task_queue) % len(self.workers)]
    
    def _integrate_result(self, task: str, result: str) -> str:
        """整合Worker的结果"""
        integrate_prompt = f"""任务: {task}
Worker结果: {result}

请整合结果，给出最终回答："""
        
        return self.llm.generate(integrate_prompt, temperature=0.5)
```

### 5.2 Debate-Agent模式

```python
class DebateAgent:
    def __init__(self, llm, num_agents: int = 3):
        self.llm = llm
        self.num_agents = num_agents
        self.agents_perspectives = []
    
    def debate(self, topic: str, max_rounds: int = 3) -> str:
        """多Agent辩论"""
        # 初始化不同观点的Agent
        self._init_perspectives(topic)
        
        # 辩论多轮
        for round_num in range(max_rounds):
            for i, agent_perspective in enumerate(self.agents_perspectives):
                # Agent发表观点
                response = self._agent_speak(agent_perspective, round_num)
                
                # 记录观点
                agent_perspective["responses"].append(response)
        
        # 最终总结
        return self._summarize_debate(topic)
    
    def _init_perspectives(self, topic: str):
        """初始化不同观点"""
        base_perspectives = [
            "乐观支持",
            "谨慎质疑",
            "中立分析"
        ]
        
        self.agents_perspectives = [
            {
                "perspective": p,
                "responses": []
            }
            for p in base_perspectives
        ]
    
    def _agent_speak(self, agent_perspective: Dict, round_num: int) -> str:
        """Agent发表观点"""
        history = "\n".join([
            f"Agent {i+1}: {r}"
            for i, ap in enumerate(self.agents_perspectives)
            for r in ap.get("responses", [])
        ])
        
        speak_prompt = f"""话题: {topic}
你的观点: {agent_perspective['perspective']}

之前的讨论:
{history}

请发表你的观点："""
        
        return self.llm.generate(speak_prompt, temperature=0.7)
    
    def _summarize_debate(self, topic: str) -> str:
        """总结辩论结果"""
        all_responses = "\n".join([
            f"{ap['perspective']}: {'; '.join(ap['responses'])}"
            for ap in self.agents_perspectives
        ])
        
        summary_prompt = f"""话题: {topic}
各方观点:
{all_responses}

请总结辩论的核心结论："""
        
        return self.llm.generate(summary_prompt, temperature=0.5)
```

### 5.3 Plan-Execute模式

```python
class PlanExecuteAgent:
    def __init__(self, llm, tools: Dict[str, Callable]):
        self.llm = llm
        self.tools = tools
    
    def run(self, task: str) -> str:
        """Plan-Execute模式"""
        # 阶段1：规划
        plan = self._create_plan(task)
        
        # 阶段2：执行
        results = self._execute_plan(plan)
        
        # 阶段3：整合
        return self._integrate_results(task, results)
    
    def _create_plan(self, task: str) -> List[Dict]:
        """创建执行计划"""
        plan_prompt = f"""任务: {task}

请制定详细的执行计划，JSON数组格式：
[
    {{"step": 1, "action": "xxx", "input": "xxx"}},
    {{"step": 2, "action": "xxx", "input": "xxx"}}
]
"""
        
        response = self.llm.generate(plan_prompt, temperature=0.3)
        
        try:
            return json.loads(response)
        except:
            return []
    
    def _execute_plan(self, plan: List[Dict]) -> List[Dict]:
        """执行计划"""
        results = []
        
        for step in plan:
            action = step.get("action")
            input_val = step.get("input")
            
            try:
                if action in self.tools:
                    result = self.tools[action](input_val)
                else:
                    result = self.llm.generate(input_val)
                
                results.append({
                    "step": step.get("step"),
                    "action": action,
                    "result": result,
                    "success": True
                })
            except Exception as e:
                results.append({
                    "step": step.get("step"),
                    "action": action,
                    "error": str(e),
                    "success": False
                })
        
        return results
    
    def _integrate_results(self, task: str, results: List[Dict]) -> str:
        """整合结果"""
        result_text = "\n".join([
            f"步骤{r['step']}: {r.get('result', r.get('error'))}"
            for r in results
        ])
        
        integrate_prompt = f"""原始任务: {task}

执行结果:
{result_text}

请给出最终回答："""
        
        return self.llm.generate(integrate_prompt, temperature=0.5)
```

## 六、Agent评估与监控

### 6.1 评估指标

```python
from typing import Dict, List
import time

class AgentEvaluator:
    def __init__(self, agent, test_cases: List[Dict]):
        self.agent = agent
        self.test_cases = test_cases
    
    def evaluate(self) -> Dict:
        """综合评估"""
        results = []
        
        for test in self.test_cases:
            start_time = time.time()
            
            try:
                result = self.agent.run(test["task"])
                elapsed = time.time() - start_time
                
                # 计算各项指标
                success = self._check_success(result, test["expected"])
                quality = self._evaluate_quality(result, test.get("criteria", {}))
                
                results.append({
                    "task": test["task"],
                    "success": success,
                    "quality": quality,
                    "time": elapsed,
                    "result": result
                })
            except Exception as e:
                results.append({
                    "task": test["task"],
                    "success": False,
                    "error": str(e),
                    "time": time.time() - start_time
                })
        
        return self._compute_metrics(results)
    
    def _check_success(self, result: str, expected: str) -> bool:
        """检查是否成功"""
        # 简单匹配：检查关键词
        expected_keywords = expected.lower().split()
        return any(kw in result.lower() for kw in expected_keywords)
    
    def _evaluate_quality(self, result: str, criteria: Dict) -> float:
        """评估质量"""
        if not criteria:
            return 0.5
        
        # 简单评分
        score = 0.5
        
        if "min_length" in criteria and len(result) >= criteria["min_length"]:
            score += 0.1
        
        if "keywords" in criteria:
            keywords_found = sum(1 for kw in criteria["keywords"] if kw in result.lower())
            score += keywords_found / len(criteria["keywords"]) * 0.4
        
        return min(1.0, score)
    
    def _compute_metrics(self, results: List[Dict]) -> Dict:
        """计算评估指标"""
        total = len(results)
        success_count = sum(1 for r in results if r.get("success", False))
        
        return {
            "total_cases": total,
            "success_rate": success_count / total if total > 0 else 0,
            "avg_time": sum(r.get("time", 0) for r in results) / total if total > 0 else 0,
            "avg_quality": sum(r.get("quality", 0) for r in results) / total if total > 0 else 0
        }
```

### 6.2 运行时监控

```python
import logging
from datetime import datetime

class AgentMonitor:
    def __init__(self, agent):
        self.agent = agent
        self.logger = logging.getLogger("agent_monitor")
        self.metrics = {
            "total_requests": 0,
            "successful_requests": 0,
            "failed_requests": 0,
            "total_tokens": 0,
            "total_time": 0,
            "tool_usage": {}
        }
    
    def log_request(self, task: str, result: str, duration: float, tokens: int = 0):
        """记录请求"""
        self.metrics["total_requests"] += 1
        
        if result:
            self.metrics["successful_requests"] += 1
        else:
            self.metrics["failed_requests"] += 1
        
        self.metrics["total_tokens"] += tokens
        self.metrics["total_time"] += duration
    
    def log_tool_usage(self, tool_name: str):
        """记录工具使用"""
        self.metrics["tool_usage"][tool_name] = self.metrics["tool_usage"].get(tool_name, 0) + 1
    
    def get_report(self) -> Dict:
        """获取监控报告"""
        return {
            "timestamp": datetime.now().isoformat(),
            "metrics": self.metrics,
            "success_rate": self.metrics["successful_requests"] / max(1, self.metrics["total_requests"]),
            "avg_time": self.metrics["total_time"] / max(1, self.metrics["total_requests"]),
            "top_tools": sorted(
                self.metrics["tool_usage"].items(), 
                key=lambda x: x[1], 
                reverse=True
            )[:5]
        }
```

## 七、生产环境最佳实践

### 7.1 错误处理与重试

```python
import time
from functools import wraps

def retry_on_failure(max_retries: int = 3, delay: float = 1.0):
    """重试装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_retries - 1:
                        time.sleep(delay * (attempt + 1))
            
            raise last_exception
        
        return wrapper
    return decorator

@retry_on_failure(max_retries=3, delay=2.0)
def call_llm_with_retry(prompt: str) -> str:
    """带重试的LLM调用"""
    # ... LLM调用逻辑
    pass
```

### 7.2 安全与权限控制

```python
class AgentSecurity:
    def __init__(self):
        self.allowed_domains = set()
        self.blocked_patterns = []
        self.rate_limit = {"requests": 100, "window": 60}  # 每分钟100次
    
    def check_permission(self, action: str, params: Dict) -> bool:
        """检查权限"""
        # 检查速率限制
        if not self._check_rate_limit():
            return False
        
        # 检查危险操作
        if self._is_dangerous_action(action, params):
            return False
        
        return True
    
    def _check_rate_limit(self) -> bool:
        """检查速率限制"""
        # 简单实现：基于时间窗口
        current_time = time.time()
        
        # 实际需要使用Redis等存储
        return True
    
    def _is_dangerous_action(self, action: str, params: Dict) -> bool:
        """检查危险操作"""
        dangerous_actions = {"delete_file", "drop_table", "exec"}
        
        if action in dangerous_actions:
            return True
        
        return False
```

### 7.3 性能优化

```python
class AgentOptimizer:
    @staticmethod
    def batch_requests(requests: List[Dict], batch_size: int = 10) -> List[List[Dict]]:
        """批量请求优化"""
        batches = []
        
        for i in range(0, len(requests), batch_size):
            batches.append(requests[i:i + batch_size])
        
        return batches
    
    @staticmethod
    def cache_results(agent_func, cache_ttl: int = 3600):
        """结果缓存"""
        cache = {}
        
        @wraps(agent_func)
        def wrapper(*args, **kwargs):
            # 生成缓存key
            key = str(args) + str(kwargs)
            
            if key in cache:
                cached_time, cached_result = cache[key]
                if time.time() - cached_time < cache_ttl:
                    return cached_result
            
            result = agent_func(*args, **kwargs)
            cache[key] = (time.time(), result)
            
            return result
        
        return wrapper
```

## 八、总结与最佳实践

### 8.1 架构选择建议

| 场景 | 推荐架构 |
|------|----------|
| 简单问答 | ReAct |
| 工具调用 | Tool Use |
| 多轮对话 | 分层记忆 |
| 复杂任务 | Plan-Execute |
| 多角度分析 | Debate |
| 大规模应用 | Manager-Agent |

### 8.2 常见问题

**问题1：Agent陷入循环**
- 解决：设置最大迭代次数，加入反思机制

**问题2：工具选择错误**
- 解决：增强工具描述，优化选择Prompt

**问题3：上下文丢失**
- 解决：使用分层记忆系统，定期总结

**问题4：响应质量不稳定**
- 解决：加入结果验证，多Agent投票

### 8.3 工具推荐

| 框架 | 特点 |
|------|------|
| LangChain | 生态丰富 |
| LangGraph | 可视化流程 |
| AutoGen | 多Agent框架 |
| CrewAI | 角色扮演 |
| OpenAI Assistants | 官方方案 |

---

**更新日志**：
- 2026-03-30: 初始版本创建（v1.0）