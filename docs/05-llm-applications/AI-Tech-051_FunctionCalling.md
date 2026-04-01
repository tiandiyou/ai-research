# Function Calling 完全指南

> 2026-04-01 | 技术文档 | 预计阅读时间：24分钟

---

## 目录

1. [Function Calling 概述](#function-calling-概述)
2. [工作原理](#工作原理)
3. [实现方案](#实现方案)
4. [工具定义](#工具定义)
5. [错误处理](#错误处理)
6. [最佳实践](#最佳实践)
7. [案例实战](#案例实战)

---

## Function Calling 概述

### 什么是 Function Calling

Function Calling（函数调用）是 LLM 与外部系统交互的核心能力，允许模型：

- **调用外部工具**：执行 API 请求、数据库查询、文件操作
- **获取实时信息**：天气、股票、新闻等最新数据
- **执行动作**：发送邮件、创建任务、调度作业
- **增强回答**：结合外部知识提供更准确答案

```python
# Function Calling 流程
class FunctionCalling:
    """函数调用流程"""
    
    def call(self, user_query: str):
        # 1. 模型识别需要调用函数
        function_call = llm.detect_function(user_query)
        
        # 2. 提取函数参数
        params = llm.extract_params(function_call, user_query)
        
        # 3. 执行函数
        result = execute_function(function_call.name, params)
        
        # 4. 基于结果生成回答
        response = llm.generate(user_query, result)
        
        return response
```

### 为什么需要 Function Calling

| 能力 | 纯 LLM | + Function Calling |
|------|--------|---------------------|
| 知识时效 | 训练数据截止日 | 实时获取 |
| 外部系统 | 无法访问 | 可操作 |
| 准确性 | 可能幻觉 | 可验证 |
| 执行能力 | 仅文本 | 可执行动作 |

---

## 工作原理

### 1. 整体架构

```python
# Function Calling 架构
class FunctionCallingArchitecture:
    """
    ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
    │   User      │───▶│  LLM + Tools │───▶│  External APIs  │
    │  Query      │    │   Definition │    │  /DB /Files     │
    └─────────────┘    └──────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │   Result     │
                       │  Processing  │
                       └──────────────┘
"""

# 工作流程
WORKFLOW = """
1. 用户提问
   ↓
2. LLM 分析是否需要调用函数
   ↓ (需要)
3. 确定函数名称和参数
   ↓
4. 执行函数调用
   ↓
5. 获取返回结果
   ↓
6. 将结果融入上下文
   ↓
7. 生成最终回答
"""
```

### 2. 调用类型

```python
# Function Calling 调用类型
class CallTypes:
    """函数调用类型"""
    
    # 类型1：同步调用
    SYNC_CALL = {
        "描述": "立即执行，等待结果",
        "示例": "查询天气",
        "流程": "调用 → 等待 → 结果 → 回答"
    }
    
    # 类型2：流式调用
    STREAM_CALL = {
        "描述": "流式返回，逐步展示",
        "示例": "生成代码",
        "流程": "调用 → 流式返回 → 逐步展示"
    }
    
    # 类型3：批量调用
    BATCH_CALL = {
        "描述": "一次调用多个函数",
        "示例": "获取多源数据",
        "流程": "调用A+B → 结果AB → 综合回答"
    }
    
    # 类型4：并行调用
    PARALLEL_CALL = {
        "描述": "同时调用独立函数",
        "示例": "同时查天气和股票",
        "流程": "并行调用 → 合并结果 → 回答"
    }
```

---

## 实现方案

### 1. OpenAI 实现

```python
# OpenAI Function Calling
import openai

# 定义函数
functions = [
    {
        "name": "get_weather",
        "description": "获取指定城市的天气信息",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "城市名称，如北京、上海"
                },
                "date": {
                    "type": "string",
                    "description": "日期，默认为今天"
                }
            },
            "required": ["city"]
        }
    },
    {
        "name": "get_stock_price",
        "description": "获取股票价格",
        "parameters": {
            "type": "object",
            "properties": {
                "symbol": {
                    "type": "string",
                    "description": "股票代码，如 AAPL、TSLA"
                }
            },
            "required": ["symbol"]
        }
    }
]

# 调用 API
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "北京今天天气怎么样？"}
    ],
    functions=functions,
    function_call="auto"  # 或指定 "get_weather"
)

# 解析函数调用
message = response.choices[0].message

if message.function_call:
    function_name = message.function_call.name
    arguments = json.loads(message.function_call.arguments)
    
    # 执行函数
    if function_name == "get_weather":
        result = get_weather(arguments["city"])
    elif function_name == "get_stock_price":
        result = get_stock_price(arguments["symbol"])
    
    # 二次调用获取最终结果
    final_response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "北京今天天气怎么样？"},
            {"role": "assistant", "content": None, "function_call": message.function_call},
            {"role": "function", "name": function_name, "content": json.dumps(result)}
        ]
    )
```

### 2. Anthropic 实现

```python
# Anthropic (Claude) Function Calling
import anthropic

# Claude 通过 Tool Use 实现类似功能
client = anthropic.Anthropic()

# 定义工具
tools = [
    {
        "name": "weather_search",
        "description": "搜索天气信息",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "地点"},
                "forecast_days": {"type": "integer", "description": "预报天数"}
            },
            "required": ["location"]
        }
    },
    {
        "name": "web_search",
        "description": "搜索网络信息",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "搜索关键词"}
            },
            "required": ["query"]
        }
    }
]

# 调用
message = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=1024,
    messages=[{"role": "user", "content": "明天上海天气如何？"}],
    tools=tools
)

# 处理工具调用
for block in message.content:
    if block.type == "tool_use":
        tool_name = block.name
        tool_input = block.input
        
        # 执行工具
        result = execute_tool(tool_name, tool_input)
```

### 3. 开源模型实现

```python
# 使用 Transformers 实现 Function Calling
from transformers import AutoModelForCausalLM, AutoTokenizer

# 加载模型
model_name = "microsoft/Phi-3-mini-4k-instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# 准备工具描述
tools_prompt = """
你可以使用以下工具：
1. get_weather(location: str) - 获取天气
2. search_web(query: str) - 搜索网络

请根据用户问题选择合适的工具。
"""

# 构建提示
messages = [
    {"role": "system", "content": tools_prompt},
    {"role": "user", "content": "北京今天天气怎么样？"}
]

# 生成
inputs = tokenizer.apply_chat_template(messages, tokenize=True, return_tensors="pt")
outputs = model.generate(inputs, max_new_tokens=512)

# 解析输出
response = tokenizer.decode(outputs[0])
```

---

## 工具定义

### 1. 函数定义结构

```python
# 函数定义完整示例
function_definition = {
    # 必填：函数名称（唯一标识）
    "name": "create_task",
    
    # 必填：函数描述（帮助模型理解何时调用）
    "description": "创建一个新的任务条目",
    
    # 必填：参数 schema
    "parameters": {
        # 类型通常是 object
        "type": "object",
        
        # 属性定义
        "properties": {
            "title": {
                "type": "string",
                "description": "任务标题"
            },
            "description": {
                "type": "string",
                "description": "任务详细描述"
            },
            "due_date": {
                "type": "string",
                "description": "截止日期，格式 YYYY-MM-DD"
            },
            "priority": {
                "type": "string",
                "enum": ["low", "medium", "high"],
                "description": "优先级"
            },
            "tags": {
                "type": "array",
                "items": {"type": "string"},
                "description": "标签列表"
            }
        },
        
        # 必填参数
        "required": ["title"]
    }
}
```

### 2. 复杂参数类型

```python
# 复杂参数类型
complex_parameters = {
    "type": "object",
    "properties": {
        # 数组
        "users": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "name": {"type": "string"}
                }
            }
        },
        
        # 嵌套对象
        "config": {
            "type": "object",
            "properties": {
                "timeout": {"type": "integer"},
                "retry": {"type": "integer"},
                "headers": {
                    "type": "object",
                    "additionalProperties": {"type": "string"}
                }
            }
        },
        
        # 枚举
        "status": {
            "type": "string",
            "enum": ["pending", "processing", "completed", "failed"]
        },
        
        # 联合类型 (oneOf)
        "filter": {
            "oneOf": [
                {"type": "object", "properties": {"type": {"type": "string"}}},
                {"type": "array", "items": {"type": "string"}}
            ]
        }
    }
}
```

### 3. 函数分组

```python
# 函数分组管理
class ToolGroup:
    """函数分组"""
    
    GROUPS = {
        "天气查询": [
            "get_current_weather",
            "get_forecast",
            "get_weather_alert"
        ],
        "信息搜索": [
            "web_search",
            "wiki_search",
            "news_search"
        ],
        "数据处理": [
            "calculate",
            "convert_unit",
            "parse_date"
        ],
        "系统操作": [
            "send_email",
            "create_file",
            "execute_command"
        ]
    }
    
    @classmethod
    def get_tools(cls, group: str) -> List[str]:
        return cls.GROUPS.get(group, [])
    
    @classmethod
    def get_all_tools(cls) -> List[str]:
        return [tool for tools in cls.GROUPS.values() for tool in tools]
```

---

## 错误处理

### 1. 错误类型

```python
# Function Calling 错误类型
class FunctionCallErrors:
    """函数调用错误类型"""
    
    # 1. 函数不存在
    NO_FUNCTION = {
        "error": "function_not_found",
        "message": "指定的函数不存在",
        "handle": "返回错误提示，让用户重试"
    }
    
    # 2. 参数错误
    INVALID_PARAMS = {
        "error": "invalid_parameters",
        "message": "函数参数格式错误",
        "handle": "返回正确参数格式，让模型重新提取"
    }
    
    # 3. 执行失败
    EXECUTION_FAILED = {
        "error": "execution_failed",
        "message": "函数执行过程中出错",
        "handle": "返回错误信息，可选择重试或降级"
    }
    
    # 4. 超时
    TIMEOUT = {
        "error": "timeout",
        "message": "函数执行超时",
        "handle": "设置超时限制，选择重试或使用缓存"
    }
    
    # 5. 权限不足
    PERMISSION_DENIED = {
        "error": "permission_denied",
        "message": "没有执行此函数的权限",
        "handle": "提示用户授权或使用替代方案"
    }
```

### 2. 错误处理实现

```python
# 错误处理实现
class FunctionCallHandler:
    """函数调用错误处理"""
    
    def __init__(self):
        self.max_retries = 3
        self.timeout = 30
    
    async def execute_with_retry(self, function_name: str, params: dict) -> dict:
        """带重试的执行"""
        last_error = None
        
        for attempt in range(self.max_retries):
            try:
                result = await self.execute(function_name, params)
                return result
                
            except InvalidParamsError as e:
                # 参数错误不重试
                raise FunctionCallError(
                    f"参数错误: {e.message}",
                    error_type="invalid_params"
                )
                
            except TimeoutError:
                last_error = "执行超时"
                if attempt < self.max_retries - 1:
                    await self.sleep(2 ** attempt)  # 指数退避
                    
            except ExecutionError as e:
                last_error = str(e)
                if attempt < self.max_retries - 1:
                    await self.sleep(2 ** attempt)
        
        # 所有重试都失败
        raise FunctionCallError(
            f"执行失败: {last_error}",
            error_type="execution_failed"
        )
    
    async def execute(self, function_name: str, params: dict) -> dict:
        """执行函数"""
        # 获取函数
        func = self.get_function(function_name)
        
        # 检查参数
        self.validate_params(func, params)
        
        # 执行
        try:
            result = await func(**params)
            return result
            
        except Exception as e:
            raise ExecutionError(f"函数执行失败: {str(e)}")
    
    def get_function(self, name: str):
        """获取函数"""
        if name not in self.functions:
            raise FunctionNotFoundError(f"函数 {name} 不存在")
        return self.functions[name]
    
    def validate_params(self, func, params):
        """验证参数"""
        # 检查必填参数
        for required in func.required:
            if required not in params:
                raise InvalidParamsError(f"缺少必填参数: {required}")
        
        # 检查类型
        for key, value in params.items():
            if key in func.properties:
                expected_type = func.properties[key].type
                if not self.check_type(value, expected_type):
                    raise InvalidParamsError(f"参数 {key} 类型错误")
```

### 3. 降级策略

```python
# 降级策略
class FallbackStrategy:
    """函数调用降级策略"""
    
    FALLBACKS = {
        "weather_api": {
            "primary": "get_weather_v1",
            "fallback": "get_weather_backup",
            "last_resort": "返回预设天气信息"
        },
        "search": {
            "primary": "web_search",
            "fallback": "local_index_search",
            "last_resort": "返回抱歉，无法获取信息"
        }
    }
    
    async def execute_with_fallback(self, func_name: str, params: dict):
        """带降级的执行"""
        strategy = self.FALLBACKS.get(func_name)
        
        if not strategy:
            return await self.execute_primary(func_name, params)
        
        # 尝试主函数
        try:
            return await self.execute_primary(strategy["primary"], params)
        except Exception as e:
            print(f"主函数失败: {e}, 尝试备用")
            
            try:
                return await self.execute_primary(strategy["fallback"], params)
            except Exception as e:
                print(f"备用函数也失败: {e}, 返回最后手段")
                return strategy["last_resort"]
```

---

## 最佳实践

### 1. 函数设计原则

```python
# 函数设计最佳实践
FunctionDesignBestPractices = {
    "原则": [
        "单一职责：每个函数只做一件事",
        "清晰命名：名称要能表达功能",
        "完整描述：description 要详细说明用途",
        "参数精简：尽量减少必填参数",
        "返回结构化：返回结果要有明确结构"
    ],
    
    "推荐": [
        "description 包含使用场景",
        "参数有示例值",
        "返回结果有字段说明",
        "错误情况有说明"
    ],
    
    "避免": [
        "函数名过于简单（如 get_data）",
        "description 只有一句话",
        "参数过多（建议不超过 5 个）",
        "返回结果无结构"
    ]
}
```

### 2. 调用优化

```python
# 调用优化策略
CallOptimization = {
    "批量处理": "多个独立函数调用合并",
    "缓存": "相同调用使用缓存结果",
    "流式": "长输出使用流式响应",
    "异步": "非关键调用使用异步",
    "限流": "控制调用频率避免超限"
}

# 批量调用示例
async def batch_function_calls(requests: List[FunctionRequest]) -> List[dict]:
    """批量执行函数调用"""
    
    # 按函数名分组
    grouped = defaultdict(list)
    for req in requests:
        grouped[req.function_name].append(req)
    
    results = {}
    
    # 每组并行执行
    for func_name, reqs in grouped.items():
        tasks = [execute(func_name, req.params) for req in reqs]
        results[func_name] = await asyncio.gather(*tasks, return_exceptions=True)
    
    return results
```

### 3. 安全性

```python
# Function Calling 安全
class FunctionSecurity:
    """函数调用安全控制"""
    
    def __init__(self):
        self.allowed_functions = set()
        self.dangerous_functions = {
            "execute_command": "需要审批",
            "delete_data": "需要审批",
            "send_email": "需要审批",
            "modify_system": "需要审批"
        }
    
    def check_permission(self, user: str, function: str) -> bool:
        # 检查是否在允许列表
        if function not in self.allowed_functions:
            return False
        
        # 检查危险函数
        if function in self.dangerous_functions:
            return self.has_approval(user, function)
        
        return True
    
    def sanitize_params(self, function: str, params: dict) -> dict:
        """参数清理"""
        sanitized = {}
        
        for key, value in params.items():
            # 类型检查
            if isinstance(value, str):
                # 移除危险字符
                sanitized[key] = value.replace(";", "").replace("&", "")
            else:
                sanitized[key] = value
        
        return sanitized
```

---

## 案例实战

### 案例一：智能助手

```python
# 智能助手 Function Calling
class SmartAssistant:
    """智能助手完整实现"""
    
    def __init__(self):
        self.tools = {
            "search": self.search,
            "weather": self.get_weather,
            "calculator": self.calculate,
            "convert": self.convert_currency,
            "schedule": self.add_to_calendar
        }
        
        self.tools_schema = self.build_schema()
    
    def build_schema(self) -> List[dict]:
        return [
            {
                "name": "search",
                "description": "搜索网络获取信息，适用于实时数据、最新新闻、不确定的知识等",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "搜索关键词"}
                    },
                    "required": ["query"]
                }
            },
            {
                "name": "weather",
                "description": "查询指定城市的天气",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": {"type": "string", "description": "城市名称"},
                        "days": {"type": "integer", "description": "预报天数"}
                    },
                    "required": ["city"]
                }
            },
            {
                "name": "calculator",
                "description": "进行数学计算",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "expression": {"type": "string", "description": "数学表达式"}
                    },
                    "required": ["expression"]
                }
            }
        ]
    
    async def process(self, user_query: str) -> str:
        # 检测函数调用
        response = await llm.chat(
            user_query,
            tools=self.tools_schema,
            tool_choice="auto"
        )
        
        if response.tool_calls:
            # 执行函数
            for call in response.tool_calls:
                result = await self.execute_tool(call.function.name, call.function.arguments)
            
            # 生成最终回答
            final = await llm.chat(
                user_query,
                tools=self.tools_schema,
                tool_calls=response.tool_calls,
                tool_results=[{"name": call.function.name, "result": result} for call in response.tool_calls]
            )
            
            return final.content
        
        return response.content
```

---

## 总结

Function Calling 核心要点：

1. **能力**：让 LLM 调用外部工具、获取实时信息、执行动作
2. **实现**：OpenAI/Anthropic/开源模型各有方案
3. **定义**：函数名、描述、参数 schema 三要素
4. **处理**：错误类型明确、重试/降级策略
5. **安全**：权限控制、参数清理

**最佳实践**：
- 函数设计清晰、描述完整
- 错误处理完善、有降级
- 调用优化、避免重复
- 安全控制、权限管理

---

*📅 更新时间：2026-04-01 | 版本：1.0*