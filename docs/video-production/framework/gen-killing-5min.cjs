/**
 * 爆款视频生成器 - 5分钟版
 * 主题：AI将杀死这10个行业
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

// 5分钟视频脚本
const segments = [
  { text: "⚠️ 2026年，这些行业正在消失！", type: "标题", duration: 5 },
  { text: "AI正在杀死这10个行业！不是未来，是现在！", type: "开场", duration: 8 },
  { text: "第一个被冲击的行业：客服！全球1700万从业者，80%将被AI替代！", type: "干货", duration: 10 },
  { text: "AI客服优势：7×24小时服务、同时处理10000+对话、成本降低90%、情绪稳定永不疲倦！", type: "干货", duration: 12 },
  { text: "电商设计工作室真实案例：5人团队月成本5万，1人+AI月成本5000，效率提升20倍！", type: "案例", duration: 12 },
  { text: "基础编程受冲击更大！简单Web页面4小时→10分钟，提升24倍！", type: "干货", duration: 10 },
  { text: "Bug修复2小时→5分钟，单元测试4小时→10分钟，全是24倍提升！", type: "干货", duration: 10 },
  { text: "为什么是这些行业？因为重复性高、创造性低、数据丰富、决策简单、不需要人际交流！", type: "分析", duration: 12 },
  { text: "AI无法替代的能力：复杂决策、情感交互、创意创作、动手能力！", type: "分析", duration: 10 },
  { text: "怎么应对？立即评估岗位AI替代风险，学习AI工具，建立AI协作能力！", type: "干货", duration: 12 },
  { text: "记住！AI不会杀死所有工作，但会杀死不会AI的人的工作！", type: "金句", duration: 8 },
  { text: "点赞收藏关注，下期讲如何用AI搞钱！", type: "CTA", duration: 5 }
];

// 模板 - 更好看的设计
const templates = {
  标题: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#1a1a2e,#16213e,#0f0c29);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC';overflow:hidden}
.container{text-align:center;padding:40px;animation:fadeIn 1s ease-out}
.icon{font-size:120px;margin-bottom:30px;display:block;animation:pulse 2s infinite}
.title{font-size:72px;font-weight:900;background:linear-gradient(90deg,#FF6B6B,#FFE66D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:20px}
.sub{font-size:32px;color:#00D4FF;opacity:0;animation:fadeIn 1s ease-out 0.5s forwards}
@keyframes fadeIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
</style></head><body><div class="container"><span class="icon">⚠️</span><div class="title">${t}</div><div class="sub">2026 · 必看</div></div></body></html>`,
  
  开场: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#667eea,#764ba2);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px}
.title{font-size:48px;font-weight:bold;line-height:1.6;animation:slideUp 0.8s ease-out}
.highlight{color:#FFE66D;font-weight:900}
@keyframes slideUp{from{transform:translateY(50px);opacity:0}to{transform:translateY(0);opacity:1}}
</style></head><body><div class="container"><div class="title">${t.replace(/⚠️/g,'').replace(/AI/g,'<span class="highlight">AI</span>')}</div></div></body></html>`,
  
  干货: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;max-width:900px}
.title{font-size:36px;font-weight:bold;line-height:1.8;animation:scaleIn 0.5s ease-out}
.highlight{color:#FFE66D;font-weight:900;font-size:42px}
.list{font-size:28px;margin-top:30px;text-align:left;padding-left:50px}
.list div{margin:15px 0}
@keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  案例: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#232526,#414345);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;max-width:1000px}
.tag{font-size:24px;background:#FF6B6B;padding:10px 30px;border-radius:30px;display:inline-block;margin-bottom:30px}
.title{font-size:32px;font-weight:bold;line-height:2;background:rgba(255,255,255,0.1);padding:30px;border-radius:20px}
.highlight{color:#4ECDC4;font-weight:900;font-size:42px}
@keyframes slideIn{from{transform:translateX(-50px);opacity:0}to{transform:translateX(0);opacity:1}}
</style></head><body><div class="container"><span class="tag">📊 真实案例</span><div class="title">${t}</div></div></body></html>`,
  
  分析: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;max-width:900px}
.icon{font-size:60px;margin-bottom:20px;display:block}
.title{font-size:34px;font-weight:bold;line-height:1.8}
.item{color:#00D4FF;font-size:28px;margin:20px 0}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
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
  console.log("║   爆款视频生成器 - 5分钟版            ║");
  console.log("║   主题：AI将杀死这10个行业             ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  const fps = 2;
  const totalDuration = segments.reduce((a,b) => a + b.duration, 0);
  const totalFrames = Math.ceil(totalDuration * fps);
  
  console.log(`总时长: ${totalDuration}秒, 帧数: ${totalFrames}帧 (${fps}fps)\n`);
  
  // 步骤1: 生成语音
  console.log("[步骤1] 生成语音");
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 gen_audio.py "${segments[i].text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync("mv temp-audio.mp3 seg-" + i + ".mp3", { stdio: 'ignore' });
    console.log(`  段${i+1}: ${segments[i].duration}秒 - ${segments[i].text.substring(0,30)}...`);
  }
  console.log("");
  
  // 合并语音
  let filterInputs = "", filterDesc = "";
  for (let i = 0; i < segments.length; i++) {
    filterInputs += `-i seg-${i}.mp3 `;
    filterDesc += `[${i}:a]`;
  }
  filterDesc += `concat=n=${segments.length}:v=0:a=1[out]`;
  execSync(`ffmpeg -y ${filterInputs} -filter_complex "${filterDesc}" -map "[out" combined-audio.mp3`, { stdio: 'ignore' });
  const finalDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 combined-audio.mp3`, { encoding: 'utf8' }).trim());
  console.log(`合并后: ${finalDur.toFixed(1)}秒\n`);
  
  // 步骤2: 生成帧
  console.log("[步骤2] 生成帧图片");
  const browser = await puppeteer.launch({ 
    executablePath: '/usr/bin/google-chrome', 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  // 计算每段帧数
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
    else if (seg.type === "案例") html = templates.案例(seg.text);
    else if (seg.type === "分析") html = templates.分析(seg.text);
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
  execSync(`ffmpeg -y -framerate ${fps} -i "frame-%d.png" -i combined-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -t ${finalDur} final-killing.mp4`, { stdio: 'ignore' });
  
  // 步骤4: 验证
  console.log("\n[步骤4] 验证");
  const videoDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 final-killing.mp4`, { encoding: 'utf8' }).trim());
  const stats = fs.statSync("final-killing.mp4");
  
  console.log(`  视频: ${videoDur.toFixed(1)}秒`);
  console.log(`  语音: ${finalDur.toFixed(1)}秒`);
  console.log(`  帧率: ${fps}fps`);
  console.log(`  大小: ${(stats.size/1024/1024).toFixed(2)}MB`);
  
  // 清理
  for (let i = 0; i < frameIdx; i++) try{fs.unlinkSync(`frame-${i}.png`)}catch{}
  for (let i = 0; i < segments.length; i++) try{fs.unlinkSync(`seg-${i}.mp3`)}catch{}
  try{fs.unlinkSync('combined-audio.mp3')}catch{}
  
  execSync("cp final-killing.mp4 out/killing-industries-5min.mp4");
  console.log("\n✅ 已保存到 out/killing-industries-5min.mp4");
}

run();
