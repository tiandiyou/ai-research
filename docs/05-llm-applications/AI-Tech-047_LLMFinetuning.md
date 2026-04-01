# LLM 微调实战完全指南

> 2026-04-01 | 技术文档 | 预计阅读时间：35分钟

---

## 目录

1. [LLM 微调概述](#llm-微调概述)
2. [微调类型与选择](#微调类型与选择)
3. [数据准备](#数据准备)
4. [环境配置](#环境配置)
5. [LoRA 微调实战](#lora-微调实战)
6. [QLoRA 微调](#qlora-微调)
7. [全参数微调](#全参数微调)
8. [评估与验证](#评估与验证)
9. [部署与推理](#部署与推理)
10. [常见问题](#常见问题)

---

## LLM 微调概述

### 什么是 LLM 微调

LLM 微调（Fine-tuning）是将预训练大模型进一步训练，使其适配特定任务或领域的技术。与 prompt engineering 相比，微调可以：

- **任务适配**：学习特定任务模式（如代码生成、对话）
- **领域增强**：掌握特定领域知识（医疗、法律）
- **风格控制**：调整输出风格（简洁、幽默、专业）
- **效率提升**：减少推理时的上下文长度

```python
# 微调 vs Prompt 对比
Comparison = {
    "prompt": {
        "优点": ["无需训练", "快速迭代", "可解释性强"],
        "缺点": ["上下文有限", "泛化受限", "token 浪费"],
        "适用": ["通用任务", "快速原型", "少量数据"]
    },
    "微调": {
        "优点": ["任务适配强", "减少 prompt", "可本地部署"],
        "缺点": ["需要训练数据", "训练成本", "可能过拟合"],
        "适用": ["特定任务", "大批量推理", "数据量大"]
    }
}
```

### 微调 vs 预训练

```
预训练阶段：学习通用语言能力
────────────────────────────────────────────
大规模无标注数据 → Language Model → 通用能力

微调阶段：学习任务特定能力
────────────────────────────────────────────
标注数据 → Fine-tune → 任务能力
```

---

## 微调类型与选择

### 1. 全参数微调（Full Fine-tuning）

```python
# 全参数微调特点
FullFineTuning = {
    "更新": "所有模型参数",
    "训练量": "与预训练相当",
    "硬件": "需要多卡 A100/H100",
    "效果": "最好，但成本最高",
    "适用": "大规模场景，有充足资源"
}
```

### 2. LoRA 微调

```python
# LoRA 原理
LoRA = {
    "核心思想": "在注意力层添加低秩矩阵",
    "参数": "仅训练新增的少量参数",
    "原理": "W_new = W + BA",
    "优点": "训练快、显存需求低、易于切换",
    "缺点": "效果略逊于全参数"
}

# LoRA 配置
lora_config = {
    "r": 8,              # 秩
    "alpha": 16,         # 缩放因子
    "dropout": 0.05,    # dropout
    "target_modules": ["q_proj", "v_proj", "k_proj", "o_proj"]
}
```

### 3. QLoRA 微调

```python
# QLoRA = 量化 + LoRA
QLORA = {
    "核心思想": "4bit 量化模型 + LoRA 微调",
    "量化": "NF4 量化到 4bit",
    "技术": "双量化 + 分页优化",
    "显存": "单卡 3090/4090 即可训练 70B 模型",
    "效果": "接近全参数微调"
}
```

### 4. RLHF / DPO

```python
# 人类反馈强化学习
RLHF = {
    "步骤": [
        "1. SFT: 有监督微调（初始模型）",
        "2. Reward: 训练奖励模型",
        "3. PPO: 强化学习优化"
    ],
    "适用": ["对齐人类偏好", "生成质量提升"],
    "成本": "非常高"
}

# DPO (Direct Preference Optimization)
DPO = {
    "核心": "直接用偏好数据优化",
    "优点": "无需 reward 模型",
    "效果": "与 RLHF 相当，训练更简单"
}
```

### 选择指南

| 场景 | 推荐方案 | 显存要求 |
|------|----------|----------|
| 学习/实验 | LoRA 7B | 12GB |
| 小团队产品 | QLoRA 13B | 24GB |
| 生产部署 | QLoRA 70B | 1 卡 80GB |
| 追求最高质量 | 全参数 7B | 8 卡 A100 |
| 对齐人类偏好 | DPO | 参考 RLHF |

---

## 数据准备

### 1. 数据格式

```json
// 聊天格式
[
    {
        "messages": [
            {"role": "system", "content": "你是一个专业助手"},
            {"role": "user", "content": "什么是量子计算？"},
            {"role": "assistant", "content": "量子计算是..."}
        ]
    }
]

// 指令格式
[
    {
        "instruction": "翻译以下句子",
        "input": "Hello world",
        "output": "你好世界"
    }
]

// QA 格式
[
    {
        "question": "什么是AI？",
        "answer": "人工智能是..."
    }
]
```

### 2. 数据质量

```python
# 数据质量检查清单
DataQualityChecklist = {
    "数量": {
        "最低": "100-500 条（视任务复杂度）",
        "推荐": "1000-10000 条",
        "足够": "10000+ 条"
    },
    "多样性": {
        "问题类型": "覆盖各种问法",
        "答案长度": "包含长短答案",
        "边界情况": "包含异常/边界输入"
    },
    "质量": {
        "准确性": "答案正确无误导",
        "一致性": "格式/风格统一",
        "完整性": "答案完整不遗漏"
    }
}
```

### 3. 数据增强

```python
# 数据增强策略
DataAugmentation = {
    "回译": {
        "方法": "翻译成其他语言再翻译回来",
        "工具": ["Google Translate", "DeepL"],
        "效果": "增加多样性"
    },
    "改写": {
        "方法": "用 LLM 改写问题和答案",
        "prompt": "用不同的表达方式改写以下问题..."
    },
    "合成": {
        "方法": "用 LLM 生成相似数据",
        "适用": "数据不足时"
    },
    "过滤": {
        "方法": "去除低质量数据",
        "标准": ["长度异常", "重复", "格式错误"]
    }
}
```

### 4. 数据集划分

```python
# 训练/验证/测试划分
DatasetSplit = {
    "训练集": "80% - 用于模型学习",
    "验证集": "10% - 用于超参调优",
    "测试集": "10% - 用于最终评估",
    
    "注意": [
        "测试集不能用于训练",
        "注意数据泄露",
        "保持分布一致"
    ]
}
```

---

## 环境配置

### 1. 硬件要求

```yaml
# 推荐的 GPU 配置
GPU_Requirements:
  LoRA-7B:
    GPU: "RTX 3090/4090 或 A5000"
    VRAM: "24GB"
    Training: "约 14GB"
    
  LoRA-13B:
    GPU: "A100 40GB"
    VRAM: "40GB"
    Training: "约 30GB"
    
  QLoRA-70B:
    GPU: "A100 80GB x1-2"
    VRAM: "80GB"
    Training: "约 40GB"
```

### 2. 软件环境

```bash
# 创建 Python 环境
conda create -n ft_env python=3.11
conda activate ft_env

# 安装核心依赖
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# 安装微调框架
pip install transformers datasets accelerate
pip install peft bitsandbytes
pip install sentencepiece protobuf

# 可选：GUI 工具
pip install tensorboard wandb
```

### 3. 分布式训练（多卡）

```python
# DeepSpeed 配置 (ds_config.json)
{
    "train_batch_size": "auto",
    "train_micro_batch_size_per_gpu": "auto",
    "gradient_accumulation_steps": "auto",
    "gradient_clipping": 1.0,
    "zero_optimization": {
        "stage": 3,
        "offload_optimizer": {
            "device": "cpu"
        },
        "offload_param": {
            "device": "cpu"
        }
    },
    "fp16": {
        "enabled": "auto"
    },
    "zero_allow_untested_optimizer": true
}
```

---

## LoRA 微调实战

### 1. 基础代码

```python
# lora_finetune.py
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    DataCollatorForLanguageModeling
)
from peft import LoraConfig, get_peft_model, TaskType
from datasets import load_dataset

# 1. 加载模型和 tokenizer
model_name = "meta-llama/Llama-2-7b-hf"
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto"
)

# 2. 配置 LoRA
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=8,                      # 秩
    lora_alpha=16,            # 缩放因子
    lora_dropout=0.05,
    target_modules=[
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ],
    bias="none",
    inference_mode=False
)

# 3. 应用 LoRA
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# 输出: trainable params: 8,388,608 || all params: 6,742,609,280 || trainable%: 0.12

# 4. 加载数据
dataset = load_dataset("json", data_files="train.json")

def tokenize_function(examples):
    return tokenizer(
        examples["text"],
        truncation=True,
        max_length=2048
    )

tokenized_dataset = dataset.map(
    tokenize_function,
    batched=True,
    remove_columns=["text"]
)

# 5. 训练配置
training_args = TrainingArguments(
    output_dir="./lora_output",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    fp16=True,
    save_strategy="epoch",
    save_total_limit=3,
    logging_steps=10,
    warmup_ratio=0.1,
    remove_unused_columns=False
)

# 6. 创建 Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
    data_collator=DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=False
    )
)

# 7. 开始训练
trainer.train()

# 8. 保存模型
model.save_pretrained("./lora_finetuned")
tokenizer.save_pretrained("./lora_finetuned")
```

### 2. 数据处理

```python
# data_preprocessing.py
from datasets import Dataset
import json

def prepare_chat_data(raw_data):
    """将对话数据转换为训练格式"""
    processed = []
    
    for item in raw_data:
        # 构建聊天格式
        messages = [{"role": "system", "content": item["system"]}]
        
        for turn in item["conversation"]:
            messages.append({
                "role": turn["role"],
                "content": turn["content"]
            })
        
        # 转换为训练文本
        text = tokenizer.apply_chat_template(
            messages,
            tokenize=False
        )
        
        processed.append({"text": text})
    
    return processed

def load_and_split_data(file_path, train_ratio=0.9):
    """加载并划分数据"""
    with open(file_path) as f:
        data = json.load(f)
    
    # 随机打乱
    import random
    random.shuffle(data)
    
    # 划分
    split_idx = int(len(data) * train_ratio)
    train_data = data[:split_idx]
    eval_data = data[split_idx:]
    
    # 保存
    with open("train.json", "w") as f:
        json.dump(train_data, f, ensure_ascii=False)
    with open("eval.json", "w") as f:
        json.dump(eval_data, f, ensure_ascii=False)
    
    return len(train_data), len(eval_data)
```

### 3. 训练监控

```python
# 监控训练过程
from torch.utils.tensorboard import SummaryWriter
from transformers import TrainerCallback

class LossMonitorCallback(TrainerCallback):
    def on_log(self, args, state, logs, **kwargs):
        print(f"Step {state.global_step}: loss = {logs.get('loss', 0):.4f}")

# 或使用 WandB
import wandb
wandb.init(project="llm-finetune")

training_args = TrainingArguments(
    report_to=["tensorboard", "wandb"],
    logging_dir="./runs"
)
```

---

## QLoRA 微调

### 1. 配置

```python
# qlora_finetune.py
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model, TaskType
from qlora import setup_qlora

# 1. 4bit 量化配置
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True
)

# 2. 加载量化模型
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-70b-hf",
    quantization_config=bnb_config,
    device_map="auto"
)

# 3. LoRA 配置（相同）
lora_config = LoraConfig(
    r=64,
    lora_alpha=16,
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"],
    task_type=TaskType.CAUSAL_LM
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
```

### 2. 高级配置

```python
# 完整的 QLoRA 配置
qlora_config = {
    # 模型
    "model_name": "meta-llama/Llama-2-70b-hf",
    "load_in_4bit": True,
    "double_quant": True,
    "quant_type": "nf4",
    
    # LoRA
    "lora_r": 64,
    "lora_alpha": 16,
    "lora_dropout": 0.1,
    "target_modules": ["q_proj", "k_proj", "v_proj", "o_proj"],
    
    # 训练
    "batch_size": 1,
    "gradient_accumulation": 8,
    "learning_rate": 2e-4,
    "epochs": 3,
    "max_seq_length": 2048,
    
    # 优化
    "optimizer": "paged_adamw_32bit",
    "scheduler": "cosine",
    "warmup_ratio": 0.1,
    
    # 混合精度
    "fp16": True,
    "bf16": False
}
```

---

## 全参数微调

### 1. 框架对比

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| **DeepSpeed ZeRO** | 分布式显存优化 | 大模型多卡 |
| **FSDP** | 完全分片训练 | PyTorch 生态 |
| **Megatron-LM** | 张量并行 | 超大规模 |

### 2. DeepSpeed ZeRO-3

```python
# deepspeed_train.py
import deepspeed

# DeepSpeed 配置
ds_config = {
    "train_batch_size": 16,
    "train_micro_batch_size_per_gpu": 1,
    "gradient_accumulation_steps": 16,
    "gradient_clipping": 1.0,
    "zero_optimization": {
        "stage": 3,
        "offload_optimizer": {"device": "cpu"},
        "allgather_partitions": True,
        "allgather_bucket_size": 2e8,
        "overlap_comm": True,
        "reduce_scatter": True,
        "reduce_bucket_size": 2e8,
        "contiguous_gradients": True
    },
    "fp16": {"enabled": True},
    "wall_clock_breakdown": False
}

# 初始化
model, optimizer, _, _ = deepspeed.initialize(
    model=model,
    optimizer=optimizer,
    config=ds_config
)

# 训练循环
for batch in dataloader:
    loss = model(batch)
    model.backward(loss)
    model.step()
```

---

## 评估与验证

### 1. 自动评估指标

```python
# 常用评估指标
EvaluationMetrics = {
    "困惑度": {
        "指标": "Perplexity (PPL)",
        "计算": "exp(-1/N * Σ log P(x_i))",
        "意义": "越低越好，反映模型对文本的预测能力"
    },
    "准确率": {
        "指标": "Accuracy",
        "适用": "分类任务",
        "计算": "正确数 / 总数"
    },
    "BLEU": {
        "指标": "BLEU Score",
        "适用": "生成任务",
        "范围": "0-100",
        "注意": "对短文本可能不准确"
    },
    "ROUGE": {
        "指标": "ROUGE-L",
        "适用": "摘要任务",
        "关注": "召回率"
    }
}
```

### 2. 人工评估

```python
# 人工评估模板
HumanEvaluationTemplate = {
    "维度": [
        {"name": "相关性", "score": "1-5", "desc": "回答是否切题"},
        {"name": "准确性", "score": "1-5", "desc": "信息是否正确"},
        {"name": "流畅性", "score": "1-5", "desc": "语言是否通顺"},
        {"name": "完整性", "score": "1-5", "desc": "是否完整回答"}
    ],
    "示例": [
        "请对以下 100 条回答进行评分",
        "记录评分分布和典型问题"
    ]
}
```

### 3. 基准测试

```python
# 使用 lm-evaluation-harness
from lm_eval import evaluator

results = evaluator.evaluate(
    model="hf",
    model_args="pretrained=/path/to/model",
    tasks=["mmlu", "humaneval", "mbpp"],
    num_fewshot=5
)

print(results)
```

---

## 部署与推理

### 1. LoRA 权重合并

```python
# 合并 LoRA 到基础模型
from peft import PeftModel
from transformers import AutoModelForCausalLM

base_model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    torch_dtype=torch.float16
)

peft_model = PeftModel.from_pretrained(
    base_model,
    "./lora_finetuned"
)

# 合并权重
merged_model = peft_model.merge_and_unload()

# 保存
merged_model.save_pretrained("./merged_model")
tokenizer.save_pretrained("./merged_model")
```

### 2. 量化推理

```python
# 4bit 量化推理
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

tokenizer = AutoTokenizer.from_pretrained("./merged_model")
model = AutoModelForCausalLM.from_pretrained(
    "./merged_model",
    load_in_4bit=True,
    device_map="auto"
)

# 推理
def generate(prompt, max_length=512):
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(
        **inputs,
        max_new_tokens=max_length,
        temperature=0.7
    )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

print(generate("什么是机器学习？"))
```

### 3. API 服务

```python
# 使用 vLLM 部署
# pip install vLLM

from vllm import LLM, SamplingParams

llm = LLM(
    model="./merged_model",
    tensor_parallel_size=2,  # 使用 2 张卡
    max_model_len=4096
)

sampling_params = SamplingParams(
    temperature=0.7,
    max_tokens=512
)

# 批量推理
prompts = ["问题1", "问题2", "问题3"]
outputs = llm.generate(prompts, sampling_params)

for output in outputs:
    print(output.outputs[0].text)
```

---

## 常见问题

### Q1: 显存不足？

```python
# 解决方案
Solutions = {
    "减少 batch_size": "从 8 减到 1",
    "增加 gradient_accumulation": "保持等效 batch",
    "使用 LoRA": "显存需求降 70%",
    "使用 QLoRA": "70B 只需 40GB",
    "启用 DeepSpeed ZeRO": "分片存储"
}
```

### Q2: 过拟合？

```python
# 解决方案
Solutions = {
    "增加数据量": "更多样化的训练数据",
    "减少 epochs": "从 3 减到 1-2",
    "增加 dropout": "LoRA dropout 0.1+",
    "降低 learning_rate": "从 2e-4 降到 5e-5",
    "增加 warmup": "避免过早收敛"
}
```

### Q3: 训练崩溃？

```python
# 解决方案
Solutions = {
    "检查数据格式": "确保 JSON/JSONL 正确",
    "检查 tokenizer": "确保 pad_token 设置",
    "降低学习率": "从 2e-4 试试 1e-4",
    "启用 gradient_checkpointing": "减少显存",
    "检查 NaN": "监控 loss 是否有 NaN"
}
```

---

## 总结

LLM 微调关键要点：

1. **选择方案**：LoRA（通用）→ QLoRA（大模型）→ 全参数（最高质量）
2. **数据质量**：数量足够、多样性、清洗干净
3. **训练配置**：learning_rate、epochs、warmup
4. **评估验证**：自动指标 + 人工评估
5. **部署推理**：合并权重、量化、API 服务

**推荐配置（7B 模型）**：
```python
LoRA:
  r=8, alpha=16, dropout=0.05
  lr=2e-4, epochs=3, batch=4
```

---

*📅 更新时间：2026-04-01 | 版本：1.0*