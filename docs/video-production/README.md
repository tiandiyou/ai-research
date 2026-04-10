# AI视频生产框架 - 完整技术方案

> 版本: v1.0  
> 目标: 点赞评论收藏 > 10000  
> 平台: 抖音/B站/视频号

---

## 一、质量标准体系

### 1.1 爆款视频核心要素

| 维度 | 权重 | 检查点 |
|------|------|--------|
| 钩子前3秒 | 25% | 痛点/悬念/数字/反常识 |
| 干货价值 | 30% | 至少3个实用点 |
| 金句密度 | 15% | 每分钟至少1句 |
| 情感共鸣 | 15% | 引发情绪波动 |
| 行动引导 | 15% | 明确点赞/评论/关注 |

### 1.2 通过标准

```yaml
quality_thresholds:
  overall: >= 75
  hook_score: >= 80
  value_score: >= 70
  golden_sentence: >= 3
  cta_clear: true
  duration: 3-5分钟
  no_prohibited: true
```

### 1.3 平台优化

| 平台 | 最佳时长 | 封面要求 | 标题特点 |
|------|----------|----------|----------|
| 抖音 | 15-30秒 | 文字大+高对比 | 疑问句 |
| B站 | 5-10分钟 | 封面+PLOG | 盘点式 |
| 视频号 | 30-60秒 | 简约+品牌 | 通俗易懂 |

---

## 二、框架架构

### 2.1 核心模块

```
┌─────────────────────────────────────────────────────────┐
│                   视频生产流水线                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐            │
│  │ 内容策划  │ → │ 脚本生成  │ → │ 质量检查 │            │
│  └──────────┘   └──────────┘   └──────────┘            │
│       ↓              ↓              ↓                   │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐            │
│  │ 视频渲染  │ → │ 字幕合成  │ → │ 平台分发 │            │
│  └──────────┘   └──────────┘   └──────────┘            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Ralph驱动流程

```
1. PRD规格定义 → 2. 迭代生成 → 3. 质量检查 → 4. 反馈优化 → 5. 渲染输出
```

---

## 三、视频模板设计

### 3.1 通用模板

| 模板ID | 类型 | 适用场景 |
|--------|------|----------|
| T-001 | 干货讲解 | AI技术科普 |
| T-002 | 案例分析 | 副业/赚钱 |
| T-003 | 盘点汇总 | 年度趋势 |
| T-004 | 争议话题 | 引发讨论 |
| T-005 | 教程步骤 | 技能教学 |

### 3.2 视觉风格

```css
/* 科技赛博风 */
--primary: #00D4FF;
--background: #0A0A1A;
--accent: #FF6B6B;
--text: #FFFFFF;

/* 动画效果 */
- 粒子背景
- 故障风转场
- 渐变文字
- 弹跳动画
```

---

## 四、生产脚本

### 4.1 批量渲染

```bash
#!/bin/bash
# scripts/batch-render.sh

for prd in prd/*.json; do
  echo "Rendering $prd..."
  npx remotion render index.ts AiTutorial "out/$(basename $prd .json).mp4"
done
```

### 4.2 质量检查

```javascript
// scripts/quality-check.js

const checkVideo = (content) => {
  const scores = {
    hook: checkHook(content.hook),
    value: checkValue(content.sections),
    golden: countGoldenSentences(content),
    cta: checkCTA(content.cta),
  };
  
  const total = calculateWeightedScore(scores);
  return { scores, total, passed: total >= 75 };
};
```

---

## 五、交付物清单

| 文件 | 说明 |
|------|------|
| `src/AiTutorial.tsx` | 主视频组件 |
| `src/components/` | 通用组件库 |
| `prd/*.json` | 各集视频PRD |
| `scripts/batch-render.sh` | 批量渲染 |
| `scripts/quality-check.js` | 质量检查 |
| `out/` | 渲染输出目录 |

---

## 六、后续优化

- [ ] 语音合成集成（TTS）
- [ ] 多平台自动分发
- [ ] 数据分析对接
- [ ] A/B测试封面
