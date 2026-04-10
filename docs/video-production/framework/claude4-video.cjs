#!/usr/bin/env node
/**
 * 爆款视频生成器 v7 - 专业文档风格
 * 基于Claude 4文档
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

const CONFIG = { fps: 12 };

// 专业文档风格的视频文案
const segments = [
  { text: "GPT-4最强对手！刚刚，Claude 4发布实测，我惊了！编程能力超越GPT-4，长文理解50万Token，这你敢信？", type: "标题", time: 15 },
  { text: "先说编程能力！实测开发电商网站，GPT-4只能写2000行代码，错误15个。Claude 3.5能写2800行，错误5个。但Claude 4直接写出3500行，错误只有1个！", type: "干货", time: 25 },
  { text: "再说推理能力！解一道数学题，GPT-4用15步还有错，Claude 3.5用12步全对，但Claude 4用8步搞定，还给出3种解法！提升9%！", type: "干货", time: 20 },
  { text: "长文本理解从20万Token提升到50万，提升150%！速度提升30%！指令遵循从92分到99分！这不是升级，这是进化！", type: "数据", time: 15 },
  { text: "编程测试：GPT-4要30分钟，Claude 3.5要15分钟，Claude 4只要8分钟！效率提升近4倍！", type: "案例", time: 15 },
  { text: "Anthropic这波在第五层，GPT-4在第一层。AI助手格局彻底变了！", type: "金句", time: 10 },
  { text: "觉得有帮助，点赞收藏！关注我，下期讲Claude 4怎么免费用！", type: "CTA", time: 10 }
];

// 模板（专业风格）
const templates = {
  标题: (t) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#1a1a2e,#16213e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px}
.icon{font-size:160px;margin-bottom:40px;animation:pulse 1s infinite}
.title{font-size:48px;font-weight:900;background:linear-gradient(90deg,#ff6b6b,#ffd93d);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.3}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
</style></head><body><div class="container"><div class="icon">⚡</div><div class="title">${t}</div></div></body></html>`,
  
  干货: (t) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f0c29,#302b63);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px;max-width:800px}
.tag{position:absolute;top:30px;left:30px;font-size:20px;background:#ff6b6b;padding:10px 20px;border-radius:20px}
.icon{font-size:80px;margin-bottom:25px;display:block}
.title{font-size:32px;font-weight:700;line-height:1.7}
</style></head><body><div class="container"><span class="tag">💡 实测</span><div class="icon">🧠</div><div class="title">${t}</div></div></body></html>`,
  
  数据: (t) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#232526,#414345);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px}
.tag{font-size:24px;background:linear-gradient(90deg,#00ff88,#00d4ff);padding:15px 35px;border-radius:25px;display:inline-block;margin-bottom:30px}
.title{font-size:36px;font-weight:700;line-height:1.6;background:rgba(255,255,255,0.1);padding:30px;border-radius:15px}
</style></head><body><div class="container"><span class="tag">📊 数据</span><div class="title">${t}</div></div></body></html>`,
  
  案例: (t) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px}
.tag{font-size:24px;background:#4ECDC4;padding:15px 35px;border-radius:25px;display:inline-block;margin-bottom:30px}
.title{font-size:34px;font-weight:700;line-height:1.6}
</style></head><body><div class="container"><span class="tag">💼 测试</span><div class="title">${t}</div></div></body></html>`,
  
  金句: (t) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#667eea,#764ba2);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px;border:5px solid #fff;border-radius:30px;background:rgba(0,0,0,0.3)}
.title{font-size:42px;font-weight:900;line-height:1.5}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  CTA: () => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#f093fb,#f5576c);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px;border:4px solid #fff;border-radius:30px;background:rgba(0,0,0,0.2)}
.title{font-size:48px;font-weight:900;background:linear-gradient(90deg,#fff,#fff);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
</style></head><body><div class="container"><div class="title">👍 点赞 📥 收藏 👋 关注</div></div></body></html>`
};

async function run() {
  const fps = CONFIG.fps;
  
  console.log("╔════════════════════════════════════════╗");
  console.log("║   Claude 4 爆款视频生成            ║");
  console.log("╚════════════════════════════════╝\n");
  
  // 1. 生成语音
  console.log("[1/5] 生成语音...");
  const segmentDurations = [];
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 gen_audio.py "${segments[i].text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync("mv temp-audio.mp3 seg-" + i + ".mp3", { stdio: 'ignore' });
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 seg-${i}.mp3`, { encoding: 'utf8' }).trim());
    segmentDurations.push(dur);
  }
  const totalDuration = segmentDurations.reduce((a,b) => a+b, 0);
  console.log(`总时长: ${totalDuration.toFixed(1)}秒\n`);
  
  // 2. 计算帧数
  console.log("[2/5] 渲染帧...");
  const framePerSeg = segmentDurations.map(d => Math.ceil(d * fps));
  const totalFrames = framePerSeg.reduce((a,b) => a+b);
  
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  let frameIdx = 0;
  
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const html = seg.type === 'CTA' ? templates.CTA() : templates[seg.type](seg.text);
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 200));
    
    for (let f = 0; f < framePerSeg[i]; f++) {
      await page.screenshot({ path: `frame-${frameIdx}.png`, fullPage: true });
      frameIdx++;
    }
    await page.close();
    console.log(`  ${seg.type}: ${framePerSeg[i]}帧`);
  }
  await browser.close();
  console.log(`共${frameIdx}帧\n`);
  
  // 3. 合成视频
  console.log("[3/5] 合成视频...");
  let filterInputs = "", filterDesc = "";
  for (let i = 0; i < segments.length; i++) {
    filterInputs += `-i seg-${i}.mp3 `;
    filterDesc += `[${i}:a]`;
  }
  filterDesc += `concat=n=${segments.length}:v=0:a=1[out]`;
  execSync(`ffmpeg -y ${filterInputs} -filter_complex "${filterDesc}" -map "[out" combined-audio.mp3`, { stdio: 'ignore' });
  
  execSync(`ffmpeg -y -framerate ${fps} -i "frame-%d.png" -i combined-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -t ${totalDuration} -shortest claude4-video.mp4`, { stdio: 'inherit' });
  
  // 4. 验证
  const videoDuration = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 claude4-video.mp4`, { encoding: 'utf8' }).trim());
  const stats = fs.statSync("claude4-video.mp4");
  
  console.log("\n[4/5] 完成");
  console.log(`  时长: ${videoDuration.toFixed(1)}秒`);
  console.log(`  大小: ${(stats.size/1024/1024).toFixed(2)}MB`);
  
  // 清理
  for (let i = 0; i < frameIdx; i++) try{fs.unlinkSync(`frame-${i}.png`)}catch{}
  for (let i = 0; i < segments.length; i++) try{fs.unlinkSync(`seg-${i}.mp3`)}catch{}
  try{fs.unlinkSync('combined-audio.mp3')}catch{}
  
  execSync("mkdir -p out && cp claude4-video.mp4 out/claude4-viral.mp4");
  console.log("\n✅ 完成: out/claude4-viral.mp4");
}

run();