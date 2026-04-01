# OpenAI API 完全指南

> 2026-04-01 | 技术文档 | 预计阅读时间：25分钟

---

## 目录

1. [API 概述](#api-概述)
2. [认证与配置](#认证与配置)
3. [核心接口](#核心接口)
4. [模型选择](#模型选择)
5. [高级功能](#高级功能)
6. [成本优化](#成本优化)
7. [最佳实践](#最佳实践)

---

## API 概述

### 什么是 OpenAI API

OpenAI API 是访问 GPT 等模型的编程接口，支持：

- **文本生成**：对话、写作、翻译
- **代码生成**：编写和调试代码
- **嵌入**：文本向量化
- **图像生成**：DALL·E 图像

```python
# 核心端点
APIEndpoints = {
    "chat": "https://api.openai.com/v1/chat/completions",
    "completions": "https://api.openai.com/v1/completions",
    "embeddings": "https://api.openai.com/v1/embeddings",
    "images": "https://api.openai.com/v1/images/generations"
}
```

---

## 认证与配置

### API Key

```python
# 获取 API Key
# 1. 访问 https://platform.openai.com/api-keys
# 2. 创建新密钥
# 3. 妥善保存

# 环境变量
import os
os.environ["OPENAI_API_KEY"] = "sk-..."
```

### Python SDK

```python
# 安装
pip install openai

# 使用
from openai import OpenAI
client = OpenAI(api_key="sk-...")
```

---

## 核心接口

### 1. Chat API

```python
# Chat API
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "你是一个助手"},
        {"role": "user", "content": "你好"}
    ]
)

print(response.choices[0].message.content)
```

### 2. 流式响应

```python
# 流式
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "讲个故事"}],
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

### 3. Embeddings

```python
# Embeddings
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="要嵌入的文本"
)

embedding = response.data[0].embedding
```

---

## 模型选择

### 模型对比

```python
# 可用模型
Models = {
    "GPT-4": {
        "能力": "最强，多模态",
        "速度": "慢",
        "成本": "高"
    },
    "GPT-4 Turbo": {
        "能力": "接近GPT-4",
        "速度": "快",
        "成本": "中"
    },
    "GPT-3.5 Turbo": {
        "能力": "足够日常",
        "速度": "快",
        "成本": "低"
    }
}
```

---

## 高级功能

### 1. Function Calling

```python
# Function Calling
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "北京天气"}],
    functions=[{
        "name": "get_weather",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"]
        }
    }]
)
```

### 2. JSON Mode

```python
# JSON 模式
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "返回JSON"}],
    response_format={"type": "json_object"}
)
```

---

## 成本优化

```python
# 成本优化
CostOptimization = {
    "选择合适模型": "GPT-3.5 足够就不用 GPT-4",
    "缩短输入": "精简 prompt",
    "流式响应": "减少等待",
    "缓存": "相同请求缓存"
}
```

---

## 总结

OpenAI API 核心要点：

1. **接口**：Chat、Completions、Embeddings
2. **模型**：GPT-4/GPT-3.5/Embedding
3. **功能**：Function Calling、JSON Mode
4. **优化**：模型选择、提示优化

---

*📅 更新时间：2026-04-01 | 版本：1.0*