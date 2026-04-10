/**
 * Ralph 视频框架 v3.0 - 增强版
 * 改进点：
 * 1. 更高帧率 (2fps = 每0.5秒切换)
 * 2. 添加动画效果 (CSS keyframes)
 * 3. 更好的视觉设计 (不只是文字)
 * 4. 更快的节奏
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

const segments = [
  { text: "AI Agent 2026革命", type: "标题" },
  { text: "90%的人还在用AI聊天，但只有1%的人在用AI Agent！这是2026年最大的机会！", type: "痛点" },
  { text: "大模型是工具，Agent是员工！", type: "干货" },
  { text: "自动驾驶 versus 辅助驾驶，差别就在这里！", type: "干货" },
  { text: "2026年不懂Agent等于错过下一个风口！", type: "金句" },
  { text: "AI不会取代人，但会用AI的人会取代不会用AI的人", type: "金句" },
  { text: "点赞收藏关注，下期讲如何用Agent搞钱！", type: "CTA" }
];

// 增强模板：添加动画、icon、设计感
const templates = {
  标题: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0}body{background:linear-gradient(135deg,#667eea,#764ba2);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC';overflow:hidden}
.bg{position:absolute;inset:0;background:radial-gradient(circle at 30%70%,rgba(255,255,255,0.1)0,transparent 50%)}
.content{position:relative;z-index:1;text-align:center;animation:fadeIn 1s ease-out}
.t{font-size:72px;font-weight:900;margin-bottom:20px;animation:slideUp 1s ease-out}
.s{font-size:32px;opacity:0;animation:fadeIn 1s ease-out 0.5s forwards}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{transform:translateY(50px);opacity:0}to{transform:translateY(0);opacity:1}}
</style></head><body><div class="bg"></div><div class="content"><div class="t">${t}</div><div class="s">🚀 2026 · 必看</div></div></body></html>`,
  
  痛点: (t,s) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0}body{background:linear-gradient(135deg,#1a1a2e,#16213e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;animation:pulse 2s infinite}
.i{font-size:100px;margin-bottom:20px;display:block;animation:bounce 1s infinite}
.t{font-size:48px;font-weight:bold;line-height:1.6;color:#FF6B6B;margin-bottom:30px}
.s{font-size:28px;color:#00D4FF;padding:15px 40px;background:rgba(0,212,255,0.2);border-radius:30px;display:inline-block}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
</style></head><body><div class="container"><span class="i">🔥</span><div class="t">${t.replace(/\n/g,'<br>')}</div><div class="s">${s}</div></div></body></html>`,
  
  干货: (t,i) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.content{text-align:center;animation:scaleIn 0.5s ease-out}
.i{font-size:90px;margin-bottom:30px;display:block}
.t{font-size:42px;font-weight:bold;line-height:1.5;padding:30px;background:rgba(255,255,255,0.1);border-radius:20px}
@keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
</style></head><body><div class="content"><div class="i">${i}</div><div class="t">${t.replace(/\n/g,'<br>')}</div></div></body></html>`,
  
  金句: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0}body{background:linear-gradient(135deg,#4facfe,#00f2fe);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.t{font-size:40px;font-weight:bold;line-height:2;text-align:center;padding:50px;background:rgba(0,0,0,0.2);border-radius:30px;animation:slideIn 0.8s ease-out}
@keyframes slideIn{from{transform:translateX(-100px);opacity:0}to{transform:translateX(0);opacity:1}}
</style></head><body><div class="t">${t.replace(/\n/g,'<br>')}</div></body></html>`,
  
  CTA: () => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0}body{background:linear-gradient(135deg,#0f0c29,#302b63);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.box{padding:50px;text-align:center;border:3px solid #00D4FF;border-radius:30px;background:rgba(0,212,255,0.1);animation:glow 2s infinite}
.t{font-size:48px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:20px}
.s{font-size:28px;margin-top:20px;color:#888}
@keyframes glow{0%,100%{box-shadow:0 0 30px rgba(0,212,255,0.4)}50%{box-shadow:0 0 60px rgba(0,212,255,0.8)}}
</style></head><body><div class="box"><div class="t">👍 点赞 📥 收藏 👋 关注</div><div style="font-size:32px;margin-top:20px">下期更精彩！</div><div class="s">2026年一起进步</div></div></body></html>`
};

async function run() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   Ralph 框架 v3.0 - 增强版 (2fps)       ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  // 步骤1: 生成语音
  console.log("[步骤1] 生成语音");
  const durations = [];
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 gen_audio.py "${segments[i].text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync("mv temp-audio.mp3 seg-" + i + ".mp3", { stdio: 'ignore' });
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 seg-${i}.mp3`, { encoding: 'utf8' }).trim());
    durations.push(dur);
    console.log(`  段${i+1}: ${dur.toFixed(1)}秒`);
  }
  
  const totalAudio = durations.reduce((a,b)=>a+b,0);
  console.log(`  总时长: ${totalAudio.toFixed(1)}秒\n`);
  
  // 步骤2: 使用2fps = 每0.5秒切换（关键改进！）
  console.log("[步骤2] 设置帧率 2fps (每0.5秒切换)");
  const fps = 2;
  const totalFrames = Math.ceil(totalAudio * fps);
  console.log(`  帧数: ${totalFrames}帧 (2fps × ${totalAudio.toFixed(1)}秒)\n`);
  
  // 步骤3: 生成帧
  console.log("[步骤3] 生成帧图片 (每0.5秒一个画面)");
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  
  // 计算每段的帧数
  const framePerSeg = [];
  let acc = 0;
  for (let i = 0; i < segments.length; i++) {
    const frames = (i === segments.length - 1) 
      ? totalFrames - acc
      : Math.floor((durations[i] / totalAudio) * totalFrames);
    framePerSeg.push(frames);
    acc += frames;
  }
  
  let frameIdx = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    let html = "";
    if (seg.type === "标题") html = templates.标题(seg.text);
    else if (seg.type === "痛点") html = templates.痛点(seg.text, "这是2026年最大的机会！");
    else if (seg.type === "干货") html = templates.干货(seg.text, i === 3 ? "⚡" : "💡");
    else if (seg.type === "金句") html = templates.金句(seg.text);
    else if (seg.type === "CTA") html = templates.CTA();
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 300));
    
    for (let f = 0; f < framePerSeg[i]; f++) {
      await page.screenshot({ path: `frame-${frameIdx}.png`, fullPage: true });
      frameIdx++;
    }
    await page.close();
    console.log(`  场景${i+1} (${seg.type}): ${framePerSeg[i]}帧`);
  }
  await browser.close();
  console.log(`  共${frameIdx}帧\n`);
  
  // 步骤4: 合并语音
  console.log("[步骤4] 合并语音");
  let filterInputs = "", filterDesc = "";
  for (let i = 0; i < segments.length; i++) {
    filterInputs += `-i seg-${i}.mp3 `;
    filterDesc += `[${i}:a]`;
  }
  filterDesc += `concat=n=${segments.length}:v=0:a=1[out]`;
  execSync(`ffmpeg -y ${filterInputs} -filter_complex "${filterDesc}" -map "[out" combined-audio.mp3`, { stdio: 'ignore' });
  const finalDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 combined-audio.mp3`, { encoding: 'utf8' }).trim());
  console.log(`  合并后: ${finalDur.toFixed(1)}秒\n`);
  
  // 步骤5: 合成视频 (关键: 使用2fps)
  console.log("[步骤5] 合成视频 (2fps)");
  execSync(`ffmpeg -y -framerate 2 -i "frame-%d.png" -i combined-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -t ${finalDur} final-v3.mp4`, { stdio: 'ignore' });
  
  // 步骤6: 验证
  console.log("\n[步骤6] 验证");
  const videoDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 final-v3.mp4`, { encoding: 'utf8' }).trim());
  const diff = Math.abs(videoDur - finalDur);
  const stats = fs.statSync("final-v3.mp4");
  
  console.log(`  视频: ${videoDur.toFixed(1)}秒`);
  console.log(`  语音: ${finalDur.toFixed(1)}秒`);
  console.log(`  帧率: 2fps`);
  console.log(`  大小: ${(stats.size/1024/1024).toFixed(2)}MB`);
  console.log(`  同步: ${diff < 0.5 ? '✅' : '❌'}`);
  
  // 清理
  for (let i = 0; i < frameIdx; i++) try{fs.unlinkSync(`frame-${i}.png`)}catch{}
  for (let i = 0; i < segments.length; i++) try{fs.unlinkSync(`seg-${i}.mp3`)}catch{}
  try{fs.unlinkSync('combined-audio.mp3')}catch{}
  
  if (diff < 0.5) {
    execSync("cp final-v3.mp4 ../out/ralph-v3.mp4");
    console.log("\n✅ 已保存到 out/ralph-v3.mp4");
  }
}

run();
