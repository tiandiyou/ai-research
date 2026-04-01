# Prompt Engineering 完全指南

> 2026-04-01 | 技术文档 | 预计阅读时间：30分钟

---

## 目录

1. [Prompt 概述](#prompt-概述)
2. [核心原则](#核心原则)
3. [技术技巧](#技术技巧)
4. [框架模式](#框架模式)
5. [高级应用](#高级应用)
6. [评估优化](#评估优化)

---

## Prompt 概述

### 什么是 Prompt Engineering

Prompt Engineering（提示词工程）是设计和优化输入给大语言模型的文本的技术，核心目标：

- **引导模型**：让模型产生期望的输出
- **激发能力**：充分发挥模型的知识和技能
- **控制输出**：确保输出符合格式/风格/安全要求

```python
# Prompt 核心要素
class PromptElements:
    """Prompt 核心要素"""
    
    # 1. 指令 (Instruction)
    INSTRUCTION = {
        "作用": "告诉模型要做什么",
        "示例": "请总结以下文章"
    }
    
    # 2. 上下文 (Context)
    CONTEXT = {
        "作用": "提供背景信息",
        "示例": "假设你是一个专业的律师"
    }
    
    # 3. 输入数据 (Input Data)
    INPUT_DATA = {
        "作用": "需要处理的具体内容",
        "示例": "文章内容：xxx"
    }
    
    # 4. 输出格式 (Output Indicator)
    OUTPUT_FORMAT = {
        "作用": "指定输出格式",
        "示例": "请以 JSON 格式输出"
    }
```

### 为什么重要

| 场景 | 弱 Prompt | 强 Prompt |
|------|-----------|-----------|
| 翻译 | 翻译这段话 | 你是专业翻译，请直译，保持原文风格，保留专业术语 |
| 代码 | 写个排序 | Python实现快速排序，O(n log n)，包含测试用例 |
| 分析 | 分析数据 | 分析销售数据，找出Top5产品，计算同比环比 |

---

## 核心原则

### 1. 清晰明确

```python
# 清晰明确的原则
class ClearAndSpecific:
    """清晰明确"""
    
    # ❌ 模糊
    BAD = "写一些关于AI的东西"
    
    # ✅ 清晰
    GOOD = """请写一篇1500字的文章，主题是AI在医疗领域的应用。
要求：
1. 包含3个具体案例
2. 技术层面和商业层面都要涉及
3. 使用专业但易懂的语言"""

# 具体化技巧
SpecificityTips = {
    "具体任务": "不要"写代码"，要"用Python实现快速排序"",
    "具体格式": "不要"输出结果"，要"以JSON格式输出，包含id和name字段"",
    "具体长度": "不要"写长一点"，要"写500字左右"",
    "具体受众": "不要"写给用户"，要"写给没有技术背景的管理层""
}
```

### 2. 结构化

```python
# 结构化原则
class Structured:
    """结构化"""
    
    # 使用分隔符
    USE_DELIMITERS = {
        "作用": "区分不同部分",
        "符号": "```, ###, ---, XML标签",
        "示例": """请分析以下内容：
---
{文章内容}
---

输出格式：
1. 核心观点
2. 支持论据
3. 结论"""
    }
    
    # 使用列表
    USE_LIST = {
        "作用": "明确各项要求",
        "示例": """请完成以下任务：
1. 提取关键信息
2. 分类整理
3. 生成摘要"""
    }
    
    # 使用编号
    USE_NUMBERING = {
        "作用": "表示顺序和步骤",
        "示例": """步骤1：分析数据
步骤2：发现问题
步骤3：提出建议"""
    }
```

### 3. 角色代入

```python
# 角色代入
class RolePlaying:
    """角色代入"""
    
    # 角色定义
    ROLE_TEMPLATE = """你是一位{角色}，拥有{年限}年经验，专精{领域}。
你的特点是：
1. {特点1}
2. {特点2}
3. {特点3}

请以该角色回答以下问题。"""

    # 示例
    EXAMPLES = {
        "律师": "你是一位资深商业律师，擅长合同审查和风险评估。你的特点是严谨、务实、注重细节。",
        
        "技术专家": "你是一位全栈技术专家，拥有10年开发经验。你的特点是逻辑清晰、注重效率、善于解决问题。",
        
        "营销专家": "你是一位品牌营销专家，擅长用户洞察和内容策划。你的特点是创意十足、数据驱动、注重转化。"
    }
```

---

## 技术技巧

### 1. Few-shot 学习

```python
# Few-shot Prompting
class FewShot:
    """少样本提示"""
    
    # 模板
    FEWSHOT_TEMPLATE = """任务：{任务描述}

示例：
{示例1}
{示例2}
{示例3}

请根据以上示例，完成以下任务：
{任务}"""

    # 示例：情感分析
    SENTIMENT_EXAMPLES = """示例1：
文本：我今天太开心了！
情感：positive

示例2：
文本：这个产品太差了，浪费钱。
情感：negative

示例3：
文本：还行吧，一般般。
情感：neutral

请判断以下文本的情感：
文本：{input}
情感："""

# 使用
prompt = SENTIMENT_EXAMPLES.format(input="这个服务真的很棒")
```

### 2. Chain of Thought

```python
# Chain of Thought (CoT)
class ChainOfThought:
    """思维链"""
    
    # 标准 CoT
    COT_TEMPLATE = """请逐步推理，回答以下问题。

问题：{问题}

步骤：
1. {步骤1}
2. {步骤2}
3. {步骤3}

因此，答案是："""

    # 零样本 CoT
    ZEROSHOT_COT = """问题：{问题}

让我们一步步思考。
"""
    
    # 数学示例
    MATH_EXAMPLE = """问题：小明有10个苹果，给了小红3个，又买了5个，现在有多少个？

让我们一步步思考：
1. 小明原来有10个苹果
2. 给小红3个，剩下10-3=7个
3. 又买了5个，现在有7+5=12个

答案是：12个"""
```

### 3. ReAct (Reason + Act)

```python
# ReAct 模式
class ReAct:
    """推理+行动"""
    
    REACT_TEMPLATE = """你是一个AI助手，可以通过工具来回答问题。

可用工具：
- search(query): 搜索信息
- calculate(expression): 计算数学表达式
- translate(text, lang): 翻译

问题：{问题}

请按以下格式回答：
思考：我需要...
行动：使用search工具搜索...
观察：从搜索结果中获得...
... (重复以上步骤直到得出答案)
最终答案："""

# 示例
REACT_EXAMPLE = """问题：北京今天的天气怎么样？

思考：我需要查询北京的天气信息。
行动：使用search工具搜索"北京天气"
观察：根据搜索结果，北京今天晴转多云，最高温度25度。
最终答案：北京今天晴转多云，最高温度25度，适合出行。
"""
```

---

## 框架模式

### 1. RACE 框架

```python
# RACE 框架
class RACE:
    """RACE 提示框架"""
    
    RACE_TEMPLATE = """
【角色】{role}
【任务】{task}
【上下文】{context}
【输出要求】{output}
"""
    
    # 示例
    EXAMPLE = """
【角色】你是一位资深产品经理
【任务】设计一款面向老年人的智能手机
【上下文】中国老龄化加剧，老年用户对智能手机的需求日益增长，但现有产品操作复杂
【输出要求】
1. 目标用户画像
2. 核心功能设计
3. 交互设计特点
4. 定价策略建议
"""
```

### 2. BROKE 框架

```python
# BROKE 框架
class BROKE:
    """BROKE 提示框架"""
    
    BROKE_TEMPLATE = """
背景 (Background): {背景}
角色 (Role): {角色}
目标 (Objective): {目标}
关键结果 (Key Results): {关键结果}
演化 (Evolution): {演化}
"""
    
    # 示例
    EXAMPLE = """
背景：公司的客服团队每天处理1000+咨询，人工成本高
角色：你是AI产品专家
目标：设计一个AI客服系统
关键结果：
- 自动回答率>80%
- 客户满意度>90%
- 响应时间<30秒
演化：根据用户反馈不断优化回答质量
"""
```

### 3. CRISPE 框架

```python
# CRISPE 框架
class CRISPE:
    """CRISPE 提示框架"""
    
    CRISPE_TEMPLATE = """
能力与背景 (Capacity and Background): {能力背景}
角色 (Role): {角色}
陈述 (Statement): {陈述}
个性 (Personality): {个性}
体验 (Experience): {体验}
"""
```

---

## 高级应用

### 1. 知识生成

```python
# 知识生成提示
KnowledgeGeneration = {
    "概念定义": """请为以下概念生成简洁的定义：

概念：{concept}

定义（50字以内）：""",

    "对比分析": """请对比分析以下两个概念：

概念1：{concept1}
概念2：{concept2}

对比维度：
1. 定义
2. 应用场景
3. 优缺点
4. 关系""",

    "流程说明": """请详细说明以下流程：

流程：{process}

步骤：
1. ...
2. ...
3. ...

注意事项："""
}
```

### 2. 代码生成

```python
# 代码生成提示
CodeGeneration = {
    "功能实现": """用{language}实现{function}。

要求：
1. 功能完整，可直接运行
2. 代码规范，添加注释
3. 包含基本错误处理
4. 给出使用示例

代码：""",

    "代码审查": """请审查以下代码，指出问题并给出改进建议：

语言：{language}
代码：
```{language}
{code}
```

审查维度：
1. 正确性
2. 性能
3. 安全
4. 可维护性
5. 最佳实践""",

    "代码解释": """请解释以下代码的功能和工作原理：

语言：{language}
代码：
```{language}
{code}
```

解释："""
}
```

### 3. 内容创作

```python
# 内容创作提示
ContentCreation = {
    "文章写作": """请根据以下主题撰写一篇{length}的文章：

主题：{topic}

要求：
1. 观点独特，有深度
2. 结构清晰，逻辑通顺
3. 例子具体，有说服力
4. 语言流畅，易读

文章：""",

    "文案创作": """请为{product}创作一段营销文案：

产品/服务：{product}
目标用户：{audience}
卖点：{selling_points}
风格：{style}

文案：""",

    "视频脚本": """请为以下主题创作视频脚本：

主题：{topic}
时长：{duration}
风格：{style}

脚本："""
}
```

---

## 评估优化

### 1. 评估维度

```python
# Prompt 评估维度
PromptEvaluation = {
    "清晰度": "指令是否明确无歧义",
    "完整性": "是否包含所有必要信息",
    "准确性": "描述是否符合模型能力",
    "可操作性": "模型是否能按要求执行",
    "输出质量": "模型输出是否符合预期"
}
```

### 2. 迭代优化

```python
# 迭代优化流程
class PromptIteration:
    """Prompt 迭代优化"""
    
    def __init__(self):
        self.history = []
    
    def optimize(self, initial_prompt: str, test_cases: List[str]) -> str:
        """迭代优化"""
        current_prompt = initial_prompt
        
        for i in range(3):  # 最多3轮
            # 测试
            results = self.test_prompt(current_prompt, test_cases)
            
            # 评估
            score = self.evaluate(results)
            
            # 改进
            if score < 0.8:
                current_prompt = self.improve(current_prompt, results)
            else:
                break
        
        return current_prompt
    
    def test_prompt(self, prompt, test_cases):
        """测试 prompt"""
        results = []
        for case in test_cases:
            result = llm.generate(prompt.format(input=case))
            results.append(result)
        return results
    
    def evaluate(self, results):
        """评估结果"""
        # 计算评分
        return 0.85  # 示例
    
    def improve(self, prompt, results):
        """改进 prompt"""
        return prompt  # 简化
```

---

## 总结

Prompt Engineering 核心要点：

1. **清晰明确**：具体任务、格式、长度、受众
2. **结构化**：使用分隔符、列表、编号
3. **角色代入**：设定专业角色和背景
4. **技术技巧**：Few-shot、CoT、ReAct
5. **框架**：RACE、BROKE、CRISPE
6. **迭代**：测试→评估→优化

**最佳实践**：
- 先写初稿 → 测试效果 → 根据结果优化
- 记录有效的 prompt，形成团队资产

---

*📅 更新时间：2026-04-01 | 版本：1.0*