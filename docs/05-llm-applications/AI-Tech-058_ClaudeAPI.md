# Claude API 完全指南

> 2026-04-01 | 技术文档 | 预计阅读时间：22分钟

---

## 目录

1. [API 概述](#api-概述)
2. [认证配置](#认证配置)
3. [核心接口](#核心接口)
4. [Tool Use](#tool-use)
5. [模型选择](#模型选择)
6. [最佳实践](#最佳实践)

---

## API 概述

### Claude API 简介

Claude API 是 Anthropic 提供的 Claude 模型接口，特点：

- **强推理**：擅长逻辑推理和分析
- **安全**：内置安全机制
- **Tool Use**：调用外部工具能力

```python
# 核心端点
Endpoints = {
    "messages": "https://api.anthropic.com/v1/messages"
}
```

---

## 认证配置

```python
# 安装 SDK
pip install anthropic

# 使用
import anthropic
client = anthropic.Anthropic(
    api_key="sk-ant-..."
)
```

---

## 核心接口

### 1. 消息接口

```python
# 发送消息
response = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "你好"}
    ]
)

print(response.content[0].text)
```

### 2. 流式

```python
# 流式
with client.messages.stream(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    messages=[{"role": "user", "content": "讲故事"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="")
```

---

## Tool Use

### 工具定义

```python
# 工具定义
tools = [{
    "name": "weather_search",
    "description": "搜索天气",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {"type": "string", "description": "城市"}
        },
        "required": ["location"]
    }
}]

# 调用
response = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=1024,
    messages=[{"role": "user", "content": "北京天气"}],
    tools=tools
)

# 处理工具调用
for block in response.content:
    if block.type == "tool_use":
        result = execute_tool(block.name, block.input)
```

---

## 模型选择

```python
# 模型
Models = {
    "claude-3-opus": "最强，适合复杂任务",
    "claude-3-sonnet": "平衡性价比",
    "claude-3-haiku": "快速，适合简单任务"
}
```

---

## 总结

Claude API 核心要点：

1. **接口**：Messages API
2. **特点**：Tool Use、流式
3. **模型**：Opus、Sonnet、Haiku

---

*📅 更新时间：2026-04-01 | 版本：1.0*