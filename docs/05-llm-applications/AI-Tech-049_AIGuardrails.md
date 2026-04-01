# AI Guardrails 安全防护完全指南

> 2026-04-01 | 技术文档 | 预计阅读时间：28分钟

---

## 目录

1. [AI 安全概述](#ai-安全概述)
2. [Guardrails 核心概念](#guardrails-核心概念)
3. [威胁类型与防护](#威胁类型与防护)
4. [Guardrails 框架对比](#guardrails-框架对比)
5. [实现方案](#实现方案)
6. [最佳实践](#最佳实践)
7. [监控与响应](#监控与响应)

---

## AI 安全概述

### AI 安全的重要性

AI 系统面临多种安全挑战：

- **内容安全**：生成有害、违法、违规内容
- **数据安全**：泄露用户隐私、商业机密
- **对抗攻击**：通过输入操纵模型行为
- **系统安全**：API 滥用、资源耗尽

```python
# AI 安全威胁分类
AISecurityThreats = {
    "输入层": [
        "提示词注入 (Prompt Injection)",
        "恶意指令绕过",
        "对抗样本",
        "数据投毒"
    ],
    "输出层": [
        "有害内容生成",
        "敏感信息泄露",
        "幻觉误导",
        "版权侵权"
    ],
    "系统层": [
        "API 滥用",
        "资源耗尽",
        "模型窃取",
        "越权访问"
    ]
}
```

### 为什么需要 Guardrails

| 问题 | 传统方案 | Guardrails 方案 |
|------|----------|-----------------|
| 有害内容 | 人工审核 | 实时检测+过滤 |
| 敏感信息 | 事后处理 | 输入/输出双向防护 |
| 注入攻击 | 无法防护 | 指令识别+隔离 |
| 合规要求 | 被动合规 | 主动防护+审计 |

---

## Guardrails 核心概念

### 1. 防护层次

```python
# 多层防护架构
class GuardrailsArchitecture:
    """AI 安全防护层次"""
    
    @property
    def layers(self):
        return {
            "输入层": {
                "description": "用户输入预处理",
                "components": [
                    "输入验证",
                    "指令检测",
                    "敏感信息脱敏"
                ]
            },
            "模型层": {
                "description": "模型行为控制",
                "components": [
                    "上下文隔离",
                    "输出过滤",
                    "拒绝生成"
                ]
            },
            "输出层": {
                "description": "输出后处理",
                "components": [
                    "内容审核",
                    "敏感信息过滤",
                    "格式校验"
                ]
            },
            "审计层": {
                "description": "日志记录与监控",
                "components": [
                    "请求日志",
                    "响应日志",
                    "告警系统"
                ]
            }
        }
```

### 2. 核心组件

```python
# Guardrails 核心组件
class GuardrailsCore:
    """AI 安全防护核心"""
    
    def __init__(self):
        # 1. 输入验证器
        self.input_validator = InputValidator()
        
        # 2. 内容过滤器
        self.content_filter = ContentFilter()
        
        # 3. 指令检测器
        self.instruction_detector = InstructionDetector()
        
        # 4. 敏感信息处理
        self.pii_handler = PIIHandler()
        
        # 5. 日志记录
        self.logger = SecurityLogger()
    
    def protect(self, input: str, context: Dict) -> ProtectedInput:
        # 验证输入
        validated = self.input_validator.validate(input)
        
        # 检测恶意指令
        instructions = self.instruction_detector.detect(input)
        
        # 处理敏感信息
        sanitized = self.pii_handler.sanitize(input)
        
        # 记录日志
        self.logger.log(input, "input_protected")
        
        return ProtectedInput(
            original=input,
            sanitized=sanitized,
            instructions=instructions,
            validated=validated
        )
```

### 3. 策略类型

```python
# Guardrails 策略类型
PolicyTypes = {
    "reject": "直接拒绝请求",
    "allow": "直接放行",
    "warn": "警告后放行",
    "modify": "修改后放行",
    "escalate": "升级处理",
    "quarantine": "隔离待审"
}
```

---

## 威胁类型与防护

### 1. 提示词注入

```python
# 提示词注入防护
class PromptInjectionProtection:
    """检测和防护提示词注入攻击"""
    
    def __init__(self):
        # 注入模式库
        self.injection_patterns = [
            r"忽略.*指令",
            r"忘记.*规则",
            r"新指令.*优先",
            r"system.*override",
            r"\[INST\].*\[/INST\]",
            r"#{.*}#{.*}",
            r"---.*---"
        ]
        
        # 防护策略
        self.policy = "reject"
    
    def detect(self, text: str) -> DetectionResult:
        """检测注入尝试"""
        import re
        
        matches = []
        for pattern in self.injection_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                matches.append(pattern)
        
        if matches:
            return DetectionResult(
                detected=True,
                confidence=0.9,
                matched_patterns=matches,
                policy=self.policy
            )
        
        return DetectionResult(detected=False, confidence=0)
    
    def protect(self, text: str) -> str:
        """防护处理"""
        result = self.detect(text)
        
        if result.detected:
            # 记录告警
            self.log_alert(text, result)
            
            # 根据策略处理
            if result.policy == "reject":
                raise SecurityException("检测到提示词注入")
            elif result.policy == "sanitize":
                return self.sanitize_instruction(text)
        
        return text
    
    def sanitize_instruction(self, text: str) -> str:
        """移除注入内容"""
        import re
        sanitized = text
        
        for pattern in self.injection_patterns:
            sanitized = re.sub(pattern, "[已过滤]", sanitized, flags=re.IGNORECASE)
        
        return sanitized
```

### 2. 有害内容检测

```python
# 有害内容分类
class HarmfulContentClassifier:
    """有害内容分类与检测"""
    
    CATEGORIES = {
        "violence": {
            "keywords": ["暴力", "杀害", "攻击", "武器"],
            "severity": "high",
            "policy": "reject"
        },
        "sexual": {
            "keywords": ["色情", "裸体", "性感"],
            "severity": "high",
            "policy": "reject"
        },
        "hate": {
            "keywords": ["仇恨", "歧视", "种族主义"],
            "severity": "high",
            "policy": "reject"
        },
        "self_harm": {
            "keywords": ["自杀", "自残", "伤害自己"],
            "severity": "critical",
            "policy": "reject"
        },
        "illegal": {
            "keywords": ["违法", "犯罪", "毒品"],
            "severity": "critical",
            "policy": "reject"
        },
        "medical": {
            "keywords": ["医疗建议", "诊断"],
            "severity": "medium",
            "policy": "warn"
        }
    }
    
    def detect(self, text: str) -> List[ContentCategory]:
        """检测内容类别"""
        detected = []
        
        for category, config in self.CATEGORIES.items():
            matches = sum(1 for kw in config["keywords"] if kw in text)
            
            if matches > 0:
                detected.append(ContentCategory(
                    category=category,
                    confidence=min(matches / 2, 1.0),
                    severity=config["severity"],
                    policy=config["policy"]
                ))
        
        return detected
    
    def filter(self, text: str) -> FilterResult:
        """过滤有害内容"""
        categories = self.detect(text)
        
        if not categories:
            return FilterResult(allowed=True)
        
        # 按严重程度排序
        critical = [c for c in categories if c.severity == "critical"]
        high = [c for c in categories if c.severity == "high"]
        medium = [c for c in categories if c.severity == "medium"]
        
        if critical:
            return FilterResult(
                allowed=False,
                reason="检测到严重违规内容",
                categories=categories,
                policy="reject"
            )
        
        if high:
            return FilterResult(
                allowed=False,
                reason="检测到违规内容",
                categories=categories,
                policy="reject"
            )
        
        if medium:
            return FilterResult(
                allowed=True,
                warning="内容可能涉及敏感话题",
                categories=categories,
                policy="warn"
            )
        
        return FilterResult(allowed=True)
```

### 3. 敏感信息保护

```python
# PII 检测与处理
class PIIProtection:
    """个人身份信息保护"""
    
    PII_PATTERNS = {
        "phone": {
            "pattern": r"1[3-9]\d{9}",
            "type": "手机号",
            "action": "mask"
        },
        "email": {
            "pattern": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
            "type": "邮箱",
            "action": "mask"
        },
        "id_card": {
            "pattern": r"\d{17}[\dXx]",
            "type": "身份证",
            "action": "block"
        },
        "bank_card": {
            "pattern": r"\d{16,19}",
            "type": "银行卡",
            "action": "block"
        },
        "address": {
            "keywords": ["地址", "住址", "家庭住址"],
            "type": "地址",
            "action": "warn"
        }
    }
    
    def detect(self, text: str) -> List[PIIDetection]:
        """检测 PII"""
        import re
        detections = []
        
        for pii_type, config in self.PII_PATTERNS.items():
            if "pattern" in config:
                matches = re.finditer(config["pattern"], text)
                for match in matches:
                    detections.append(PIIDetection(
                        type=pii_type,
                        value=match.group(),
                        position=match.span(),
                        action=config["action"]
                    ))
            elif "keywords" in config:
                for keyword in config["keywords"]:
                    if keyword in text:
                        detections.append(PIIDetection(
                            type=pii_type,
                            value=keyword,
                            position=text.find(keyword),
                            action=config["action"]
                        ))
        
        return detections
    
    def sanitize(self, text: str) -> str:
        """脱敏处理"""
        detections = self.detect(text)
        
        if not detections:
            return text
        
        # 按位置倒序处理（避免索引偏移）
        sanitized = text
        for d in sorted(detections, key=lambda x: x.position[0], reverse=True):
            if d.action == "mask":
                masked = d.value[0] + "*" * (len(d.value) - 2) + d.value[-1]
                sanitized = sanitized[:d.position[0]] + masked + sanitized[d.position[1]:]
            elif d.action == "block":
                sanitized = sanitized[:d.position[0]] + "[已过滤]" + sanitized[d.position[1]:]
        
        return sanitized
```

---

## Guardrails 框架对比

### 1. 主流框架

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| **Guardrails AI** | 完整方案、结构化输出 | 企业级应用 |
| **NeMo Guardrails** | NVIDIA、对话安全 | 聊天应用 |
| **LlamaGuard** | Meta、开源 | 开源模型 |
| **Content Safety SDK** | Azure、微软生态 | Azure 用户 |
| **Amazon Bedrock Guardrails** | AWS、云原生 | AWS 生态 |

### 2. Guardrails AI

```python
# Guardrails AI 使用
from guardrails import Guard, Validator, OnFailAction
from guardrails.hub import ToxicContent, SensitiveTopic

# 定义规则
guard = Guard().on(
    Validator(
        ToxicContent,
        on_fail=OnFailAction.REJECT
    )
).on(
    Validator(
        SensitiveTopic,
        on_fail=OnFailAction.WARN,
        params={"topics": ["医疗", "法律"]}
    )
)

# 使用
result = guard.validate(user_input)
print(result)
```

### 3. NeMo Guardrails

```python
# NeMo Guardrails 配置
from nemoguardrails import RailsConfig, Chatbot
from nemoguardrails.actions import action

# 定义对话流
config = RailsConfig.from_path("./config")

# 自定义动作
@action
async def check_safety(context: dict):
    if context.get("user_message"):
        # 检查内容
        return {"safe": True}
    return {"safe": False}

# 初始化
chatbot = Chatbot(config)

# 对话
response = await chatbot.chat("用户消息")
```

---

## 实现方案

### 1. 基础实现

```python
# 简单的 Guardrails 实现
class SimpleGuardrails:
    """轻量级 AI 安全防护"""
    
    def __init__(self):
        self.input_filters = [
            PromptInjectionFilter(),
            PIIfilter(),
            LengthFilter(max_length=10000)
        ]
        
        self.output_filters = [
            ToxicContentFilter(),
            SensitiveInfoFilter()
        ]
        
        self.logger = Logging()
    
    def validate_input(self, text: str) -> ValidationResult:
        for filter in self.input_filters:
            result = filter.check(text)
            if not result.pass:
                self.logger.warning(f"输入过滤: {result.reason}")
                
                if result.block:
                    raise InputRejected(result.reason)
        
        return ValidationResult(pass=True)
    
    def validate_output(self, text: str) -> ValidationResult:
        for filter in self.output_filters:
            result = filter.check(text)
            if not result.pass:
                self.logger.warning(f"输出过滤: {result.reason}")
                
                if result.block:
                    raise OutputRejected(result.reason)
        
        return ValidationResult(pass=True)
    
    def protect(self, input_text: str, output_text: str = None):
        # 验证输入
        self.validate_input(input_text)
        
        # 验证输出
        if output_text:
            self.validate_output(output_text)
        
        return True
```

### 2. 完整实现

```python
# 企业级 Guardrails
class EnterpriseGuardrails:
    """完整的企业级安全防护"""
    
    def __init__(self, config: GuardrailsConfig):
        self.config = config
        
        # 1. 输入防护
        self.input_guard = InputGuard(config.input)
        
        # 2. 输出防护
        self.output_guard = OutputGuard(config.output)
        
        # 3. 上下文隔离
        self.context_isolation = ContextIsolation()
        
        # 4. 速率限制
        self.rate_limiter = RateLimiter(config.rate_limit)
        
        # 5. 日志审计
        self.audit = AuditLogger(config.audit)
        
        # 6. 监控告警
        self.monitor = Monitor(config.monitor)
    
    async def process(self, request: Request) -> Response:
        # 1. 速率检查
        await self.rate_limiter.check(request.user_id)
        
        # 2. 输入验证
        sanitized_input = await self.input_guard.process(request.input)
        
        # 3. 上下文隔离
        isolated_context = await self.context_isolation.isolate(
            request.context
        )
        
        # 4. 调用模型（用户逻辑）
        output = await self.call_model(sanitized_input, isolated_context)
        
        # 5. 输出验证
        safe_output = await self.output_guard.process(output)
        
        # 6. 审计日志
        await self.audit.log(request, safe_output)
        
        # 7. 监控指标
        await self.monitor.record(request, safe_output)
        
        return Response(output=safe_output)
```

### 3. 配置示例

```python
# Guardrails 配置
guardrails_config = {
    "input": {
        "max_length": 10000,
        "allowed_languages": ["zh", "en"],
        "filters": [
            {
                "type": "prompt_injection",
                "policy": "reject"
            },
            {
                "type": "pii",
                "policy": "mask"
            },
            {
                "type": "custom_keywords",
                "keywords": ["敏感词1", "敏感词2"],
                "policy": "reject"
            }
        ]
    },
    "output": {
        "filters": [
            {
                "type": "toxic_content",
                "policy": "reject"
            },
            {
                "type": "sensitive_info",
                "policy": "mask"
            },
            {
                "type": "hallucination",
                "policy": "warn"
            }
        ]
    },
    "rate_limit": {
        "requests_per_minute": 60,
        "tokens_per_minute": 100000,
        "burst": 100
    },
    "audit": {
        "enabled": True,
        "storage": "elasticsearch",
        "retention_days": 90
    }
}
```

---

## 最佳实践

### 1. 分层防护

```python
# 分层防护策略
LayeredProtection = {
    "第一层": "边界防护（网关/负载均衡）",
    "第二层": "输入验证（格式/长度/关键词）",
    "第三层": "内容检测（AI 模型判断）",
    "第四层": "输出过滤（敏感信息/格式）",
    "第五层": "审计日志（全量记录）"
}
```

### 2. 性能优化

```python
# 性能优化策略
PerformanceOptimization = {
    "缓存": "常用规则缓存",
    "异步": "非关键检查异步执行",
    "批处理": "批量内容审核",
    "降级": "高负载时简化检查"
}

# 异步检查示例
async def async_validate(self, text: str):
    # 快速检查同步执行
    quick_result = self.quick_check(text)
    if not quick_result.pass:
        return quick_result
    
    # 深度检查异步执行
    asyncio.create_task(self.deep_check(text))
    
    return ValidationResult(pass=True, async_pending=True)
```

### 3. 持续学习

```python
# 持续优化
ContinuousImprovement = {
    "定期更新": "关键词库、模式库",
    "用户反馈": "收集误报/漏报",
    "威胁情报": "跟踪最新攻击手法",
    "红队测试": "定期模拟攻击"
}
```

---

## 监控与响应

### 1. 监控指标

```python
# 安全监控指标
SecurityMetrics = {
    "请求量": "total_requests",
    "拦截量": "blocked_requests",
    "拦截率": "block_rate",
    "响应时间": "latency_ms",
    "误报率": "false_positive_rate",
    "漏报率": "false_negative_rate"
}
```

### 2. 告警规则

```python
# 告警配置
AlertRules = {
    "high_block_rate": {
        "metric": "block_rate",
        "threshold": 0.5,
        "duration": "5m",
        "severity": "warning"
    },
    "suspicious_activity": {
        "metric": "requests_per_user",
        "threshold": 1000,
        "duration": "1m",
        "severity": "critical"
    }
}
```

### 3. 响应流程

```python
# 事件响应
class IncidentResponse:
    """安全事件响应"""
    
    def __init__(self):
        self.escalation = {
            "low": "记录",
            "medium": "通知管理员",
            "high": "自动阻断 + 通知",
            "critical": "阻断 + 升级 + 回调"
        }
    
    async def handle(self, event: SecurityEvent):
        severity = self.calculate_severity(event)
        
        # 响应动作
        action = self.escalation[severity]
        
        # 执行
        if action == "记录":
            await self.log(event)
        elif action == "通知管理员":
            await self.notify(event)
        elif action == "自动阻断":
            await self.block(event)
            await self.notify(event)
        elif action == "升级":
            await self.block(event)
            await self.escalate(event)
        
        return {"handled": True, "action": action}
```

---

## 总结

AI Guardrails 安全防护核心要点：

1. **多层防护**：输入层 → 模型层 → 输出层 → 审计层
2. **威胁覆盖**：提示词注入、有害内容、敏感信息、API 滥用
3. **框架选择**：Guardrails AI、NeMo Guardrails、LlamaGuard
4. **最佳实践**：分层防护、性能优化、持续学习

**推荐架构**：
```
用户 → 速率限制 → 输入验证 → 内容检测 → 模型 → 输出过滤 → 响应
                    ↓              ↓                  ↓
                审计日志        审计日志          审计日志
```

---

*📅 更新时间：2026-04-01 | 版本：1.0*