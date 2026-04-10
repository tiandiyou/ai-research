#!/usr/bin/env node
/**
 * Ralph完整流程 - 文案检查 + 配图生成 + 视频制作
 * 目标：点赞评论收藏10000+
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const http = require('http');

// ============== 配置 ==============
const CONFIG = {
  fps: 2,
  minDuration: 180,
  maxSyncDiff: 0.5,
  minFileSize: 3 * 1024 * 1024,
  apiMinInterval: 3,
  apiMaxPerMinute: 15,
  apiKey: "sk-ysycigzzwlfdgkvgnpkwavpimhpozptlofkyehotomdrtufy"
};

// ============== 文案模板库 ==============
const viralTemplates = {
  agent: [
    { text: "2026年AI Agent爆发！90%的人还不知道这个巨大机会！学会的人正在偷偷超过你！", type: "标题", prompt: "explosion, breaking news, dramatic red and orange gradient, bold typography, 8k" },
    { text: "AI Agent是什么？它就像一个超级助手，帮你自动完成工作！不需要你动手，AI自己就能干活！", type: "干货", prompt: "futuristic AI assistant, robot helping human, glowing blue theme, technology concept, 8k" },
    { text: "不会Agent的人，正在被会Agent的人取代！数据显示：会用Agent的人，效率提升10倍以上！", type: "数据", prompt: "efficiency chart, rising graph, green gradient, data visualization, modern tech style, 8k" },
    { text: "某互联网公司引入Agent后，一个人的产出超过原来10个人！这就是AI的力量！", type: "案例", prompt: "success story, achievement celebration, trophy, winner light, inspiring golden, 8k" },
    { text: "现在学Agent，3个月后你就能超过90%的人！推荐学习路线：先学ChatGPT，再学Claude，最后自己开发Agent！", type: "行动", prompt: "roadmap journey, forward arrow, progress path, blue purple gradient, modern adventure, 8k" },
    { text: "记住：AI不会杀死人，但会杀死不会用AI的人！趁现在还来得及赶紧学起来！", type: "金句", prompt: "powerful quote typography, motivational poster, bold red and black, dramatic lighting, 8k" },
    { text: "点赞收藏关注！下期手把手教你用Agent做副业，月入过万！", type: "CTA", prompt: "like subscribe button, notification bell, engagement, social media icons, glowing blue, 8k" }
  ],
  
  mcp: [
    { text: "2026年AI圈最火的技术！MCP协议正在颠覆整个AI行业！不会的人将被淘汰！", type: "标题", prompt: "protocol connection, network nodes, blue cyan glow, technology revolution, 8k" },
    { text: "MCP是什么？它是AI世界的USB-C！一个协议就能连接所有AI工具！", type: "干货", prompt: "universal connector, USB-C style, multiple devices connecting, unified hub, silver blue, 8k" },
    { text: "以前每个工具需要单独集成，现在一个MCP服务器就能搞定一切！效率提升10倍！", type: "数据", prompt: "efficiency improvement, time reduction, speed concept, fast forward, green gradient, 8k" },
    { text: "某硅谷公司用MCP后，开发效率提升50%！这就是标准化的力量！", type: "案例", prompt: "silicon valley office, tech company success, developers working, modern office, 8k" },
    { text: "如何学习MCP？安装只需要一行代码：npm install @anthropic-ai/mcp-server", type: "行动", prompt: "code installation, terminal command, glowing screen, programming, developer workspace, 8k" },
    { text: "未来每台AI都会支持MCP！就像USB统一了硬件连接，MCP将统一AI工具！", type: "金句", prompt: "future technology, vision, forward looking, glowing pathway, purple blue gradient, 8k" },
    { text: "点赞收藏关注！下期教你用MCP搭建自己的AI工作流！", type: "CTA", prompt: "subscribe button, follow icon, notification, social media, blue glow, 8k" }
  ],
  
  coding: [
    { text: "2026年AI正在杀死程序员！不会用AI的程序员正在被淘汰！", type: "标题", prompt: "coding destruction, robot replacing programmer, dramatic red, technology conflict, 8k" },
    { text: "AI编程工具爆发！Claude Code、Cursor、Devin...每一个都是革命性的工具！", type: "干货", prompt: "programming tools, code editor, AI coding assistant, futuristic keyboard, blue glow, 8k" },
    { text: "数据说话：简单Web页面开发从4小时缩短到10分钟，提升24倍！Bug修复从2小时缩短到5分钟！", type: "数据", prompt: "performance chart, comparison graph, efficiency improvement, green rising trend, 8k" },
    { text: "真实案例：某公司裁掉50%基础程序员，效率反而提升30%！这就是AI的威力！", type: "案例", prompt: "tech company layoff, efficiency improvement, success story, modern office, 8k" },
    { text: "立即行动！每天学习1小时AI编程，3个月后甩开90%的人！", type: "行动", prompt: "learning roadmap, study path, education progress, blue gradient, 8k" },
    { text: "记住：AI不会杀死程序员，但会杀死不会AI的程序员！", type: "金句", prompt: "powerful quote, bold typography, motivational, dramatic lighting, red and black, 8k" },
    { text: "点赞收藏关注！下期讲如何用AI做副业月入过万！", type: "CTA", prompt: "subscribe, like, follow icons, notification, blue glow social media, 8k" }
  ]
};

// ============== 视频生成器 ==============
class RalphVideoGenerator {
  constructor(options = {}) {
    this.outputPath = options.outputPath || 'out/viral-video.mp4';
    this.fps = options.fps || CONFIG.fps;
  }
  
  async generateSpeech(text, outputPath) {
    execSync(`python3 gen_audio.py "${text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync(`mv temp-audio.mp3 ${outputPath}`, { stdio: 'ignore' });
    return this.getDuration(outputPath);
  }
  
  getDuration(path) {
    return parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${path}`, { encoding: 'utf8' }).trim());
  }
  
  // 核心：按实际时长计算帧数
  calculateFrames(segmentDurations) {
    const totalDuration = segmentDurations.reduce((a, b) => a + b, 0);
    const framePerSeg = segmentDurations.map(d => Math.ceil(d * this.fps));
    return { totalDuration, framePerSeg, totalFrames: framePerSeg.reduce((a,b) => a+b) };
  }
  
  // 渲染帧
  async renderFrames(segments, framePerSeg, templates) {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox']
    });
    
    let frameIdx = 0;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const html = seg.type === 'CTA' 
        ? templates.CTA() 
        : templates[seg.type](seg.text);
      
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1920 });
      await page.setContent(html);
      await new Promise(r => setTimeout(r, 500));
      
      for (let f = 0; f < framePerSeg[i]; f++) {
        await page.screenshot({ path: `frame-${frameIdx}.png`, fullPage: true });
        frameIdx++;
      }
      await page.close();
    }
    await browser.close();
    return frameIdx;
  }
  
  // 合成视频
  composeVideo(segments, audioPath, totalDuration) {
    let inputs = '', filter = '';
    for (let i = 0; i < segments.length; i++) {
      inputs += `-i seg-${i}.mp3 `;
      filter += `[${i}:a]`;
    }
    filter += `concat=n=${segments.length}:v=0:a=1[out]`;
    
    execSync(`ffmpeg -y ${inputs} -filter_complex "${filter}" -map "[out" ${audioPath}`, { stdio: 'ignore' });
    const finalDuration = this.getDuration(audioPath);
    
    execSync(`ffmpeg -y -framerate ${this.fps} -i "frame-%d.png" -i ${audioPath} ` +
      `-c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac ` +
      `-t ${totalDuration} -shortest ${this.outputPath}`, { stdio: 'inherit' });
    
    return this.getDuration(this.outputPath);
  }
  
  // 质量检查
  qualityCheck() {
    const stats = fs.statSync(this.outputPath);
    const duration = this.getDuration(this.outputPath);
    
    const issues = [];
    if (duration < CONFIG.minDuration) issues.push(`时长太短: ${duration.toFixed(1)}秒`);
    if (stats.size < CONFIG.minFileSize) issues.push(`文件太小: ${(stats.size/1024/1024).toFixed(2)}MB`);
    
    return { duration: duration.toFixed(1), size: (stats.size/1024/1024).toFixed(2), issues, pass: issues.length === 0 };
  }
  
  // 主流程
  async generate(topic) {
    const segments = viralTemplates[topic] || viralTemplates.agent;
    
    console.log("╔════════════════════════════════════════╗");
    console.log("║   Ralph完整流程 - 爆款视频生成       ║");
    console.log(`║   主题: ${topic}                        ║`);
    console.log("╚════════════════════════════════════════╝\n");
    
    // 1. 生成语音
    console.log("[1/5] 生成语音...");
    const segmentDurations = [];
    for (let i = 0; i < segments.length; i++) {
      const dur = await this.generateSpeech(segments[i].text, `seg-${i}.mp3`);
      segmentDurations.push(dur);
      console.log(`  段${i+1}: ${dur.toFixed(1)}秒 [${segments[i].type}]`);
    }
    
    // 2. 计算帧数
    console.log("\n[2/5] 计算帧数...");
    const { totalDuration, framePerSeg, totalFrames } = this.calculateFrames(segmentDurations);
    console.log(`  总时长: ${totalDuration.toFixed(1)}秒`);
    console.log(`  总帧数: ${totalFrames}帧`);
    
    // 3. 渲染帧
    console.log("\n[3/5] 渲染帧...");
    const frameCount = await this.renderFrames(segments, framePerSeg, templates);
    console.log(`  完成: ${frameCount}帧`);
    
    // 4. 合成视频
    console.log("\n[4/5] 合成视频...");
    const videoDuration = this.composeVideo(segments, 'combined-audio.mp3', totalDuration);
    
    // 5. 质量检查
    console.log("\n[5/5] 质量检查...");
    const result = this.qualityCheck();
    console.log(`  时长: ${result.duration}秒`);
    console.log(`  大小: ${result.size}MB`);
    console.log(`  状态: ${result.pass ? "✅ 通过" : "❌ " + result.issues.join(", ")}`);
    
    // 清理
    for (let i = 0; i < frameCount; i++) try{fs.unlinkSync(`frame-${i}.png`)}catch{}
    for (let i = 0; i < segments.length; i++) try{fs.unlinkSync(`seg-${i}.mp3`)}catch{}
    try{fs.unlinkSync('combined-audio.mp3')}catch{}
    
    execSync(`mkdir -p out && cp ${this.outputPath} out/ralph-${topic}.mp4`);
    
    console.log(`\n✅ 生成完成: out/ralph-${topic}.mp4`);
    return result;
  }
}

// ============== 模板 ==============
const templates = {
  标题: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#1a1a2e,#16213e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px}
.icon{font-size:150px;margin-bottom:40px}
.title{font-size:52px;font-weight:900;background:linear-gradient(90deg,#FF6B6B,#FFE66D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.4}
</style></head><body><div class="container"><div class="icon">🔥</div><div class="title">${t}</div></div></body></html>`,
  
  干货: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px;max-width:900px}
.tag{position:absolute;top:40px;right:40px;font-size:24px;background:rgba(255,255,255,0.2);padding:12px 24px;border-radius:25px}
.title{font-size:36px;font-weight:bold;line-height:2}
</style></head><body><div class="container"><span class="tag">💡 必看</span><div class="title">${t}</div></div></body></html>`,
  
  数据: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#232526,#414345);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px}
.tag{font-size:32px;background:#FF6B6B;padding:18px 45px;border-radius:35px;display:inline-block;margin-bottom:35px}
.title{font-size:40px;font-weight:bold;line-height:1.9;background:rgba(255,255,255,0.1);padding:45px;border-radius:25px}
</style></head><body><div class="container"><span class="tag">📊 数据</span><div class="title">${t}</div></div></body></html>`,
  
  案例: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f2027,#203a43);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px}
.tag{font-size:32px;background:#4ECDC4;padding:18px 45px;border-radius:35px;display:inline-block;margin-bottom:35px}
.title{font-size:38px;font-weight:bold;line-height:1.8}
</style></head><body><div class="container"><span class="tag">💼 真实案例</span><div class="title">${t}</div></div></body></html>`,
  
  行动: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px}
.title{font-size:38px;font-weight:bold;line-height:1.8}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  金句: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#4facfe,#00f2fe);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:70px;border:6px solid #fff;border-radius:35px;background:rgba(0,0,0,0.2)}
.title{font-size:48px;font-weight:900;line-height:1.7}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  CTA: () => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f0c29,#302b63);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px;border:4px solid #00D4FF;border-radius:35px;background:rgba(0,212,255,0.15)}
.title{font-size:60px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
</style></head><body><div class="container"><div class="title">👍 点赞 📥 收藏 👋 关注</div></div></body></html>`
};

// ============== 主入口 ==============
if (require.main === module) {
  const topic = process.argv[2] || 'agent';
  const generator = new RalphVideoGenerator();
  generator.generate(topic);
}

module.exports = { RalphVideoGenerator, viralTemplates, templates, CONFIG };
