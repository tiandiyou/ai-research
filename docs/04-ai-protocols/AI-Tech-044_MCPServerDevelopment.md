# MCP 服务器开发完全指南

> 2026-04-01 | 技术文档 | 预计阅读时间：30分钟

---

## 目录

1. [MCP 协议概述](#mcp-协议概述)
2. [MCP 服务器架构](#mcp-服务器架构)
3. [开发环境准备](#开发环境准备)
4. [快速开始：Python 实现](#快速开始python-实现)
5. [快速开始：Node.js 实现](#快速开始nodejs-实现)
6. [工具定义与注册](#工具定义与注册)
7. [资源管理](#资源管理)
8. [提示模板](#提示模板)
9. [认证与安全](#认证与安全)
10. [测试与调试](#测试与调试)
11. [部署与运维](#部署与运维)
12. [最佳实践](#最佳实践)

---

## MCP 协议概述

### 什么是 MCP

Model Context Protocol（MCP）是 Anthropic 推出的 AI 应用标准协议，旨在统一 AI 助手与外部系统的交互方式。

```
┌─────────────────────────────────────────────────┐
│                   AI Model                       │
│                   (Claude)                        │
└─────────────────────┬─────────────────────────────┘
                      │ MCP Protocol
                      ↓
┌─────────────────────────────────────────────────┐
│                   MCP Server                      │
├──────────────┬──────────────┬───────────────────┤
│   Tools      │   Resources  │   Prompts         │
│   (函数调用)  │   (数据源)    │   (提示模板)       │
└──────────────┴──────────────┴───────────────────┘
```

### 核心概念

| 概念 | 说明 |
|------|------|
| **Server** | 提供能力的外部服务 |
| **Client** | AI 应用（Claude Desktop） |
| **Tools** | AI 可调用的函数 |
| **Resources** | 可读取的数据 |
| **Prompts** | 预定义的提示模板 |

---

## MCP 服务器架构

### 通信机制

MCP 使用 JSON-RPC 2.0 进行通信：

```json
// 请求示例
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}

// 响应示例
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get_weather",
        "description": "获取天气信息",
        "inputSchema": {
          "type": "object",
          "properties": {
            "city": {"type": "string", "description": "城市名称"}
          },
          "required": ["city"]
        }
      }
    ]
  }
}
```

### 服务器类型

```python
# MCP 服务器的两种运行模式
class MCPServer:
    # 模式1：STDIO（本地进程）
    # 适合：桌面应用、命令行工具
    
    # 模式2：HTTP/SSE（远程服务）
    # 适合：云服务、微服务架构
```

---

## 开发环境准备

### Python 环境

```bash
# 创建项目
mkdir mcp-weather-server && cd mcp-weather-server
python3 -m venv venv
source venv/bin/activate

# 安装 SDK
pip install mcp-server
pip install "mcp[cli]"

# 或使用 FastMCP
pip install fastmcp
```

### Node.js 环境

```bash
# 创建项目
mkdir mcp-weather-server && cd mcp-weather-server
npm init -y

# 安装 SDK
npm install @modelcontextprotocol/server
npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node
```

---

## 快速开始：Python 实现

### 最小示例

```python
# server.py - 使用 FastMCP
from fastmcp import FastMCP

app = FastMCP("天气服务")

@app.tool()
def get_weather(city: str) -> dict:
    """获取城市天气信息"""
    # 实际实现中调用外部 API
    return {
        "city": city,
        "temperature": 22,
        "condition": "晴",
        "humidity": 65
    }

@app.tool()
def get_forecast(city: str, days: int = 3) -> dict:
    """获取天气预报"""
    return {
        "city": city,
        "forecast": [
            {"day": i+1, "temp": 20+i, "condition": "晴"}
            for i in range(days)
        ]
    }

if __name__ == "__main__":
    app.run()
```

### 运行服务器

```bash
# STDIO 模式
python server.py

# 添加到 Claude Desktop
# 在 claude_desktop_config.json 中添加：
{
  "mcpServers": {
    "weather": {
      "command": "python",
      "args": ["/path/to/server.py"]
    }
  }
}
```

---

## 快速开始：Node.js 实现

### 最小示例

```typescript
// server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// 工具定义
const tools = [
  {
    name: 'get_weather',
    description: '获取城市天气信息',
    inputSchema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: '城市名称' }
      },
      required: ['city']
    }
  },
  {
    name: 'get_forecast',
    description: '获取天气预报',
    inputSchema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: '城市名称' },
        days: { type: 'number', description: '预报天数', default: 3 }
      },
      required: ['city']
    }
  }
];

// 创建服务器
const server = new Server(
  {
    name: 'weather-server',
    version: '1.0.0'
  },
  {
    capabilities: { tools: {} }
  }
);

// 处理工具列表请求
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// 处理工具调用请求
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'get_weather':
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            city: args.city,
            temperature: 22,
            condition: '晴'
          })
        }]
      };
      
    case 'get_forecast':
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            city: args.city,
            days: args.days,
            forecast: Array.from({length: args.days}, (_, i) => ({
              day: i + 1,
              temp: 20 + Math.random() * 10,
              condition: ['晴', '多云', '雨'][Math.floor(Math.random() * 3)]
            }))
          })
        }]
      };
      
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

### 配置 TypeScript 编译

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

```bash
# 编译和运行
npx tsc
node dist/server.js
```

---

## 工具定义与注册

### 工具结构

```python
# 完整工具定义
{
    "name": "tool_name",           # 唯一标识
    "description": "工具描述",      # AI 理解工具用途
    "inputSchema": {
        "type": "object",
        "properties": {
            "param1": {
                "type": "string",
                "description": "参数描述",
                "default": "默认值"
            },
            "param2": {
                "type": "number",
                "description": "数值参数"
            },
            "optional_param": {
                "type": "boolean",
                "description": "可选参数"
            }
        },
        "required": ["param1"]      # 必填参数
    }
}
```

### 复杂参数示例

```python
# 文件处理工具
{
    "name": "process_file",
    "description": "处理文件内容，支持多种操作",
    "inputSchema": {
        "type": "object",
        "properties": {
            "file_path": {
                "type": "string",
                "description": "文件路径"
            },
            "operation": {
                "type": "string",
                "enum": ["read", "write", "append", "delete"],
                "description": "操作类型"
            },
            "content": {
                "type": "string",
                "description": "写入内容（write/append时需要）"
            },
            "options": {
                "type": "object",
                "description": "额外选项",
                "properties": {
                    "encoding": {"type": "string", "default": "utf-8"},
                    "backup": {"type": "boolean", "default": false}
                }
            }
        },
        "required": ["file_path", "operation"]
    }
}
```

### 工具分类组织

```python
# 大型服务器按功能模块组织工具
class DatabaseServer(FastMCP):
    """数据库操作 MCP 服务器"""
    
    # 数据库连接
    @app.tool()
    def execute_query(self, sql: str) -> dict: ...
    
    @app.tool()
    def list_tables(self) -> list: ...
    
    # 表操作
    @app.tool()
    def create_table(self, name: str, schema: dict) -> dict: ...
    
    @app.tool()
    def describe_table(self, name: str) -> dict: ...
    
    # 备份恢复
    @app.tool()
    def backup(self, target_path: str) -> str: ...
    
    @app.tool()
    def restore(self, backup_file: str) -> dict: ...
```

---

## 资源管理

### 什么是资源

资源是 MCP 服务器可提供给 AI 读取的数据：

```python
# 资源示例
{
    "uri": "file://config/app.json",
    "name": "应用配置",
    "description": "应用程序配置信息",
    "mimeType": "application/json"
}
```

### 实现资源

```python
from fastmcp import FastMCP
from typing import List

app = FastMCP("文件管理器")

# 静态资源
@app.resource("config://app")
def get_app_config() -> str:
    """应用配置资源"""
    return json.dumps({"version": "1.0.0", "debug": True})

@app.resource("config://database")
def get_db_config() -> str:
    """数据库配置"""
    return json.dumps({"host": "localhost", "port": 5432})

# 动态资源
@app.resource("file://{path}")
def read_file(path: str) -> str:
    """读取任意文件"""
    with open(path, 'r') as f:
        return f.read()

# 列表资源
@app.resources()
def list_resources() -> List[dict]:
    """列出所有可用资源"""
    return [
        {"uri": "config://app", "name": "应用配置"},
        {"uri": "config://database", "name": "数据库配置"}
    ]
```

### 资源类型

| 类型 | 示例 | 用途 |
|------|------|------|
| **文件** | `file:///path/to/file` | 读取本地文件 |
| **配置** | `config://app` | 应用配置 |
| **数据库** | `db://users` | 数据库查询 |
| **API** | `api://users/1` | 外部 API |
| **动态** | `query://search?q=xxx` | 动态生成 |

---

## 提示模板

### 什么是提示模板

预定义的提示词，可被 AI 调用：

```python
# 提示模板示例
{
    "name": "analyze_code",
    "description": "分析代码质量",
    "arguments": {
        "type": "object",
        "properties": {
            "language": {"type": "string"},
            "code": {"type": "string"}
        }
    }
}
```

### 实现提示模板

```python
@app.prompt()
def analyze_code(language: str, code: str) -> str:
    """代码分析提示模板"""
    return f"""你是一个专业的代码审查员。请分析以下{language}代码：

```{language}
{code}
```

请从以下方面进行分析：
1. 代码规范性
2. 潜在 bug
3. 性能问题
4. 安全风险
5. 改进建议
"""

@app.prompt()
def write_tests(language: str, code: str, framework: str) -> str:
    """编写测试用例"""
    return f"""为以下{language}代码使用{framework}编写测试用例：

```{language}
{code}
```

要求：
1. 覆盖主要功能
2. 包括边界条件
3. 使用 mock 模拟外部依赖
"""
```

---

## 认证与安全

### 本地开发认证

```python
# 简单的 API Key 认证
class AuthenticatedServer(FastMCP):
    def __init__(self, name: str, api_key: str = None):
        super().__init__(name)
        self.api_key = api_key or os.getenv("MCP_API_KEY")
        
    def authenticate(self, request):
        if self.api_key:
            auth_header = request.headers.get("Authorization")
            if not auth_header or auth_header != f"Bearer {self.api_key}":
                raise PermissionError("Invalid API key")
```

### 生产环境认证

```python
# OAuth 2.0 认证
from fastmcp import FastMCP

app = FastMCP("企业服务")

@app.tool(auth_required=True)
def get_enterprise_data(resource: str) -> dict:
    """需要认证的工具"""
    # 获取用户信息
    user = app.get_current_user()
    
    # 检查权限
    if not user.can_access(resource):
        raise PermissionError("Access denied")
        
    return fetch_data(resource, user.token)
```

### 安全最佳实践

```python
class SecureServer(FastMCP):
    """安全加固的 MCP 服务器"""
    
    # 1. 输入验证
    @app.tool()
    def process_data(self, data: str) -> dict:
        # 白名单验证
        allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
        sanitized = ''.join(c for c in data if c in allowed)
        return {"result": sanitized}
        
    # 2. 路径遍历防护
    @app.resource("file://{path}")
    def safe_read_file(path: str) -> str:
        # 规范化路径
        base_dir = "/data/safe"
        full_path = os.path.normpath(os.path.join(base_dir, path))
        
        # 防止路径穿越
        if not full_path.startswith(base_dir):
            raise ValueError("Access denied")
            
        return read_file(full_path)
        
    # 3. 速率限制
    @app.tool(rate_limit=10)  # 每分钟10次
    def limited_operation(self, param: str) -> dict:
        return {"result": "ok"}
```

---

## 测试与调试

### 本地测试

```python
# test_server.py
import pytest
from mcp.client import Client

@pytest.fixture
def client():
    return Client("python /path/to/server.py")

def test_get_weather(client):
    result = client.call_tool("get_weather", {"city": "北京"})
    assert result["city"] == "北京"
    assert "temperature" in result

def test_list_tools(client):
    tools = client.list_tools()
    assert any(t["name"] == "get_weather" for t in tools)
```

### 交互式调试

```bash
# 使用 mcp dev 调试
mcp dev /path/to/server.py

# 这会启动一个交互式调试界面
# 你可以：
# - 查看工具列表
# - 单个调用工具
# - 查看资源列表
# - 测试提示模板
```

### 日志记录

```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger("mcp-server")

@app.tool()
def operation(data: str) -> dict:
    logger.info(f"执行操作: {data}")
    try:
        result = do_operation(data)
        logger.info(f"操作成功: {result}")
        return result
    except Exception as e:
        logger.error(f"操作失败: {e}")
        raise
```

---

## 部署与运维

### STDIO 部署

```json
// claude_desktop_config.json
{
  "mcpServers": {
    "my-server": {
      "command": "python",
      "args": ["/opt/mcp/my-server/server.py"],
      "env": {
        "LOG_LEVEL": "INFO",
        "API_KEY": "secret-key"
      }
    }
  }
}
```

### HTTP/SSE 部署

```python
# 使用 FastMCP 的 HTTP 模式
from fastmcp import FastMCP

app = FastMCP("我的服务")

# 运行 HTTP 服务器
app.run(transport="http", host="0.0.0.0", port=8080)
```

```json
// 配置 Claude Desktop 使用 HTTP 服务器
{
  "mcpServers": {
    "my-server": {
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

### Docker 部署

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "server.py"]
```

```yaml
# docker-compose.yml
services:
  mcp-server:
    build: .
    ports:
      - "8080:8080"
    environment:
      - API_KEY=${API_KEY}
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - ./data:/app/data
```

### 监控

```python
from prometheus_client import Counter, Histogram

# 请求计数
request_count = Counter(
    'mcp_requests_total',
    'Total MCP requests',
    ['tool_name', 'status']
)

# 延迟直方图
request_duration = Histogram(
    'mcp_request_duration_seconds',
    'Request duration',
    ['tool_name']
)

@app.tool()
def monitored_tool(param: str) -> dict:
    with request_duration.labels('monitored_tool').time():
        result = do_work(param)
        request_count.labels('monitored_tool', 'success').inc()
        return result
```

---

## 最佳实践

### 1. 工具设计原则

```python
# ✅ 好的工具设计
@app.tool()
def create_user(name: str, email: str, role: str = "user") -> dict:
    """创建新用户
    
    Args:
        name: 用户全名
        email: 邮箱地址
        role: 用户角色 (default: user)
    """
    return db.users.create(name=name, email=email, role=role)

# ❌ 避免：过多参数
@app.tool()  # 拆分成多个工具
def do_everything(action: str, param1=None, param2=None, ...): ...
```

### 2. 错误处理

```python
@app.tool()
def safe_tool(param: str) -> dict:
    try:
        result = risky_operation(param)
        return {"success": True, "data": result}
    except ValidationError as e:
        return {"success": False, "error": f"参数错误: {e}"}
    except PermissionError as e:
        return {"success": False, "error": f"权限不足: {e}"}
    except Exception as e:
        logger.exception("Unexpected error")
        return {"success": False, "error": "内部错误"}
```

### 3. 响应格式

```python
@app.tool()
def format_response(data: dict) -> dict:
    """统一的成功响应"""
    return {
        "success": True,
        "data": data,
        "metadata": {
            "timestamp": datetime.now().isoformat(),
            "version": "1.0"
        }
    }

@app.tool()
def format_error(error: Exception) -> dict:
    """统一的错误响应"""
    return {
        "success": False,
        "error": {
            "type": type(error).__name__,
            "message": str(error)
        }
    }
```

### 4. 文档完善

```python
@app.tool()
def complex_operation(
    file_path: str,
    mode: str = "read",
    options: dict = None
) -> dict:
    """执行复杂的文件操作
    
    此工具提供对文件系统的完整操作能力，支持
    读取、写入、删除等多种模式。
    
    Args:
        file_path: 文件的绝对路径，必须是有效的文件路径
        mode: 操作模式，可选值:
            - read: 读取文件内容
            - write: 写入文件（会覆盖）
            - append: 追加到文件末尾
            - delete: 删除文件
        options: 额外选项:
            - encoding: 字符编码，默认 utf-8
            - backup: 操作前是否备份，默认 false
    
    Returns:
        成功时返回文件内容或操作结果
        失败时返回错误信息
    
    Example:
        读取文件: complex_operation("/etc/passwd", "read")
        写入文件: complex_operation("/tmp/test.txt", "write", {"content": "hello"})
    """
    pass
```

---

## 总结

MCP 服务器开发的核心要点：

1. **协议基础**：JSON-RPC 2.0 + SSE
2. **工具设计**：清晰的名称、描述、参数Schema
3. **资源管理**：静态 + 动态资源
4. **安全**：认证、输入验证、速率限制
5. **测试**：本地测试 + 交互式调试

**快速启动命令**：
```bash
# Python
pip install fastmcp
fastmcp init my-server

# Node.js
npm create mcp-server
```

---

*📅 更新时间：2026-04-01 | 版本：1.0*