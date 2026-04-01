# AI Agent 可观测性完全指南

> 2026-04-01 | 技术文档 | 预计阅读时间：26分钟

---

## 目录

1. [可观测性概述](#可观测性概述)
2. [核心概念](#核心概念)
3. [监控维度](#监控维度)
4. [技术实现](#技术实现)
5. [日志与追踪](#日志与追踪)
6. [告警与响应](#告警与响应)
7. [可视化仪表盘](#可视化仪表盘)
8. [最佳实践](#最佳实践)

---

## 可观测性概述

### 什么是 AI 可观测性

AI 可观测性（Observability）是对 AI 系统运行状态的可测量和可理解能力。与传统软件监控相比，AI 可观测性更关注：

- **模型行为**：理解模型决策逻辑
- **输出质量**：评估生成内容的质量
- **Token 消耗**：追踪资源使用和成本
- **链路追踪**：端到端的请求生命周期

```python
# AI 可观测性 vs 传统监控
Comparison = {
    "传统监控": {
        "关注": "CPU/内存/网络",
        "指标": "可用性、延迟",
        "问题": "已知问题检测"
    },
    "AI 可观测性": {
        "关注": "模型行为、输出质量、Token消耗",
        "指标": "准确率、延迟、成本、成功率",
        "问题": "未知问题发现"
    }
}
```

### 为什么重要

| 痛点 | 可观测性价值 |
|------|--------------|
| 模型输出不稳定 | 追踪输出分布，发现异常 |
| 成本不可控 | 监控 Token 消耗，控制预算 |
| 调试困难 | 完整链路追踪，定位问题 |
| 质量难评估 | 多维度质量指标，持续监控 |

---

## 核心概念

### 1. 可观测性三大支柱

```python
# 可观测性三支柱
class ObservabilityPillars:
    """AI Agent 可观测性的三大支柱"""
    
    METRICS = {
        "定义": "数值型测量指标",
        "示例": "请求量、延迟、错误率、Token消耗",
        "特点": "支持聚合、阈值告警、趋势分析"
    }
    
    LOGS = {
        "定义": "事件发生的详细记录",
        "示例": "请求详情、响应内容、错误信息",
        "特点": "支持搜索、过滤、关联分析"
    }
    
    TRACES = {
        "定义": "请求在系统中的完整执行路径",
        "示例": "调用链、阶段耗时、依赖关系",
        "特点": "支持性能分析、根因定位"
    }
```

### 2. AI Agent 特定指标

```python
# AI Agent 特有的可观测性指标
class AgentMetrics:
    """AI Agent 关键指标"""
    
    # 请求级别
    REQUEST_METRICS = {
        "total_requests": "总请求数",
        "successful_requests": "成功请求数",
        "failed_requests": "失败请求数",
        "average_latency": "平均延迟",
        "p50_latency": "P50 延迟",
        "p95_latency": "P95 延迟",
        "p99_latency": "P99 延迟"
    }
    
    # Token 级别
    TOKEN_METRICS = {
        "input_tokens": "输入 Token 数",
        "output_tokens": "输出 Token 数",
        "total_tokens": "总 Token 数",
        "prompt_tokens": "提示词 Token",
        "completion_tokens": "补全 Token",
        "cost_per_request": "单次请求成本"
    }
    
    # 模型级别
    MODEL_METRICS = {
        "model_errors": "模型错误",
        "rate_limit_errors": "速率限制错误",
        "timeout_errors": "超时错误",
        "invalid_requests": "无效请求",
        "output_length_distribution": "输出长度分布"
    }
    
    # 质量级别
    QUALITY_METRICS = {
        "avg_output_length": "平均输出长度",
        "truncation_rate": "截断率",
        "retry_rate": "重试率",
        "fallback_rate": "降级率"
    }
```

### 3. 关键维度

```python
# 可观测性关键维度
class ObservabilityDimensions:
    """AI Agent 可观测性维度"""
    
    PERFORMANCE = {
        "延迟": "从请求到响应的耗时",
        "吞吐量": "单位时间处理的请求数",
        "可用性": "成功请求的比例"
    }
    
    COST = {
        "Token消耗": "输入+输出 Token",
        "API调用成本": "按调用次数计费",
        "计算成本": "模型推理成本"
    }
    
    QUALITY = {
        "准确率": "任务完成质量",
        "一致性": "相同输入的输出稳定性",
        "相关性": "输出与输入的相关程度"
    }
    
    SAFETY = {
        "内容过滤": "有害内容拦截",
        "异常检测": "异常输入/输出",
        "安全审计": "安全事件记录"
    }
```

---

## 监控维度

### 1. 系统级监控

```python
# 系统级监控
class SystemMonitoring:
    """系统级指标监控"""
    
    def collect(self):
        return {
            # 基础设施
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent,
            
            # 网络
            "network_io": psutil.net_io_counters(),
            
            # 进程
            "process_count": len(psutil.pids()),
            "open_files": len(psutil.Process().open_files())
        }
```

### 2. 应用级监控

```python
# 应用级监控
class ApplicationMonitoring:
    """AI 应用指标监控"""
    
    def __init__(self):
        self.metrics = {
            "requests": Counter("ai_requests_total"),
            "latency": Histogram("ai_latency_seconds"),
            "tokens": Histogram("ai_tokens_total"),
            "errors": Counter("ai_errors_total")
        }
    
    def record_request(self, request: Request, response: Response, duration: float):
        # 记录请求数
        self.metrics["requests"].labels(
            model=request.model,
            status="success" if response else "error"
        ).inc()
        
        # 记录延迟
        self.metrics["latency"].observe(duration)
        
        # 记录 Token
        if response:
            self.metrics["tokens"].labels(type="input").observe(response.input_tokens)
            self.metrics["tokens"].labels(type="output").observe(response.output_tokens)
        
        # 记录错误
        if response and response.error:
            self.metrics["errors"].labels(
                type=response.error_type
            ).inc()
```

### 3. 模型级监控

```python
# 模型级监控
class ModelMonitoring:
    """模型性能监控"""
    
    def __init__(self):
        self.model_stats = {}
    
    def record_inference(self, model: str, input_tokens: int, output_tokens: int, 
                         latency: float, error: str = None):
        if model not in self.model_stats:
            self.model_stats[model] = {
                "total_requests": 0,
                "total_input_tokens": 0,
                "total_output_tokens": 0,
                "total_latency": 0,
                "errors": 0
            }
        
        stats = self.model_stats[model]
        stats["total_requests"] += 1
        stats["total_input_tokens"] += input_tokens
        stats["total_output_tokens"] += output_tokens
        stats["total_latency"] += latency
        if error:
            stats["errors"] += 1
    
    def get_stats(self, model: str) -> dict:
        stats = self.model_stats.get(model, {})
        return {
            "total_requests": stats.get("total_requests", 0),
            "avg_latency": stats["total_latency"] / stats["total_requests"] if stats["total_requests"] else 0,
            "avg_input_tokens": stats["total_input_tokens"] / stats["total_requests"] if stats["total_requests"] else 0,
            "avg_output_tokens": stats["total_output_tokens"] / stats["total_requests"] if stats["total_requests"] else 0,
            "error_rate": stats["errors"] / stats["total_requests"] if stats["total_requests"] else 0
        }
```

---

## 技术实现

### 1. 指标收集

```python
# 使用 Prometheus 收集指标
from prometheus_client import Counter, Histogram, Gauge, Summary

# 定义指标
REQUEST_COUNT = Counter(
    'ai_requests_total',
    'Total AI requests',
    ['model', 'status']
)

REQUEST_LATENCY = Histogram(
    'ai_request_latency_seconds',
    'AI request latency',
    ['model'],
    buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0]
)

TOKEN_COUNT = Counter(
    'ai_tokens_total',
    'Total AI tokens',
    ['model', 'type']
)

MODEL_QUEUE_SIZE = Gauge(
    'ai_model_queue_size',
    'Current queue size',
    ['model']
)

# 使用指标
class AIMetrics:
    def record(self, model: str, latency: float, input_tokens: int, output_tokens: int, success: bool):
        REQUEST_COUNT.labels(model=model, status='success' if success else 'error').inc()
        REQUEST_LATENCY.labels(model=model).observe(latency)
        TOKEN_COUNT.labels(model=model, type='input').inc(input_tokens)
        TOKEN_COUNT.labels(model=model, type='output').inc(output_tokens)
```

### 2. 自定义指标

```python
# 自定义 AI 指标
class CustomAIMetrics:
    """AI 特定的自定义指标"""
    
    # 输出质量指标
    OUTPUT_LENGTH = Histogram(
        'ai_output_length',
        'Distribution of output lengths',
        buckets=[10, 50, 100, 200, 500, 1000, 2000, 5000]
    )
    
    # 重试指标
    RETRY_COUNT = Counter(
        'ai_retries_total',
        'Total retry attempts',
        ['model', 'reason']
    )
    
    # 截断指标
    TRUNCATION_COUNT = Counter(
        'ai_truncations_total',
        'Total output truncations',
        ['model']
    )
    
    # 成本指标
    COST = Histogram(
        'ai_cost_dollars',
        'Cost per request in dollars',
        buckets=[0.001, 0.01, 0.1, 0.5, 1.0, 5.0, 10.0]
    )
    
    # Token 速率
    TOKENS_PER_SECOND = Gauge(
        'ai_tokens_per_second',
        'Token generation speed',
        ['model']
    )
```

### 3. 指标聚合

```python
# 指标聚合
class MetricsAggregator:
    """指标聚合和统计"""
    
    def __init__(self):
        self.data = defaultdict(list)
    
    def record(self, metric_name: str, value: float, labels: dict = None):
        key = (metric_name, tuple(sorted(labels.items())) if labels else ())
        self.data[key].append(value)
    
    def get_stats(self, metric_name: str, labels: dict = None) -> dict:
        key = (metric_name, tuple(sorted(labels.items())) if labels else ())
        values = self.data.get(key, [])
        
        if not values:
            return {}
        
        return {
            "count": len(values),
            "sum": sum(values),
            "mean": sum(values) / len(values),
            "min": min(values),
            "max": max(values),
            "p50": self.percentile(values, 50),
            "p95": self.percentile(values, 95),
            "p99": self.percentile(values, 99)
        }
    
    def percentile(self, values: list, p: float) -> float:
        sorted_values = sorted(values)
        idx = int(len(sorted_values) * p / 100)
        return sorted_values[min(idx, len(sorted_values) - 1)]
```

---

## 日志与追踪

### 1. 结构化日志

```python
# 结构化日志
import json
import logging

class AILogger:
    """AI 应用结构化日志"""
    
    def __init__(self):
        self.logger = logging.getLogger("ai-observability")
        self.logger.setLevel(logging.INFO)
        
        # JSON formatter
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter('%(message)s'))
        self.logger.addHandler(handler)
    
    def log_request(self, request: Request, context: dict = None):
        log_data = {
            "timestamp": datetime.now().isoformat(),
            "type": "request",
            "request_id": request.id,
            "model": request.model,
            "input_tokens": request.input_tokens,
            "user_id": request.user_id,
            "metadata": context or {}
        }
        self.logger.info(json.dumps(log_data))
    
    def log_response(self, response: Response, duration: float):
        log_data = {
            "timestamp": datetime.now().isoformat(),
            "type": "response",
            "request_id": response.request_id,
            "output_tokens": response.output_tokens,
            "duration_ms": duration * 1000,
            "status": "success" if response else "error",
            "error": response.error if response and response.error else None
        }
        self.logger.info(json.dumps(log_data))
    
    def log_error(self, error: Exception, context: dict):
        log_data = {
            "timestamp": datetime.now().isoformat(),
            "type": "error",
            "error_type": type(error).__name__,
            "error_message": str(error),
            "context": context
        }
        self.logger.error(json.dumps(log_data))
```

### 2. 分布式追踪

```python
# 分布式追踪（OpenTelemetry）
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.trace import StatusCode

# 初始化追踪
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Jaeger 导出
jaeger_exporter = JaegerExporter(
    agent_host_name="jaeger",
    agent_port=6831
)
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(jaeger_exporter)
)

# 使用追踪
class AITracing:
    """AI 请求追踪"""
    
    def __init__(self):
        self.tracer = trace.get_tracer(__name__)
    
    def trace_request(self, request: Request):
        with self.tracer.start_as_current_span("ai_request") as span:
            # 设置属性
            span.set_attribute("request.id", request.id)
            span.set_attribute("model", request.model)
            span.set_attribute("input_tokens", request.input_tokens)
            
            try:
                # 执行请求
                response = self.call_model(request)
                
                # 记录结果
                span.set_attribute("output_tokens", response.output_tokens)
                span.set_attribute("status", "success")
                
                return response
                
            except Exception as e:
                span.set_status(StatusCode.ERROR)
                span.set_attribute("error", str(e))
                raise
```

### 3. 日志级别策略

```python
# 日志级别策略
class LogLevelStrategy:
    """AI 应用的日志级别"""
    
    LEVELS = {
        "DEBUG": "详细调试信息",
        "INFO": "常规请求信息",
        "WARNING": "异常但不影响功能",
        "ERROR": "错误需要关注",
        "CRITICAL": "严重错误需立即处理"
    }
    
    # 推荐策略
    RECOMMENDATIONS = {
        # 始终记录
        "always": [
            "请求开始/结束",
            "错误和异常",
            "关键业务事件"
        ],
        
        # DEBUG 级别
        "debug": [
            "详细的输入/输出",
            "中间处理步骤",
            "调试信息"
        ],
        
        # INFO 级别
        "info": [
            "请求摘要",
            "响应状态",
            "性能指标"
        ],
        
        # WARNING 级别
        "warning": [
            "重试发生",
            "降级发生",
            "速率限制接近"
        ],
        
        # ERROR 级别
        "error": [
            "请求失败",
            "超时",
            "异常错误"
        ]
    }
```

---

## 告警与响应

### 1. 告警规则

```python
# 告警规则定义
class AlertRules:
    """AI Agent 告警规则"""
    
    RULES = {
        "high_error_rate": {
            "metric": "error_rate",
            "threshold": 0.05,
            "duration": "5m",
            "severity": "critical",
            "description": "错误率超过 5%",
            "action": "页面通知 + 值班电话"
        },
        
        "high_latency": {
            "metric": "p99_latency",
            "threshold": 10.0,  # 秒
            "duration": "5m",
            "severity": "warning",
            "description": "P99 延迟超过 10 秒",
            "action": "页面通知"
        },
        
        "high_cost": {
            "metric": "cost_per_hour",
            "threshold": 100.0,  # 美元
            "duration": "1h",
            "severity": "warning",
            "description": "小时成本超过 100 美元",
            "action": "页面通知"
        },
        
        "rate_limit": {
            "metric": "rate_limit_errors",
            "threshold": 10,
            "duration": "1m",
            "severity": "info",
            "description": "速率限制错误增加",
            "action": "记录"
        }
    }
```

### 2. 告警处理

```python
# 告警处理
class AlertHandler:
    """告警处理器"""
    
    def __init__(self):
        self.handlers = {
            "page": self.send_page,
            "email": self.send_email,
            "slack": self.send_slack,
            "webhook": self.send_webhook
        }
    
    async def handle(self, alert: Alert):
        # 确定告警级别
        severity = self.determine_severity(alert)
        
        # 获取处理方式
        action = alert.action
        
        # 执行处理
        for handler_name in action:
            handler = self.handlers.get(handler_name)
            if handler:
                await handler(alert)
        
        # 记录告警
        await self.record_alert(alert)
    
    async def send_page(self, alert: Alert):
        # 发送告警
        pass
    
    async def send_slack(self, alert: Alert):
        # 发送 Slack 消息
        pass
```

### 3. 自动响应

```python
# 自动响应
class AutoResponse:
    """自动响应机制"""
    
    RESPONSES = {
        "high_error_rate": [
            "切换到备用模型",
            "降低流量",
            "发送告警"
        ],
        
        "rate_limit": [
            "增加重试间隔",
            "排队等待",
            "提示用户稍后"
        ],
        
        "high_cost": [
            "限制并发",
            "使用更小模型",
            "提示用户"
        ]
    }
    
    async def execute(self, trigger: str, context: dict):
        responses = self.RESPONSES.get(trigger, [])
        
        for action in responses:
            if action == "切换到备用模型":
                await self.switch_model(context)
            elif action == "降低流量":
                await self.throttle(context)
            elif action == "限制并发":
                await self.limit_concurrency(context)
```

---

## 可视化仪表盘

### 1. 核心指标仪表盘

```python
# 仪表盘配置（Prometheus + Grafana）
DASHBOARD_CONFIG = {
    "title": "AI Agent 可观测性仪表盘",
    "panels": [
        # 请求量
        {
            "title": "请求量",
            "type": "graph",
            "targets": [
                {"expr": "sum(rate(ai_requests_total[5m]))", "legend": "QPS"}
            ]
        },
        
        # 延迟
        {
            "title": "延迟分布",
            "type": "graph",
            "targets": [
                {"expr": "histogram_quantile(0.50, rate(ai_latency_bucket[5m]))", "legend": "P50"},
                {"expr": "histogram_quantile(0.95, rate(ai_latency_bucket[5m]))", "legend": "P95"},
                {"expr": "histogram_quantile(0.99, rate(ai_latency_bucket[5m]))", "legend": "P99"}
            ]
        },
        
        # Token 消耗
        {
            "title": "Token 消耗",
            "type": "graph",
            "targets": [
                {"expr": "sum(rate(ai_tokens_total{type=\"input\"}[1h]))", "legend": "Input"},
                {"expr": "sum(rate(ai_tokens_total{type=\"output\"}[1h]))", "legend": "Output"}
            ]
        },
        
        # 错误率
        {
            "title": "错误率",
            "type": "graph",
            "targets": [
                {"expr": "sum(rate(ai_errors_total[5m])) / sum(rate(ai_requests_total[5m]))", "legend": "Error Rate"}
            ]
        },
        
        # 成本
        {
            "title": "成本趋势",
            "type": "graph",
            "targets": [
                {"expr": "sum(rate(ai_cost_dollars_total[1h]))", "legend": "$/hour"}
            ]
        }
    ]
}
```

### 2. 质量监控面板

```python
# 质量监控面板
QUALITY_PANELS = {
    "panels": [
        # 输出长度分布
        {
            "title": "输出长度分布",
            "type": "heatmap",
            "targets": [
                {"expr": "rate(ai_output_length_bucket[5m])"}
            ]
        },
        
        # 重试率
        {
            "title": "重试率",
            "type": "graph",
            "targets": [
                {"expr": "sum(rate(ai_retries_total[5m])) / sum(rate(ai_requests_total[5m]))"}
            ]
        },
        
        # 截断率
        {
            "title": "截断率",
            "type": "graph",
            "targets": [
                {"expr": "sum(rate(ai_truncations_total[5m])) / sum(rate(ai_requests_total[5m]))"}
            ]
        }
    ]
}
```

---

## 最佳实践

### 1. 指标设计原则

```python
# 指标设计原则
MetricDesign = {
    "原则": [
        "使用标准命名规范",
        "添加适当的标签",
        "设置合理的告警阈值",
        "定期审查指标有效性"
    ],
    
    "推荐": [
        "请求级指标：model、status",
        "Token级指标：type (input/output)",
        "错误级指标：error_type"
    ],
    
    "避免": [
        "过多标签",
        "高基数标签",
        "过度详细"
    ]
}
```

### 2. 日志最佳实践

```python
# 日志最佳实践
LoggingBestPractices = {
    "格式": "JSON 结构化",
    "级别": "INFO 为默认",
    "内容": "不记录敏感信息",
    "采样": "高流量时采样",
    "保留": "根据需求设置保留期"
}
```

### 3. 成本控制

```python
# 成本控制
class CostControl:
    """AI 成本控制"""
    
    def __init__(self):
        self.budget = {}
        self.usage = {}
    
    def set_budget(self, period: str, amount: float):
        self.budget[period] = amount
        self.usage[period] = 0
    
    def check_budget(self, period: str, amount: float) -> bool:
        remaining = self.budget.get(period, 0) - self.usage.get(period, 0)
        return remaining >= amount
    
    def record_usage(self, period: str, amount: float):
        self.usage[period] = self.usage.get(period, 0) + amount
    
    def get_alert_threshold(self, period: str) -> float:
        budget = self.budget.get(period, 0)
        return budget * 0.8  # 80% 时告警
```

---

## 总结

AI Agent 可观测性核心要点：

1. **三大支柱**：指标、日志、追踪
2. **监控维度**：系统级、应用级、模型级、质量级
3. **告警响应**：规则定义、自动处理、分级响应
4. **可视化**：核心指标、质量监控、成本分析

**推荐技术栈**：
- 指标：Prometheus + Grafana
- 日志：ELK/EFK
- 追踪：Jaeger/Zipkin
- 告警：Alertmanager

---

*📅 更新时间：2026-04-01 | 版本：1.0*