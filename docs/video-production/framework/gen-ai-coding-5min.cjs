/**
 * 爆款视频生成器 - 真正的5分钟版
 * 主题：AI编程革命 - 2026年程序员必看
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

// 真正5分钟+视频 (20段，约300秒)
const segments = [
  // 开场 (30秒)
  { text: "2026年，AI正在杀死程序员！", type: "标题", duration: 15 },
  { text: "不是AI要取代程序员，而是会用AI的程序员正在取代不会用AI的程序员！", type: "开场", duration: 15 },
  
  // 现状 (60秒)
  { text: "AI编程工具爆发！2026年，这些工具正在改变整个编程行业！", type: "干货", duration: 15 },
  { text: "Claude Code、Cursor、v0、Devin...每一个都是革命性的工具！", type: "干货", duration: 15 },
  { text: "GitHub Copilot企业版全面升级，代码生成率超过50%！", type: "干货", duration: 15 },
  { text: "微软推出Copilot Workspace，AI可以自主完成整个开发任务！", type: "干货", duration: 15 },
  
  // 数据展示 (60秒)
  { text: "AI编程效率提升数据！简单Web页面：4小时→10分钟，提升24倍！", type: "数据", duration: 15 },
  { text: "REST API开发：8小时→30分钟，16倍提升！小程序：2天→2小时！", type: "数据", duration: 15 },
  { text: "Bug修复：2小时→5分钟，单元测试：4小时→10分钟，全是24倍！", type: "数据", duration: 15 },
  { text: "Stack Overflow调查：70%的开发者已经在使用AI工具编程！", type: "数据", duration: 15 },
  
  // 案例 (45秒)
  { text: "真实案例！某硅谷互联网公司裁掉50%基础程序员，效率反而提升！", type: "案例", duration: 15 },
  { text: "一个初级程序员+AI工具，效率超过5个不会用AI的高级程序员！", type: "案例", duration: 15 },
  { text: "某外包公司用AI工具后，3个人完成了原来20人的工作量！", type: "案例", duration: 15 },
  
  // 工具对比 (60秒)
  { text: "AI编程工具对比！Claude Code：端到端开发，自主决策，代码审查！", type: "工具", duration: 15 },
  { text: "Cursor：智能代码补全，推荐下一个token，理解整个代码库！", type: "工具", duration: 15 },
  { text: "v0：前端生成神器，输入描述就能生成完整页面！", type: "工具", duration: 15 },
  { text: "Devin：第一个AI软件工程师，自主完成整个项目，超越人类！", type: "工具", duration: 15 },
  
  // 生存指南 (60秒)
  { text: "程序员生存指南！这些岗位正在消失：CRUD开发、简单页面、基础测试！", type: "干货", duration: 15 },
  { text: "不容易被替代的：系统架构师、AI工程师、安全工程师、技术管理！", type: "干货", duration: 15 },
  { text: "核心能力：复杂问题分析、系统设计、创新方案、团队协作！", type: "干货", duration: 15 },
  { text: "记住！AI不会杀死程序员，但会杀死不会AI的程序员！", type: "金句", duration: 15 },
  
  // CTA (15秒)
  { text: "点赞收藏关注，下期讲如何用AI做副业月入过万！", type: "CTA", duration: 15 }
];

// 模板
const templates = {
  标题: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#1a1a2e,#16213e,#0f0c29);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC';overflow:hidden}
.container{text-align:center;padding:40px;animation:fadeIn 1s ease-out}
.icon{font-size:100px;margin-bottom:30px;display:block;animation:pulse 2s infinite}
.title{font-size:64px;font-weight:900;background:linear-gradient(90deg,#FF6B6B,#FFE66D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:20px}
.sub{font-size:28px;color:#00D4FF;opacity:0;animation:fadeIn 1s ease-out 0.5s forwards}
@keyframes fadeIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
</style></head><body><div class="container"><span class="icon">💻</span><div class="title">${t}</div><div class="sub">2026 · 程序员必看</div></div></body></html>`,
  
  开场: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#667eea,#764ba2);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px}
.title{font-size:42px;font-weight:bold;line-height:1.6;animation:slideUp 0.8s ease-out}
.highlight{color:#FFE66D;font-weight:900}
@keyframes slideUp{from{transform:translateY(50px);opacity:0}to{transform:translateY(0);opacity:1}}
</style></head><body><div class="container"><div class="title">${t.replace(/AI/g,'<span class="highlight">AI</span>')}</div></div></body></html>`,
  
  干货: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;max-width:900px}
.title{font-size:36px;font-weight:bold;line-height:1.8;animation:scaleIn 0.5s ease-out}
.highlight{color:#FFE66D;font-weight:900;font-size:42px}
@keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  数据: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#232526,#414345);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;max-width:1000px}
.tag{font-size:24px;background:#FF6B6B;padding:10px 30px;border-radius:30px;display:inline-block;margin-bottom:30px}
.title{font-size:32px;font-weight:bold;line-height:2;background:rgba(255,255,255,0.1);padding:30px;border-radius:20px}
.highlight{color:#4ECDC4;font-weight:900;font-size:42px}
@keyframes slideIn{from{transform:translateX(-50px);opacity:0}to{transform:translateX(0);opacity:1}}
</style></head><body><div class="container"><span class="tag">📊 数据说话</span><div class="title">${t}</div></div></body></html>`,
  
  案例: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;max-width:900px}
.icon{font-size:60px;margin-bottom:20px;display:block}
.title{font-size:34px;font-weight:bold;line-height:1.8}
.item{color:#00D4FF;font-size:28px;margin:20px 0}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  工具: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#2c3e50,#3498db);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;max-width:900px}
.tag{font-size:24px;background:#3498db;padding:10px 30px;border-radius:30px;display:inline-block;margin-bottom:30px}
.title{font-size:32px;font-weight:bold;line-height:2;background:rgba(255,255,255,0.1);padding:30px;border-radius:20px}
.highlight{color:#FFE66D;font-weight:900}
</style></head><body><div class="container"><span class="tag">🛠️ 工具推荐</span><div class="title">${t}</div></div></body></html>`,
  
  金句: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#4facfe,#00f2fe);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px;border:5px solid #fff;border-radius:30px;background:rgba(0,0,0,0.2);animation:glow 2s infinite}
.title{font-size:42px;font-weight:900;line-height:2;text-align:center}
.highlight{color:#FFE66D}
@keyframes glow{0%,100%{box-shadow:0 0 30px rgba(79,172,254,0.5)}50%{box-shadow:0 0 60px rgba(79,172,254,0.9)}}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  CTA: () => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px;border:3px solid #00D4FF;border-radius:30px;background:rgba(0,212,255,0.1);animation:glow 2s infinite}
.title{font-size:48px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:20px}
.sub{font-size:28px;color:#888;margin-top:20px}
.tag{font-size:32px;margin-top:30px;color:#FFE66D}
@keyframes glow{0%,100%{box-shadow:0 0 30px rgba(0,212,255,0.4)}50%{box-shadow:0 0 60px rgba(0,212,255,0.8)}}
</style></head><body><div class="container"><div class="title">👍 点赞 📥 收藏 👋 关注</div><div class="tag">下期更精彩！</div><div class="sub">2026年一起进步</div></div></body></html>`
};

async function run() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   爆款视频生成器 - 真正的5分钟版        ║");
  console.log("║   主题：AI编程革命                      ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  const fps = 2;
  const totalDuration = segments.reduce((a,b) => a + b.duration, 0);
  const totalFrames = Math.ceil(totalDuration * fps);
  
  console.log(`总时长: ${totalDuration}秒 (${(totalDuration/60).toFixed(1)}分钟), 帧数: ${totalFrames}帧 (${fps}fps)\n`);
  
  // 步骤1: 生成语音
  console.log("[步骤1] 生成语音");
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 gen_audio.py "${segments[i].text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync("mv temp-audio.mp3 seg-" + i + ".mp3", { stdio: 'ignore' });
  }
  console.log("  语音生成完成\n");
  
  // 合并语音
  let filterInputs = "", filterDesc = "";
  for (let i = 0; i < segments.length; i++) {
    filterInputs += `-i seg-${i}.mp3 `;
    filterDesc += `[${i}:a]`;
  }
  filterDesc += `concat=n=${segments.length}:v=0:a=1[out]`;
  execSync(`ffmpeg -y ${filterInputs} -filter_complex "${filterDesc}" -map "[out" combined-audio.mp3`, { stdio: 'ignore' });
  const finalDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 combined-audio.mp3`, { encoding: 'utf8' }).trim());
  console.log(`合并后: ${finalDur.toFixed(1)}秒 (${(finalDur/60).toFixed(1)}分钟)\n`);
  
  // 步骤2: 生成帧
  console.log("[步骤2] 生成帧图片");
  const browser = await puppeteer.launch({ 
    executablePath: '/usr/bin/google-chrome', 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const framePerSeg = [];
  for (let i = 0; i < segments.length; i++) {
    framePerSeg.push(Math.ceil(segments[i].duration * fps));
  }
  
  let frameIdx = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    let html = "";
    if (seg.type === "标题") html = templates.标题(seg.text);
    else if (seg.type === "开场") html = templates.开场(seg.text);
    else if (seg.type === "干货") html = templates.干货(seg.text);
    else if (seg.type === "数据") html = templates.数据(seg.text);
    else if (seg.type === "案例") html = templates.案例(seg.text);
    else if (seg.type === "工具") html = templates.工具(seg.text);
    else if (seg.type === "金句") html = templates.金句(seg.text);
    else if (seg.type === "CTA") html = templates.CTA();
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 500));
    
    for (let f = 0; f < framePerSeg[i]; f++) {
      await page.screenshot({ path: `frame-${frameIdx}.png`, fullPage: true });
      frameIdx++;
    }
    await page.close();
    console.log(`  场景${i+1} (${seg.type}): ${framePerSeg[i]}帧`);
  }
  await browser.close();
  console.log(`共${frameIdx}帧\n`);
  
  // 步骤3: 合成视频
  console.log("[步骤3] 合成视频");
  execSync(`ffmpeg -y -framerate ${fps} -i "frame-%d.png" -i combined-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -t ${finalDur} final-ai-coding.mp4`, { stdio: 'ignore' });
  
  // 步骤4: 验证
  console.log("\n[步骤4] 验证");
  const videoDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 final-ai-coding.mp4`, { encoding: 'utf8' }).trim());
  const stats = fs.statSync("final-ai-coding.mp4");
  
  console.log(`  视频: ${videoDur.toFixed(1)}秒 (${(videoDur/60).toFixed(1)}分钟)`);
  console.log(`  语音: ${finalDur.toFixed(1)}秒 (${(finalDur/60).toFixed(1)}分钟)`);
  console.log(`  帧率: ${fps}fps`);
  console.log(`  大小: ${(stats.size/1024/1024).toFixed(2)}MB`);
  
  // 清理
  for (let i = 0; i < frameIdx; i++) try{fs.unlinkSync(`frame-${i}.png`)}catch{}
  for (let i = 0; i < segments.length; i++) try{fs.unlinkSync(`seg-${i}.mp3`)}catch{}
  try{fs.unlinkSync('combined-audio.mp3')}catch{}
  
  execSync("mkdir -p out && cp final-ai-coding.mp4 out/ai-coding-revolution-5min.mp4");
  console.log("\n✅ 已保存到 out/ai-coding-revolution-5min.mp4");
}

run();
