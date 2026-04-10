/**
 * 爆款视频生成器 - 5分钟版 v4 (最终修复版)
 * 修复：让帧数匹配语音时长
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

const segments = [
  { text: "2026年AI编程革命！会用AI的程序员，正在取代不会用AI的程序员！", type: "标题" },
  { text: "Claude Code、Cursor、v0、Devin...每一个都是革命性工具！", type: "干货" },
  { text: "GitHub Copilot企业版代码生成率超过50%！", type: "干货" },
  { text: "简单Web页面4小时→10分钟，提升24倍！", type: "数据" },
  { text: "Bug修复2小时→5分钟，全是24倍！", type: "数据" },
  { text: "某公司裁掉50%基础程序员，效率反而提升！", type: "案例" },
  { text: "一个初级程序员+AI，效率超过5个高级程序员！", type: "案例" },
  { text: "Claude Code：端到端开发，自主决策！", type: "工具" },
  { text: "Cursor：智能代码补全，预测你下一步要写什么！", type: "工具" },
  { text: "v0前端神器！Devin第一个AI软件工程师！", type: "工具" },
  { text: "正在消失：CRUD开发、简单页面、基础测试！", type: "干货" },
  { text: "不容易被替代：系统架构师、AI工程师、安全工程师！", type: "干货" },
  { text: "立即行动！每天学习1小时AI编程！", type: "行动" },
  { text: "记住！AI不会杀死程序员，但会杀死不会AI的！", type: "金句" },
  { text: "点赞收藏关注！下期讲如何用AI做副业月入过万！", type: "CTA" }
];

const templates = {
  标题: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#1a1a2e,#16213e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px}
.icon{font-size:120px;margin-bottom:20px}
.title{font-size:56px;font-weight:900;background:linear-gradient(90deg,#FF6B6B,#FFE66D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.4}
</style></head><body><div class="container"><div class="icon">💻</div><div class="title">${t}</div></div></body></html>`,
  
  干货: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px;max-width:900px}
.title{font-size:38px;font-weight:bold;line-height:1.6}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  数据: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#232526,#414345);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px}
.tag{font-size:28px;background:#FF6B6B;padding:15px 40px;border-radius:30px;display:inline-block;margin-bottom:30px}
.title{font-size:42px;font-weight:bold;line-height:1.8;background:rgba(255,255,255,0.1);padding:40px;border-radius:20px}
</style></head><body><div class="container"><span class="tag">📊 数据</span><div class="title">${t}</div></div></body></html>`,
  
  案例: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f2027,#203a43);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px}
.tag{font-size:28px;background:#4ECDC4;padding:15px 40px;border-radius:30px;display:inline-block;margin-bottom:30px}
.title{font-size:38px;font-weight:bold;line-height:1.6}
</style></head><body><div class="container"><span class="tag">📌 案例</span><div class="title">${t}</div></div></body></html>`,
  
  工具: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#2c3e50,#3498db);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px}
.tag{font-size:28px;background:#3498db;padding:15px 40px;border-radius:30px;display:inline-block;margin-bottom:30px}
.title{font-size:38px;font-weight:bold;line-height:1.6}
</style></head><body><div class="container"><span class="tag">🛠️ 工具</span><div class="title">${t}</div></div></body></html>`,
  
  行动: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px}
.title{font-size:40px;font-weight:bold;line-height:1.6}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  金句: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#4facfe,#00f2fe);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px;border:5px solid #fff;border-radius:30px;background:rgba(0,0,0,0.2)}
.title{font-size:44px;font-weight:900;line-height:1.6}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  CTA: () => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f0c29,#302b63);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px;border:3px solid #00D4FF;border-radius:30px;background:rgba(0,212,255,0.1)}
.title{font-size:52px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
</style></head><body><div class="container"><div class="title">👍 点赞 📥 收藏 👋 关注</div></div></body></html>`
};

async function run() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   爆款视频生成器 - 5分钟版 v4          ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  const fps = 2;
  
  // 步骤1: 生成语音
  console.log("[步骤1] 生成语音");
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 gen_audio.py "${segments[i].text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync("mv temp-audio.mp3 seg-" + i + ".mp3", { stdio: 'ignore' });
  }
  
  // 合并语音
  let filterInputs = "", filterDesc = "";
  for (let i = 0; i < segments.length; i++) {
    filterInputs += `-i seg-${i}.mp3 `;
    filterDesc += `[${i}:a]`;
  }
  filterDesc += `concat=n=${segments.length}:v=0:a=1[out]`;
  execSync(`ffmpeg -y ${filterInputs} -filter_complex "${filterDesc}" -map "[out" combined-audio.mp3`, { stdio: 'ignore' });
  const audioDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 combined-audio.mp3`, { encoding: 'utf8' }).trim());
  console.log(`语音: ${audioDur.toFixed(1)}秒 (${(audioDur/60).toFixed(1)}分钟)\n`);
  
  // 计算每段帧数（根据实际语音时长均分）
  const totalFrames = Math.ceil(audioDur * fps);
  const framesPerSeg = Math.ceil(totalFrames / segments.length);
  console.log(`帧数: ${totalFrames}帧, 每段: ${framesPerSeg}帧\n`);
  
  // 步骤2: 生成帧
  console.log("[步骤2] 生成帧图片");
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  
  let frameIdx = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    let html = templates[seg.type](seg.text);
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 300));
    
    for (let f = 0; f < framesPerSeg; f++) {
      await page.screenshot({ path: `frame-${frameIdx}.png`, fullPage: true });
      frameIdx++;
    }
    await page.close();
    console.log(`  ${seg.type}: ${framesPerSeg}帧`);
  }
  await browser.close();
  console.log(`共${frameIdx}帧\n`);
  
  // 步骤3: 合成视频（用语音时长）
  console.log("[步骤3] 合成视频");
  execSync(`ffmpeg -y -framerate ${fps} -i "frame-%d.png" -i combined-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -t ${audioDur} final-video.mp4`, { stdio: 'inherit' });
  
  // 验证
  const videoDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 final-video.mp4`, { encoding: 'utf8' }).trim());
  const stats = fs.statSync("final-video.mp4");
  
  console.log(`\n[结果]`);
  console.log(`  时长: ${videoDur.toFixed(1)}秒 (${(videoDur/60).toFixed(1)}分钟)`);
  console.log(`  大小: ${(stats.size/1024/1024).toFixed(2)}MB`);
  
  // 清理
  for (let i = 0; i < frameIdx; i++) try{fs.unlinkSync(`frame-${i}.png`)}catch{}
  for (let i = 0; i < segments.length; i++) try{fs.unlinkSync(`seg-${i}.mp3`)}catch{}
  try{fs.unlinkSync('combined-audio.mp3')}catch{}
  
  execSync("mkdir -p out && cp final-video.mp4 out/ai-coding-v4.mp4");
  console.log("\n✅ 完成！");
}

run();