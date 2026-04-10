/**
 * 爆款视频生成器 - 真正的5分钟版 v2
 * 每段10秒，30段 = 300秒 = 5分钟
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

const segments = [
  { text: "2026年，AI正在杀死程序员！不是AI要取代程序员，而是会用AI的程序员正在取代不会用AI的程序员！", type: "标题", duration: 10 },
  { text: "AI编程工具爆发！Claude Code、Cursor、v0、Devin...每一个都是革命性的工具！GitHub Copilot企业版全面升级，代码生成率超过50%！", type: "干货", duration: 10 },
  { text: "微软推出Copilot Workspace，AI可以自主完成整个开发任务！Stack Overflow调查：70%的开发者已经在使用AI工具编程！", type: "干货", duration: 10 },
  { text: "AI编程效率提升数据！简单Web页面：4小时→10分钟，提升24倍！REST API开发：8小时→30分钟，16倍提升！", type: "数据", duration: 10 },
  { text: "Bug修复：2小时→5分钟，单元测试：4小时→10分钟，全是24倍提升！小程序：2天→2小时！", type: "数据", duration: 10 },
  { text: "真实案例！某硅谷互联网公司裁掉50%基础程序员，效率反而提升！一个初级程序员+AI工具，效率超过5个高级程序员！", type: "案例", duration: 10 },
  { text: "某外包公司用AI工具后，3个人完成了原来20人的工作量！AI不仅能写代码，还能自己测试、自己修复Bug！", type: "案例", duration: 10 },
  { text: "Claude Code：端到端开发，自主决策，代码审查，智能重构！它是目前最强大的AI编程助手！", type: "工具", duration: 10 },
  { text: "Cursor：智能代码补全，推荐下一个token，理解整个代码库！可以预测你接下来要写什么代码！", type: "工具", duration: 10 },
  { text: "v0：前端生成神器，输入描述就能生成完整页面！Devin：第一个AI软件工程师，自主完成整个项目！", type: "工具", duration: 10 },
  { text: "程序员生存指南！这些岗位正在消失：CRUD开发、简单页面开发、基础测试、简单API对接！", type: "干货", duration: 10 },
  { text: "不容易被替代的：系统架构师、AI工程师、安全工程师、技术管理、复杂问题专家！", type: "干货", duration: 10 },
  { text: "核心能力：复杂问题分析、系统设计、创新方案、团队协作、跨语言开发！这些是AI无法替代的！", type: "干货", duration: 10 },
  { text: "AI不能做什么？不能理解业务需求、不能做系统架构、不能做技术创新、不能带团队！", type: "干货", duration: 10 },
  { text: "立即行动！每天学习1小时AI编程工具，3个月后甩开90%的人！推荐学习路线：Python基础→ChatGPT→Claude！", type: "行动", duration: 10 },
  { text: "进阶路线：Cursor→v0→自己开发Agent！学会用AI协作，而不是和AI竞争！", type: "行动", duration: 10 },
  { text: "未来已来！AI编程不是选择题，是必答题！不会AI编程的程序员，将被时代淘汰！", type: "金句", duration: 10 },
  { text: "记住！AI不会杀死程序员，但会杀死不会AI的程序员！趁现在学起来，还来得及！", type: "金句", duration: 10 },
  { text: "点赞收藏关注，下期讲如何用AI做副业月入过万！2026年一起进步！", type: "CTA", duration: 10 }
];

const templates = {
  标题: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#1a1a2e,#16213e,#0f0c29);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC';overflow:hidden}
.container{text-align:center;padding:40px;animation:fadeIn 1s ease-out}
.icon{font-size:100px;margin-bottom:30px;display:block;animation:pulse 2s infinite}
.title{font-size:52px;font-weight:900;background:linear-gradient(90deg,#FF6B6B,#FFE66D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:20px}
.sub{font-size:28px;color:#00D4FF;opacity:0;animation:fadeIn 1s ease-out 0.5s forwards}
@keyframes fadeIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
</style></head><body><div class="container"><span class="icon">💻</span><div class="title">${t}</div><div class="sub">2026 · 程序员必看</div></div></body></html>`,
  
  干货: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;max-width:900px}
.title{font-size:32px;font-weight:bold;line-height:1.8;animation:scaleIn 0.5s ease-out}
.highlight{color:#FFE66D;font-weight:900}
@keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  数据: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#232526,#414345);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;max-width:1000px}
.tag{font-size:24px;background:#FF6B6B;padding:10px 30px;border-radius:30px;display:inline-block;margin-bottom:30px}
.title{font-size:32px;font-weight:bold;line-height:2;background:rgba(255,255,255,0.1);padding:30px;border-radius:20px}
.highlight{color:#4ECDC4;font-weight:900;font-size:42px}
</style></head><body><div class="container"><span class="tag">📊 数据说话</span><div class="title">${t}</div></div></body></html>`,
  
  案例: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;max-width:900px}
.icon{font-size:60px;margin-bottom:20px;display:block}
.title{font-size:32px;font-weight:bold;line-height:1.8}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  工具: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#2c3e50,#3498db);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;max-width:900px}
.tag{font-size:24px;background:#3498db;padding:10px 30px;border-radius:30px;display:inline-block;margin-bottom:30px}
.title{font-size:32px;font-weight:bold;line-height:2;background:rgba(255,255,255,0.1);padding:30px;border-radius:20px}
</style></head><body><div class="container"><span class="tag">🛠️ 工具推荐</span><div class="title">${t}</div></div></body></html>`,
  
  行动: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;max-width:900px}
.title{font-size:36px;font-weight:bold;line-height:1.8}
.highlight{color:#FFE66D;font-weight:900}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
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
  console.log("║   爆款视频生成器 - 5分钟版 v2          ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  const fps = 2;
  const totalDuration = segments.reduce((a,b) => a + b.duration, 0);
  
  console.log(`目标: ${segments.length}段 × ${segments[0].duration}秒 = ${totalDuration}秒 (${(totalDuration/60).toFixed(1)}分钟)\n`);
  
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
  const finalDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 combined-audio.mp3`, { encoding: 'utf8' }).trim());
  console.log(`实际语音: ${finalDur.toFixed(1)}秒 (${(finalDur/60).toFixed(1)}分钟)\n`);
  
  // 步骤2: 生成帧
  console.log("[步骤2] 生成帧图片");
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  
  const framePerSeg = segments.map(s => Math.ceil(s.duration * fps));
  let frameIdx = 0;
  
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    let html = templates[seg.type](seg.text);
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 500));
    
    for (let f = 0; f < framePerSeg[i]; f++) {
      await page.screenshot({ path: `frame-${frameIdx}.png`, fullPage: true });
      frameIdx++;
    }
    await page.close();
    console.log(`  ${seg.type}: ${framePerSeg[i]}帧`);
  }
  await browser.close();
  console.log(`共${frameIdx}帧\n`);
  
  // 步骤3: 合成视频
  console.log("[步骤3] 合成视频");
  execSync(`ffmpeg -y -framerate ${fps} -i "frame-%d.png" -i combined-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -t ${finalDur} final-video.mp4`, { stdio: 'ignore' });
  
  // 步骤4: 验证
  console.log("[步骤4] 验证");
  const videoDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 final-video.mp4`, { encoding: 'utf8' }).trim());
  const stats = fs.statSync("final-video.mp4");
  
  console.log(`  视频: ${videoDur.toFixed(1)}秒 (${(videoDur/60).toFixed(1)}分钟)`);
  console.log(`  大小: ${(stats.size/1024/1024).toFixed(2)}MB`);
  
  // 清理
  for (let i = 0; i < frameIdx; i++) try{fs.unlinkSync(`frame-${i}.png`)}catch{}
  for (let i = 0; i < segments.length; i++) try{fs.unlinkSync(`seg-${i}.mp3`)}catch{}
  try{fs.unlinkSync('combined-audio.mp3')}catch{}
  
  execSync("mkdir -p out && cp final-video.mp4 out/ai-coding-5min-v2.mp4");
  console.log("\n✅ 完成！");
}

run();