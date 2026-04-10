#!/usr/bin/env node
/**
 * 爆款文案生成器 + 检查机制
 * 目标：点赞评论收藏10000+
 */

const fs = require('fs');

// ============== 文案检查器 ==============
class ScriptChecker {
  constructor() {
    this.issues = [];
    this.score = 0;
  }
  
  // 检查开头是否有吸引力
  checkIntro(text) {
    const keywords = ['爆火', '爆发', '颠覆', '革命', '震惊', '必看', '2026', '淘汰', '杀死', '机会'];
    const hasKeyword = keywords.some(k => text.includes(k));
    if (!hasKeyword) {
      this.issues.push('❌ 开头缺少吸引眼球的关键词');
      return false;
    }
    
    // 检查是否用了数字
    if (!/\d+/.test(text)) {
      this.issues.push('⚠️ 建议开头加入数字增加可信度');
    }
    
    this.score += 20;
    return true;
  }
  
  // 检查内容是否有干货
  checkContent(text) {
    const keywords = ['是什么', '为什么', '怎么', '如何', '方法', '技巧', '案例', '数据'];
    const hasKeyword = keywords.some(k => text.includes(k));
    if (!hasKeyword) {
      this.issues.push('❌ 内容缺少干货关键词');
      return false;
    }
    
    this.score += 20;
    return true;
  }
  
  // 检查案例/数据
  checkCase(text) {
    const keywords = ['案例', '数据显示', '研究', '调查', '证明', '真实', '某某', '公司'];
    const hasKeyword = keywords.some(k => text.includes(k));
    if (!hasKeyword) {
      this.issues.push('⚠️ 建议加入真实案例或数据');
    }
    
    this.score += 15;
    return true;
  }
  
  // 检查行动号召
  checkCTA(text) {
    const keywords = ['点赞', '收藏', '关注', '下期', '下期更精彩', '一起'];
    const hasKeyword = keywords.some(k => text.includes(k));
    if (!hasKeyword) {
      this.issues.push('❌ 缺少CTA行动号召');
      return false;
    }
    
    this.score += 20;
    return true;
  }
  
  // 检查金句
  checkQuote(text) {
    if (text.length > 50 && (text.includes('记住') || text.includes('关键') || text.includes('核心'))) {
      this.score += 15;
      return true;
    }
    return false;
  }
  
  // 综合检查
  check(segments) {
    this.issues = [];
    this.score = 0;
    
    // 检查开头
    if (segments[0]) {
      this.checkIntro(segments[0].text);
    }
    
    // 检查内容
    segments.forEach((seg, i) => {
      if (seg.type === '干货') this.checkContent(seg.text);
      if (seg.type === '数据' || seg.type === '案例') this.checkCase(seg.text);
      if (seg.type === 'CTA') this.checkCTA(seg.text);
      if (seg.type === '金句') this.checkQuote(seg.text);
    });
    
    // 检查结构完整性
    const types = segments.map(s => s.type);
    if (!types.includes('标题')) this.issues.push('❌ 缺少标题');
    if (!types.includes('CTA')) this.issues.push('❌ 缺少CTA');
    
    // 计算总分
    const typeScores = { '标题': 15, '干货': 10, '数据': 15, '案例': 15, '金句': 10, '行动': 10, 'CTA': 15 };
    segments.forEach(seg => {
      this.score += typeScores[seg.type] || 5;
    });
    
    return {
      pass: this.score >= 60 && this.issues.filter(i => i.startsWith('❌')).length === 0,
      score: this.score,
      issues: this.issues
    };
  }
}

// ============== 爆款文案模板 ==============
const viralTemplates = {
  // AI Agent 爆款文案
  agent: [
    { text: "2026年AI Agent爆发！90%的人还不知道这个巨大机会！学会的人正在偷偷超过你！", type: "标题" },
    { text: "AI Agent是什么？它就像一个超级助手，帮你自动完成工作！不需要你动手，AI自己就能干活！", type: "干货" },
    { text: "不会Agent的人，正在被会Agent的人取代！这就是现实！数据显示：会用Agent的人，效率提升10倍以上！", type: "数据" },
    { text: "某互联网公司引入Agent后，一个人的产出超过原来10个人！这就是AI的力量！", type: "案例" },
    { text: "现在学Agent，3个月后你就能超过90%的人！推荐学习路线：先学ChatGPT，再学Claude，最后自己开发Agent！", type: "行动" },
    { text: "记住：AI不会杀死人，但会杀死不会用AI的人！趁现在还来得及赶紧学起来！", type: "金句" },
    { text: "点赞收藏关注！下期手把手教你用Agent做副业，月入过万！", type: "CTA" }
  ],
  
  // MCP协议 爆款文案
  mcp: [
    { text: "2026年AI圈最火的技术！MCP协议正在颠覆整个AI行业！不会的人将被淘汰！", type: "标题" },
    { text: "MCP是什么？它是AI世界的USB-C！一个协议就能连接所有AI工具！", type: "干货" },
    { text: "以前每个工具需要单独集成，现在一个MCP服务器就能搞定一切！效率提升10倍！", type: "数据" },
    { text: "某硅谷公司用MCP后，开发效率提升50%！这就是标准化的力量！", type: "案例" },
    { text: "如何学习MCP？安装只需要一行代码：npm install @anthropic-ai/mcp-server", type: "行动" },
    { text: "未来每台AI都会支持MCP！就像USB统一了硬件连接，MCP将统一AI工具！", type: "金句" },
    { text: "点赞收藏关注！下期教你用MCP搭建自己的AI工作流！", type: "CTA" }
  ],
  
  // AI编程 爆款文案
  coding: [
    { text: "2026年AI正在杀死程序员！不会用AI的程序员正在被淘汰！", type: "标题" },
    { text: "AI编程工具爆发！Claude Code、Cursor、Devin...每一个都是革命性的工具！", type: "干货" },
    { text: "数据说话：简单Web页面开发从4小时缩短到10分钟，提升24倍！Bug修复从2小时缩短到5分钟！", type: "数据" },
    { text: "真实案例：某公司裁掉50%基础程序员，效率反而提升30%！这就是AI的威力！", type: "案例" },
    { text: "立即行动！每天学习1小时AI编程，3个月后甩开90%的人！", type: "行动" },
    { text: "记住：AI不会杀死程序员，但会杀死不会AI的程序员！", type: "金句" },
    { text: "点赞收藏关注！下期讲如何用AI做副业月入过万！", type: "CTA" }
  ],
  
  // AI副业 爆款文案
  sidehustle: [
    { text: "2026年用AI做副业太香了！有人已经月入10万+，你还不赶紧上车？", type: "标题" },
    { text: "AI副业有哪些？AI写文案、AI做视频、AI生成图片、AI写代码...几乎所有技能都能变现！", type: "干货" },
    { text: "真实案例：有人在闲鱼用AI生成头像，一单59元，每天轻松赚500+！", type: "案例" },
    { text: "数据统计：AI副业平均月收入3000-10000+，时间自由门槛低！", type: "数据" },
    { text: "如何开始？先选一个方向：文案、视频、图片、代码，然后找到一个平台：闲鱼、小红书、B站！", type: "行动" },
    { text: "记住：执行力才是赚钱的关键！看完就去做，才能真正赚到钱！", type: "金句" },
    { text: "点赞收藏关注！下期分享具体操作流程！", type: "CTA" }
  ]
};

// ============== 生成配图提示词 ==============
function generateImagePrompts(segments) {
  const theme = {
    标题: "explosion, breaking news, breaking technology, dramatic red background, bold typography",
    干货: "knowledge, learning, insight, bright bulb, glowing brain, blue and yellow theme",
    数据: "chart, graph, statistics, data visualization, rising trend, green and gold",
    案例: "success story, achievement, celebration, trophy, winner, inspiring",
    行动: "action, movement, arrow forward, progress, roadmap, journey",
    金句: "powerful quote, typography art, motivational poster, bold statement",
    CTA: "subscribe, like button, notification, engagement, social media"
  };
  
  return segments.map(seg => ({
    segment: seg,
    prompt: theme[seg.type] || "technology, modern, blue gradient"
  }));
}

// ============== 主函数 ==============
function main(topic) {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   爆款文案生成器 + 检查              ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  // 获取文案
  const segments = viralTemplates[topic] || viralTemplates.agent;
  
  // 检查文案
  const checker = new ScriptChecker();
  const result = checker.check(segments);
  
  console.log(`\n📋 主题: ${topic}`);
  console.log(`\n📊 文案评分: ${result.score}/100`);
  console.log(`\n✅ 检查结果: ${result.pass ? "通过" : "需修改"}`);
  
  if (result.issues.length > 0) {
    console.log(`\n📝 问题列表:`);
    result.issues.forEach(issue => console.log(`  ${issue}`));
  }
  
  if (!result.pass) {
    console.log(`\n⚠️ 警告：文案未通过检查，建议修改后再生成视频`);
    process.exit(1);
  }
  
  // 生成配图提示词
  const prompts = generateImagePrompts(segments);
  console.log(`\n🖼️ 配图提示词:`);
  prompts.forEach((p, i) => {
    console.log(`  ${i+1}. [${p.segment.type}] ${p.prompt}`);
  });
  
  console.log(`\n✅ 文案检查通过，可以生成视频！`);
  
  return { segments, prompts, result };
}

// 运行
const topic = process.argv[2] || 'agent';
main(topic);
