# LangChain 完全指南

> 2026-04-01 | 技术文档 | 预计阅读时间：30分钟

---

## 目录

1. [LangChain 概述](#langchain-概述)
2. [核心组件](#核心组件)
3. [LLM 接口](#llm-接口)
4. [Prompt 管理](#prompt-管理)
5. [Chain 构建](#chain-构建)
6. [Memory](#memory)
7. [Tools 与 Agent](#tools-与-agent)
8. [RAG 实现](#rag-实现)
9. [最佳实践](#最佳实践)

---

## LangChain 概述

### 什么是 LangChain

LangChain 是一个用于构建 LLM 应用的框架，核心目标是让开发者能更方便地：

- **连接 LLM**：统一接口对接各种模型
- **构建 Chain**：组合多个组件形成工作流
- **使用工具**：让 LLM 调用外部系统
- **管理 Memory**：保持对话状态
- **构建 RAG**：实现检索增强生成

```python
# LangChain 核心价值
class LangChainValue:
    """LangChain 核心价值"""
    
    MODULAR = "模块化设计，易于组合"
    DOCUMENTED = "完善的文档和示例"
    COMMUNITY = "活跃的社区和生态"
    FLEXIBLE = "高度可定制和扩展"
```

---

## 核心组件

### 组件架构

```python
# LangChain 组件
class LangChainComponents:
    """LangChain 核心组件"""
    
    COMPONENTS = {
        "LLM": "大语言模型接口",
        "ChatModel": "聊天模型接口",
        "Prompt": "提示词模板",
        "Chain": "链式调用",
        "Memory": "对话记忆",
        "Agent": "代理",
        "Tools": "工具",
        "RAG": "检索增强"
    }
```

---

## LLM 接口

### 1. OpenAI

```python
# OpenAI
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage

# 初始化
llm = ChatOpenAI(
    model="gpt-4",
    temperature=0.7,
    api_key="sk-..."
)

# 调用
response = llm.invoke([HumanMessage(content="你好")])
print(response.content)

# 流式
for chunk in llm.stream([HumanMessage(content="讲个故事")]):
    print(chunk.content, end="")
```

### 2. Anthropic

```python
# Anthropic Claude
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(
    model="claude-3-opus-20240229",
    anthropic_api_key="sk-ant-..."
)

response = llm.invoke([HumanMessage(content="你好")])
```

### 3. 本地模型

```python
# 本地模型 (Ollama)
from langchain_community.chat_models import ChatOllama

llm = ChatOllama(
    model="llama2",
    base_url="http://localhost:11434"
)
```

---

## Prompt 管理

### 1. PromptTemplate

```python
# PromptTemplate
from langchain.prompts import PromptTemplate

# 创建模板
template = PromptTemplate.from_template(
    "请用{style}风格写一篇关于{topic}的文章，字数约{length}字。"
)

# 格式化
prompt = template.format(
    style="专业",
    topic="人工智能",
    length=1000
)

# 调用 LLM
response = llm.invoke(prompt)
```

### 2. ChatPromptTemplate

```python
# ChatPromptTemplate
from langchain.prompts import ChatPromptTemplate

# 创建聊天模板
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一位{profession}专家"),
    ("human", "请问{method}是什么？"),
    ("ai", "我可以为你解释{method}。让我先了解你的背景：你是做什么的？"),
    ("human", "我是{background}"),
])

# 格式化
formatted = prompt.format(
    profession="技术",
    method="机器学习",
    background="学生"
)

response = llm.invoke(formatted)
```

---

## Chain 构建

### 1. LLMChain

```python
# LLMChain
from langchain.chains import LLMChain

# 创建 Chain
chain = LLMChain(
    llm=llm,
    prompt=template
)

# 执行
result = chain.run(topic="Python")
```

### 2. Sequential Chain

```python
# Sequential Chain
from langchain.chains import SequentialChain

# 第一个 Chain
chain1 = LLMChain(
    llm=llm,
    prompt=first_template,
    output_key="summary"
)

# 第二个 Chain
chain2 = LLMChain(
    llm=llm,
    prompt=second_template,
    input_variables=["summary"],
    output_key="translation"
)

# 串联
overall = SequentialChain(
    chains=[chain1, chain2],
    input_variables=["text"],
    output_variables=["translation"]
)

result = overall({"text": "原始文本"})
```

### 3. Transform Chain

```python
# Transform Chain
from langchain.chains import TransformChain

def transform_func(inputs):
    return {"uppercase": inputs["text"].upper()}

transform_chain = TransformChain(
    input_variables=["text"],
    output_variables=["uppercase"],
    transform=transform_func
)

# 组合
chain = LLMChain(
    llm=llm,
    prompt=template,
    output_key="response"
)
```

---

## Memory

### 1. BufferMemory

```python
# BufferMemory
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    return_messages=True,
    memory_key="history"
)

# 添加消息
memory.chat_memory.add_user_message("你好")
memory.chat_memory.add_ai_message("你好！有什么可以帮你？")

# 获取历史
history = memory.load_memory_variables({})
print(history["history"])
```

### 2. Entity Memory

```python
# EntityMemory
from langchain.memory import ConversationEntityMemory

memory = ConversationEntityMemory(llm=llm)

# 自动提取实体
memory.save_context(
    {"input": "张三在北京工作"},
    {"output": "好的，我记住张三在北京工作"}
)

entities = memory.entity_store.store
print(entities)
```

### 3. 在 Chain 中使用 Memory

```python
# 带 Memory 的 Chain
from langchain.chains import ConversationChain

conversation = ConversationChain(
    llm=llm,
    memory=ConversationBufferMemory(),
    verbose=True
)

response = conversation.predict(input="我叫李明")
response = conversation.predict(input="我是做什么的？")
```

---

## Tools 与 Agent

### 1. Tools

```python
# 定义工具
from langchain.tools import tool

@tool
def calculate(expression: str) -> str:
    """执行数学计算"""
    import math
    result = eval(expression)
    return str(result)

@tool
def search(query: str) -> str:
    """搜索网络信息"""
    # 实现搜索逻辑
    return f"搜索结果: {query}"

# 使用工具
tools = [calculate, search]
```

### 2. Agent

```python
# Agent
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.prompts import MessagesPlaceholder

# 创建 Agent
prompt = PromptTemplate.from_template("""
你是一个助手。可以用工具来完成任务。

可用工具：
- calculate: 执行计算
- search: 搜索信息

{tools}

{agent_scratchpad}
""")

agent = create_openai_functions_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# 执行
result = executor.invoke({"input": "计算 2 的 10 次方是多少"})
```

---

## RAG 实现

### 1. 文档加载

```python
# 文档加载
from langchain_community.document_loaders import TextLoader, PDFLoader, WebLoader

# 文本
loader = TextLoader("document.txt")
docs = loader.load()

# PDF
loader = PDFLoader("document.pdf")
docs = loader.load()

# 网页
loader = WebLoader("https://example.com")
docs = loader.load()
```

### 2. 文档分割

```python
# 文档分割
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=100
)

splits = splitter.split_documents(docs)
```

### 3. 向量存储

```python
# 向量存储
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

# 嵌入
embeddings = OpenAIEmbeddings()

# 存储
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embeddings
)

# 检索
retriever = vectorstore.as_retriever()
```

### 4. RAG Chain

```python
# RAG Chain
from langchain.chains import RetrievalQA

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True
)

# 查询
result = qa_chain({"query": "什么是机器学习？"})
print(result["result"])
```

---

## 最佳实践

### 1. Chain 设计

```python
# Chain 设计原则
ChainBestPractices = {
    "单一职责": "每个 Chain 只做一件事",
    "模块化": "易于复用和测试",
    "错误处理": "添加异常处理",
    "日志": "记录执行过程"
}
```

### 2. 性能优化

```python
# 性能优化
PerformanceOptimization = {
    "缓存": "使用缓存避免重复调用",
    "批量": "批量处理文档",
    "异步": "使用异步操作",
    "流式": "使用流式响应"
}
```

---

## 总结

LangChain 核心要点：

1. **模块化**：LLM、Prompt、Chain、Memory、Agent、Tools
2. **Chain**：LLMChain、SequentialChain、TransformChain
3. **Memory**：Buffer、Entity、KGM
4. **Agent**：ReAct、Functions、Tools
5. **RAG**：文档加载→分割→嵌入→检索→问答

---

*📅 更新时间：2026-04-01 | 版本：1.0*