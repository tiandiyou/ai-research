# AI Agent 评估基准完全指南

> 2026-04-01 | 技术文档 | 预计阅读时间：25分钟

---

## 目录

1. [AI Agent 评估概述](#ai-agent-评估概述)
2. [评估维度](#评估维度)
3. [主流基准测试](#主流基准测试)
4. [评估指标体系](#评估指标体系)
5. [构建自定义评估](#构建自定义评估)
6. [实践案例](#实践案例)
7. [最佳实践](#最佳实践)

---

## AI Agent 评估概述

### 为什么需要评估

AI Agent 评估是确保 AI 系统质量的核心环节：

- **质量保障**：验证 Agent 输出是否符合预期
- **迭代优化**：通过评估结果指导模型改进
- **对比选择**：为特定任务选择最佳模型
- **监控部署**：生产环境持续监控性能

```python
# 评估流程
class AgentEvaluation:
    def evaluate(self, agent: Agent, test_cases: List[TestCase]) -> EvaluationResult:
        results = []
        for case in test_cases:
            # 运行 Agent
            output = agent.run(case.input)
            
            # 计算指标
            metrics = self.compute_metrics(output, case.expected, case.metrics)
            
            results.append(Result(
                input=case.input,
                output=output,
                expected=case.expected,
                metrics=metrics
            ))
        
        return self.aggregate(results)
```

### 评估 vs 测试

| 维度 | 软件测试 | AI Agent 评估 |
|------|----------|---------------|
| 确定性 | 输入确定 → 输出确定 | 同一输入可能不同输出 |
| 正确性 | 有标准答案 | 可能多个正确答案 |
| 边界 | 明确边界条件 | 边界模糊 |
| 评估者 | 规则判断 | 需 LLM 或人工 |

---

## 评估维度

### 1. 功能正确性

```python
# 功能评估维度
FunctionalDimensions = {
    "任务完成": "是否完成指定任务",
    "输出格式": "是否符合要求的格式",
    "信息准确": "提供的信息是否正确",
    "步骤完整": "是否包含所有必要步骤"
}

# 示例评估
def evaluate_functionality(agent, test_case):
    result = agent.run(test_case.input)
    
    # 任务完成度
    task_score = calculate_task_completion(result, test_case.expected)
    
    # 格式匹配度
    format_score = calculate_format_match(result, test_case.format)
    
    return {
        "task_completion": task_score,
        "format_accuracy": format_score,
        "overall": (task_score + format_score) / 2
    }
```

### 2. 安全性

```python
# 安全评估维度
SafetyDimensions = {
    "有害内容": "是否生成违规/有害内容",
    "敏感信息": "是否泄露隐私/机密",
    "指令注入": "是否被恶意指令绕过",
    "偏见检测": "是否存在歧视性内容"
}

# 安全检查实现
SafetyChecks = {
    "harmful_content": [
        "暴力", "色情", "仇恨", "危险行为"
    ],
    "pii_leakage": [
        "手机号", "身份证", "银行卡", "邮箱"
    ],
    "jailbreak": [
        "忽略之前指令", "系统提示词注入"
    ]
}
```

### 3. 效率

```python
# 效率评估维度
EfficiencyDimensions = {
    "响应时间": "从请求到响应的时间",
    "Token 消耗": "输入+输出的 token 数量",
    "调用次数": "完成一次任务需要的 API 调用",
    "资源使用": "内存/CPU 占用"
}

def evaluate_efficiency(agent, test_case):
    import time
    import tiktoken
    
    start = time.time()
    output = agent.run(test_case.input)
    elapsed = time.time() - start
    
    encoder = tiktoken.get_encoding("cl100k_base")
    tokens = len(encoder.encode(output))
    
    return {
        "latency_ms": elapsed * 1000,
        "tokens": tokens,
        "cost_estimate": tokens * 0.00001  # 估算成本
    }
```

### 4. 可靠性

```python
# 可靠性评估维度
ReliabilityDimensions = {
    "一致性": "相同输入是否产生相同输出",
    "稳定性": "多次运行是否稳定",
    "错误处理": "异常输入如何处理",
    "降级能力": "失败时是否优雅降级"
}

def evaluate_consistency(agent, test_case, runs=5):
    outputs = [agent.run(test_case.input) for _ in range(runs)]
    
    # 计算输出相似度
    similarity = calculate_similarity(outputs)
    
    return {
        "similarity": similarity,
        "stable": similarity > 0.9
    }
```

### 5. 可用性

```python
# 可用性评估维度
UsabilityDimensions = {
    "易用性": "使用是否简单直观",
    "可解释性": "输出是否容易理解",
    "可调试性": "问题是否容易定位",
    "文档完善": "文档是否充分
```

---

## 主流基准测试

### 1. 通用能力基准

| 基准 | 机构 | 特点 | 适用场景 |
|------|------|------|----------|
| **MMLU** | Google | 57 个任务，多学科 | 基础能力 |
| **Big-Bench** | Google | 200+ 任务，难度高 | 综合评估 |
| **HumanEval** | OpenAI | 代码生成 | 编程能力 |
| **MBPP** | Google | Python 编程 | 编程能力 |
| **MT-Bench** | LMSYS | 多轮对话 | 聊天质量 |

### 2. Agent 特定基准

| 基准 | 特点 | 评估维度 |
|------|------|----------|
| **AgentBench** | 跨环境评估 | 任务完成、效率 |
| **WebArena** | 真实网页环境 | 网页操作能力 |
| **MiniWob++** | 网页交互 | UI 操作 |
| **ToolBench** | API 调用 | 工具使用能力 |
| **AgentBoard** | 多维度评估 | 诊断工具 |

### 3. 领域基准

```python
# 领域特定基准
DomainBenchmarks = {
    "医疗": ["MedQA", "PubMedQA", "MedMCQA"],
    "法律": ["LEXTREME", "CaseHOLD"],
    "金融": ["FLARE", "FinQA"],
    "教育": ["MMLU-Stewart", "SciQ"],
    "代码": ["HumanEval", "MBPP", "APPS"]
}

# 使用示例
def run_domain_benchmark(domain, agent):
    benchmarks = DomainBenchmarks[domain]
    results = {}
    
    for bench in benchmarks:
        data = load_dataset(bench)
        score = evaluate(agent, data)
        results[bench] = score
    
    return results
```

---

## 评估指标体系

### 1. 准确率类指标

```python
# 准确率指标
AccuracyMetrics = {
    "Exact Match (EM)": "完全匹配率",
    "F1 Score": "精确率和召回率的调和平均",
    "Accuracy": "正确率",
    "Top-k Accuracy": "Top-k 正确率"
}

def exact_match(prediction, ground_truth):
    return prediction.strip() == ground_truth.strip()

def f1_score(prediction, ground_truth):
    pred_tokens = set(prediction.split())
    true_tokens = set(ground_truth.split())
    
    common = pred_tokens & true_tokens
    if not common:
        return 0
    
    precision = len(common) / len(pred_tokens)
    recall = len(common) / len(true_tokens)
    
    return 2 * precision * recall / (precision + recall)
```

### 2. 生成质量指标

```python
# 生成质量指标
GenerationMetrics = {
    "BLEU": "N-gram 重叠度",
    "ROUGE": "召回导向",
    "METEOR": "语义相似",
    "BERTScore": "语义相似 (BERT)",
    "PERPLEXITY": "语言模型困惑度"
}

from bert_score import score as bert_score

def calculate_bertscore(predictions, references):
    P, R, F1 = bert_score(predictions, references, lang='en')
    return {
        "precision": P.mean().item(),
        "recall": R.mean().item(),
        "f1": F1.mean().item()
    }
```

### 3. Agent 特定指标

```python
# Agent 评估指标
AgentMetrics = {
    "Task Success Rate": "任务成功率",
    "Step Success Rate": "步骤成功率",
    "Path Efficiency": "路径效率 (实际步数/最优步数)",
    "Error Recovery Rate": "错误恢复率",
    "Cost Efficiency": "成本效率 (效果/成本)"
}

def calculate_task_success(agent, test_suite):
    results = []
    for case in test_suite:
        output = agent.run(case.input)
        success = evaluate_success(output, case.expected)
        results.append(success)
    
    return {
        "success_rate": sum(results) / len(results),
        "total": len(results),
        "passed": sum(results)
    }

def calculate_path_efficiency(agent, test_case):
    # 记录实际执行路径
    trace = agent.run_with_trace(test_case.input)
    
    # 计算效率
    actual_steps = len(trace)
    optimal_steps = test_case.optimal_steps
    
    return {
        "actual": actual_steps,
        "optimal": optimal_steps,
        "efficiency": optimal_steps / actual_steps if actual_steps > 0 else 0
    }
```

### 4. LLM 作为评估器

```python
# 使用 LLM 评估
class LLMEvaluator:
    def __init__(self, model="gpt-4"):
        self.model = model
    
    def evaluate(self, output, criteria, input=None, reference=None):
        prompt = f"""请根据以下标准评估输出：

评估标准：{criteria}

输入：{input or '无'}

标准答案：{reference or '无'}

实际输出：{output}

请给出：
1. 得分 (0-100)
2. 评估理由
3. 改进建议

输出格式：
评分: XX
理由: ...
建议: ..."""
        
        response = call_llm(self.model, prompt)
        return self.parse_response(response)
```

---

## 构建自定义评估

### 1. 定义评估数据

```python
# 评估数据集结构
class EvaluationDataset:
    def __init__(self):
        self.test_cases = []
    
    def add_case(self, test_case: TestCase):
        self.test_cases.append(test_case)
    
    def load_from_file(self, file_path):
        import json
        with open(file_path) as f:
            data = json.load(f)
        
        for item in data:
            self.add_case(TestCase(
                input=item["input"],
                expected=item["expected"],
                metrics=item.get("metrics", ["accuracy"]),
                metadata=item.get("metadata", {})
            ))

# 测试用例示例
test_case = TestCase(
    input="帮我预订明天北京到上海的最便宜机票",
    expected={
        "has_departure": True,
        "has_destination": True,
        "has_date": True,
        "has_price": True
    },
    metrics=["task_completion", "format", "safety"]
)
```

### 2. 实现评估器

```python
# 自定义评估器
class CustomEvaluator:
    def __init__(self, metrics: List[str]):
        self.metrics = metrics
    
    def evaluate(self, output: str, test_case: TestCase) -> Dict:
        results = {}
        
        if "task_completion" in self.metrics:
            results["task_completion"] = self.eval_task_completion(
                output, test_case.expected
            )
        
        if "format" in self.metrics:
            results["format"] = self.eval_format(output)
        
        if "safety" in self.metrics:
            results["safety"] = self.eval_safety(output)
        
        if "helpfulness" in self.metrics:
            results["helpfulness"] = self.eval_helpfulness(output)
        
        return results
    
    def eval_task_completion(self, output, expected):
        # 检查关键实体
        score = 0
        for key, value in expected.items():
            if value and key.lower() in output.lower():
                score += 1
        
        return score / len(expected) if expected else 1.0
```

### 3. 批量评估

```python
# 批量评估
def batch_evaluate(agent, dataset: EvaluationDataset) -> EvaluationReport:
    results = []
    
    for i, case in enumerate(dataset.test_cases):
        try:
            output = agent.run(case.input, timeout=60)
            metrics = evaluator.evaluate(output, case)
            results.append(TestResult(
                case_id=i,
                success=True,
                metrics=metrics,
                output=output
            ))
        except Exception as e:
            results.append(TestResult(
                case_id=i,
                success=False,
                error=str(e)
            ))
    
    # 生成报告
    return generate_report(results)
```

---

## 实践案例

### 案例一：客服 Agent 评估

```python
# 客服 Agent 评估配置
CustomerServiceEvaluation = {
    "test_cases": [
        # 咨询类
        {"input": "产品A多少钱？", "category": "inquiry"},
        {"input": "如何使用优惠券？", "category": "guide"},
        # 投诉类
        {"input": "东西坏了要退货", "category": "complaint"},
        # 办理类
        {"input": "帮我取消订单", "category": "service"}
    ],
    
    "metrics": {
        "task_completion": "是否解决用户问题",
        "empathy": "是否体现同理心",
        "clarity": "表达是否清晰",
        "accuracy": "信息是否准确"
    },
    
    "weight": {
        "task_completion": 0.4,
        "empathy": 0.2,
        "clarity": 0.2,
        "accuracy": 0.2
    }
}
```

### 案例二：代码生成 Agent 评估

```python
# 代码生成评估
CodeGenEvaluation = {
    "metrics": [
        "pass_rate",      # 测试通过率
        "code_quality",   # 代码质量
        "security",       # 安全性
        "efficiency"      # 执行效率
    ],
    
    "test_framework": "unittest",
    
    "evaluate": lambda output: {
        "run_tests": execute_tests(output),
        "check_security": security_scan(output),
        "check_efficiency": complexity_check(output)
    }
}

# 执行测试
def execute_tests(code):
    import subprocess
    result = subprocess.run(
        ["pytest", "-v", code_file],
        capture_output=True
    )
    return result.returncode == 0
```

---

## 最佳实践

### 1. 评估数据构建

```python
# 好的测试数据特点
GoodTestData = {
    "覆盖率": "覆盖主要场景和边界",
    "多样性": "不同表述、不同难度",
    "可验证": "有明确的正确答案",
    "代表性": "真实反映用户需求",
    
    "避免": [
        "过于简单",
        "有明显模式",
        "正确答案不明确"
    ]
}
```

### 2. 指标选择

```python
# 指标选择原则
MetricSelection = {
    "主指标": "task_completion (任务完成率)",
    "辅指标": [
        "latency (延迟)",
        "cost (成本)",
        "safety (安全)"
    ],
    
    "选择依据": [
        "任务类型",
        "业务需求",
        "用户期望"
    ]
}
```

### 3. 结果分析

```python
# 分析评估结果
def analyze_results(results: EvaluationReport):
    # 1. 整体统计
    overall = {
        "avg_score": sum(r.score for r in results) / len(results),
        "pass_rate": sum(r.success for r in results) / len(results)
    }
    
    # 2. 按维度分析
    by_dimension = {}
    for r in results:
        for dim, score in r.dimensions.items():
            by_dimension.setdefault(dim, []).append(score)
    
    # 3. 找出问题
    weak_points = [
        dim for dim, scores in by_dimension.items()
        if sum(scores) / len(scores) < 0.7
    ]
    
    return {
        "overall": overall,
        "by_dimension": by_dimension,
        "weak_points": weak_points
    }
```

---

## 总结

AI Agent 评估核心要点：

1. **多维度**：功能、安全、效率、可靠性、可用性
2. **指标体系**：准确率 + 生成质量 + Agent 特定
3. **自定义评估**：定义数据 → 实现评估器 → 批量运行
4. **LLM 评估**：用 AI 评估 AI，结合规则和判断

**推荐基准**：
- 通用：MMLU、Big-Bench
- Agent：AgentBench、WebArena
- 领域：按需选择

---

*📅 更新时间：2026-04-01 | 版本：1.0*