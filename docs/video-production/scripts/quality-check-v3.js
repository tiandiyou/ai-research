#!/usr/bin/env node
import fs from 'fs';

class VideoQualityChecker {
  constructor() {
    this.weights = { hook: 0.25, value: 0.30, golden: 0.15, emotion: 0.15, cta: 0.15 };
    this.threshold = 75;
  }
  
  checkHook(hook) {
    const text = hook?.text || hook || '';
    let s = 0;
    const triggers = [
      /焦虑|担心|困惑|迷茫|难|痛|怕|慌|愁|慌|累|卷|难/,
      /居然|竟然|没想到|绝对|想不到|没想到|别急|小心/,
      /\d+%|\d+万|\d+亿|\d+倍|\d+年|\d+月/,
      /不是|别再|千万别|不要|真相|竟然|彻底|竟然|爆火/,
      /90%|80%|70%|99%|100%/,
      /程序员|开发者|老板|员工|新手|小白/,
    ];
    triggers.forEach(p => { if (p.test(text)) s += 17; });
    return Math.min(s, 100);
  }
  
  checkValue(sections) {
    if (!sections?.length) return 0;
    let totalPoints = sections.reduce((sum, s) => sum + (s.points?.length || 0), 0);
    return Math.min((totalPoints / 3) * 100, 100);
  }
  
  checkGoldenSentences(text) {
    const goldenPatterns = [
      /记住|一定要|千万别|不要/,
      /这就是|才是|关键在于|本质/,
      /月入|万|倍|超过|超过|翻倍/,
      /不是|别|千万/,
    ];
    let count = goldenPatterns.filter(p => p.test(text)).length;
    return Math.min((count / 3) * 100, 100);
  }
  
  checkEmotion(text) {
    const emotionWords = [
      /兴奋|激动|开心|爽|赚大了|爆火|爆发|疯狂|炸裂/,
      /焦虑|担心|害怕|恐惧|无语|吐血|震惊|傻眼|崩溃/,
      /为什么|怎么办|到底|是不是|究竟/,
    ];
    let count = emotionWords.filter(p => p.test(text)).length;
    return Math.min(count * 33, 100);
  }
  
  checkCTA(cta) {
    const text = typeof cta === 'string' ? cta : (cta?.text || '');
    const required = ['点赞', '收藏', '关注', '评论', '转发'];
    let count = required.filter(w => text.includes(w)).length;
    return count >= 2 ? 100 : count * 50;
  }
  
  check(prd) {
    const hook = this.checkHook(prd.hook);
    const value = this.checkValue(prd.sections);
    const golden = this.checkGoldenSentences(JSON.stringify(prd));
    const emotion = this.checkEmotion(JSON.stringify(prd));
    const cta = this.checkCTA(prd.cta?.text || '');
    const scores = { hook, value, golden, emotion, cta };
    let total = Object.entries(this.weights).reduce((sum, [k, w]) => sum + scores[k] * w, 0);
    return { scores, total: Math.round(total), passed: total >= this.threshold };
  }
}

const prdDir = './prd';
const files = fs.readdirSync(prdDir).filter(f => f.endsWith('.json') && !f.startsWith('prd-'));
console.log('🎬 视频质量检查 V3\n==================================================\n');
const checker = new VideoQualityChecker();
let passCount = 0, failCount = 0;

for (const file of files) {
  const prd = JSON.parse(fs.readFileSync(`${prdDir}/${file}`, 'utf-8'));
  const r = checker.check(prd);
  console.log(`📄 ${file}: ${r.total} ${r.passed ? '✅' : '❌'}`);
  console.log(`   钩子:${r.scores.hook>=80?'✅':'❌'}(${r.scores.hook}) 干货:${r.scores.value>=70?'✅':'❌'}(${r.scores.value}) 金句:${r.scores.golden>=60?'✅':'❌'}(${r.scores.golden})`);
  r.passed ? passCount++ : failCount++;
}
console.log(`\n📊 结果: 通过 ${passCount}, 待优化 ${failCount}`);
process.exit(failCount > 0 ? 1 : 0);
