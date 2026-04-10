#!/usr/bin/env node
/**
 * 视频质量检查器
 * 基于5维度模型检查视频内容质量
 */

import fs from 'fs';

/**
 * 质量检查器类
 */
class VideoQualityChecker {
  constructor() {
    // 5维度权重
    this.weights = {
      hook: 0.25,      // 钩子前3秒
      value: 0.30,     // 干货价值
      golden: 0.15,    // 金句密度
      emotion: 0.15,   // 情感共鸣
      cta: 0.15        // 行动引导
    };
    
    // 通过阈值
    this.threshold = 75;
  }
  
  /**
   * 检查钩子质量
   */
  checkHook(hook) {
    const score = {
      // 痛点/悬念/数字/反常识
      hasPainPoint: /焦虑|担心|困惑|迷茫|难|痛/.test(hook),
      hasSuspense: /居然|竟然|没想到|竟然|瞬间/.test(hook),
      hasNumber: /\d+/.test(hook),
      hasCounterIntuitive: /不是|别再|千万别|不要/.test(hook),
    };
    
    let s = 0;
    if (score.hasPainPoint) s += 25;
    if (score.hasSuspense) s += 25;
    if (score.hasNumber) s += 25;
    if (score.hasCounterIntuitive) s += 25;
    
    return Math.min(s, 100);
  }
  
  /**
   * 检查干货价值
   */
  checkValue(sections) {
    if (!sections || sections.length === 0) return 0;
    
    let totalPoints = 0;
    for (const section of sections) {
      if (section.points) {
        totalPoints += section.points.length;
      }
    }
    
    // 目标：至少3个实用点
    const score = Math.min((totalPoints / 3) * 100, 100);
    return score;
  }
  
  /**
   * 检查金句密度
   */
  checkGoldenSentences(text) {
    // 金句特征
    const goldenPatterns = [
      /金句|扎心|真相|本质|核心/,
      /记住|一定要|千万别|不要/,
      /这就是|才是|关键在于/,
      /99%|100%|一个亿|破纪录/,
    ];
    
    let count = 0;
    for (const pattern of goldenPatterns) {
      if (pattern.test(text)) count++;
    }
    
    // 目标：每分钟至少1句（视频约5分钟 = 5句）
    return Math.min((count / 5) * 100, 100);
  }
  
  /**
   * 检查情感共鸣
   */
  checkEmotion(text) {
    const emotionWords = [
      // 正面
      /兴奋|激动|开心|爽|赚大了/,
      // 负面  
      /焦虑|担心|害怕|恐惧|无语|吐血/,
      // 疑问
      /为什么|怎么办|到底|是不是/,
    ];
    
    let count = 0;
    for (const pattern of emotionWords) {
      if (pattern.test(text)) count++;
    }
    
    return Math.min(count * 33, 100);
  }
  
  /**
   * 检查CTA（行动引导）
   */
  checkCTA(cta) {
    const required = ['点赞', '收藏', '关注', '评论', '转发'];
    
    let count = 0;
    for (const word of required) {
      if (cta.includes(word)) count++;
    }
    
    // 需要至少2个引导词
    return count >= 2 ? 100 : count * 50;
  }
  
  /**
   * 综合评分
   */
  check(prd) {
    const hook = this.checkHook(prd.hook?.text || '');
    const value = this.checkValue(prd.sections);
    const golden = this.checkGoldenSentences(JSON.stringify(prd));
    const emotion = this.checkEmotion(JSON.stringify(prd));
    const cta = this.checkCTA(prd.cta?.text || '');
    
    const scores = { hook, value, golden, emotion, cta };
    
    // 计算加权总分
    let total = 0;
    for (const [key, weight] of Object.entries(this.weights)) {
      total += scores[key] * weight;
    }
    
    return {
      scores,
      total: Math.round(total),
      passed: total >= this.threshold,
      details: {
        hook: `前3秒: ${scores.hook >= 80 ? '✅' : '❌'} (${scores.hook})`,
        value: `干货: ${scores.value >= 70 ? '✅' : '❌'} (${scores.value})`,
        golden: `金句: ${scores.golden >= 60 ? '✅' : '❌'} (${scores.golden})`,
        emotion: `共鸣: ${scores.emotion >= 50 ? '✅' : '❌'} (${scores.emotion})`,
        cta: `引导: ${scores.cta >= 50 ? '✅' : '❌'} (${scores.cta})`,
      }
    };
  }
}

/**
 * 主函数
 */
function main() {
  const prdDir = './prd';
  
  if (!fs.existsSync(prdDir)) {
    console.error('❌ PRD目录不存在');
    process.exit(1);
  }
  
  const files = fs.readdirSync(prdDir)
    .filter(f => f.endsWith('.json'))
    .filter(f => !f.startsWith('prd-'));
  
  console.log('🎬 视频质量检查\n');
  console.log('='.repeat(50));
  
  const checker = new VideoQualityChecker();
  let passCount = 0;
  let failCount = 0;
  
  for (const file of files) {
    const prdPath = `${prdDir}/${file}`;
    const prd = JSON.parse(fs.readFileSync(prdPath, 'utf-8'));
    
    const result = checker.check(prd);
    
    console.log(`\n📄 ${file}`);
    console.log(`   总分: ${result.total} ${result.passed ? '✅' : '❌'}`);
    for (const [key, detail] of Object.entries(result.details)) {
      console.log(`   ${detail}`);
    }
    
    if (result.passed) {
      passCount++;
    } else {
      failCount++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 结果: 通过 ${passCount}, 待优化 ${failCount}`);
  
  if (failCount > 0) {
    console.log('\n⚠️  建议：调整内容后再渲染');
    process.exit(1);
  }
}

main();
