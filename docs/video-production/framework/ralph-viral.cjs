#!/usr/bin/env node
/**
 * 爆款视频生成器 v5.0 - 对标热门视频
 * 特点: 高帧率+转场特效+BGM
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

const CONFIG = { fps: 8 }; // 提升帧率

// 爆款文案（优化版）
const segments = [
  { text: "AI火遍全球！但90%的人还不会用AI！看完这个视频，你就能超越90%的人！", type: "标题" },
  { text: "AI是什么？简单说，AI就是讓机器像人一樣思考和做事。它可以帮你写文案、画图、写代码、分析数据！", type: "干货" },
  { text: "为什么现在必须学AI？因为AI正在取代重复性工作！会计、设计师、程序员...都在被AI冲击！", type: "干货" },
  { text: "不会AI的人，以後找工作都难！调查显示：会用AI的人，效率提升10倍，工资高出50%！", type: "数据" },
  { text: "普通人怎么学AI？第一步：了解AI能做什么。第二步：亲自动手试试。第三步：用在工作里！", type: "行动" },
  { text: "推荐每个小白都试试：ChatGPT写文案、Midjourney画图、Copilot写代码！", type: "行动" },
  { text: "记住：AI不会取代人，但会用AI的人会取代不会用AI的人！看完赶紧行动！", type: "金句" },
  { text: "觉得有用的话，点赞收藏！关注我，下期讲更多AI搞钱副业！", type: "CTA" }
];

// 转场特效模板
const templates = {
  标题: (t) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:#000;height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;position:relative;animation:fadeIn 0.5s ease-out}
.icon{font-size:180px;margin-bottom:50px;animation:pulse 1s infinite}
.title{font-size:48px;font-weight:900;background:linear-gradient(90deg,#ff4444,#ff8800,#ffff00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.3;text-shadow:0 0 30px rgba(255,100,0,0.5)}
.subtitle{font-size:24px;margin-top:30px;color:#888}
@keyframes fadeIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
</style></head><body><div class="container"><div class="icon">⚡</div><div class="title">${t}</div><div class="subtitle">必看！AI革命</div></div></body></html>`,
  
  干货: (t) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#1a1a2e,#16213e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;max-width:800px;animation:slideIn 0.5s ease-out}
.tag{position:absolute;top:30px;left:30px;font-size:20px;background:linear-gradient(90deg,#00d4ff,#0099ff);padding:10px 20px;border-radius:20px}
.icon{font-size:100px;margin-bottom:30px;display:block}
.title{font-size:32px;font-weight:700;line-height:1.6}
@keyframes slideIn{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}
</style></head><body><div class="container"><span class="tag">💡 必看</span><div class="icon">🧠</div><div class="title">${t}</div></div></body></html>`,
  
  数据: (t) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;animation:zoomIn 0.5s ease-out}
.tag{font-size:24px;background:linear-gradient(90deg,#ff6b6b,#ff8e53);padding:15px 35px;border-radius:25px;display:inline-block;margin-bottom:30px}
.title{font-size:36px;font-weight:700;line-height:1.6;background:rgba(255,255,255,0.1);padding:35px;border-radius:20px}
.number{font-size:72px;font-weight:900;background:linear-gradient(90deg,#00ff88,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
@keyframes zoomIn{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}
</style></head><body><div class="container"><span class="tag">📊 数据</span><div class="title">${t}</div></div></body></html>`,
  
  行动: (t) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:40px;animation:slideUp 0.5s ease-out}
.icon{font-size:120px;margin-bottom:30px}
.title{font-size:34px;font-weight:700;line-height:1.6}
.step{font-size:20px;margin-top:20px;opacity:0.8}
@keyframes slideUp{from{opacity:0;transform:translateY(100px)}to{opacity:1;transform:translateY(0)}}
</style></head><body><div class="container"><div class="icon">🎯</div><div class="title">${t}</div></div></body></html>`,
  
  金句: (t) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#667eea,#764ba2);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px;border:5px solid #fff;border-radius:30px;background:rgba(0,0,0,0.3);animation:shock 0.5s ease-out}
.title{font-size:42px;font-weight:900;line-height:1.5}
.highlight{color:#ffdd00;text-shadow:0 0 20px rgba(255,221,0,0.8)}
@keyframes shock{0%{transform:scale(0.5);opacity:0}50%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  CTA: () => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#f093fb,#f5576c);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px;animation:bounceIn 0.8s ease-out}
.icons{font-size:80px;margin-bottom:30px}
.title{font-size:48px;font-weight:900;background:linear-gradient(90deg,#fff,#fff);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sub{font-size:24px;margin-top:20px;opacity:0.9}
@keyframes bounceIn{0%{opacity:0;transform:scale(0.3)}50%{transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}
</style></head><body><div class="container"><div class="icons">👍📥👋</div><div class="title">👍 点赞 📥 收藏 👋 关注</div><div class="sub">下期更精彩！</div></div></body></html>`
};

async function run() {
  const fps = CONFIG.fps;
  
  console.log("╔════════════════════════════════════════╗");
  console.log("║   爆款视频 v5.0 - 对标热门视频          ║");
  console.log("╚═══════════════════���═��══════════════════╝\n");
  
  // 1. 生成语音
  console.log("[1/5] 生成语音...");
  const segmentDurations = [];
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 gen_audio.py "${segments[i].text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync("mv temp-audio.mp3 seg-" + i + ".mp3", { stdio: 'ignore' });
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 seg-${i}.mp3`, { encoding: 'utf8' }).trim());
    segmentDurations.push(dur);
    console.log(`  段${i+1}: ${dur.toFixed(1)}秒 ${segments[i].type}`);
  }
  const totalDuration = segmentDurations.reduce((a,b) => a+b, 0);
  console.log(`总时长: ${totalDuration.toFixed(1)}秒\n`);
  
  // 2. 计算帧数
  console.log("[2/5] 计算帧数...");
  const framePerSeg = segmentDurations.map(d => Math.ceil(d * fps));
  const totalFrames = framePerSeg.reduce((a,b) => a+b);
  console.log(`帧数: ${totalFrames}帧 (fps=${fps})\n`);
  
  // 3. 渲染帧
  console.log("[3/5] 渲染帧 (转场特效)...");
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
  
  // 4. 合并语音 + 合成视频
  console.log("[4/5] 合成视频...");
  let filterInputs = "", filterDesc = "";
  for (let i = 0; i < segments.length; i++) {
    filterInputs += `-i seg-${i}.mp3 `;
    filterDesc += `[${i}:a]`;
  }
  filterDesc += `concat=n=${segments.length}:v=0:a=1[out]`;
  execSync(`ffmpeg -y ${filterInputs} -filter_complex "${filterDesc}" -map "[out" combined-audio.mp3`, { stdio: 'ignore' });
  
  // 添加背景音乐
  execSync(`ffmpeg -y -i combined-audio.mp3 -i bgm.mp3 -filter_complex "[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=2[out]" -map "[out]" audio-with-bgm.mp3`, { stdio: 'ignore' });
  
  const audioFile = fs.existsSync('audio-with-bgm.mp3') ? 'audio-with-bgm.mp3' : 'combined-audio.mp3';
  
  execSync(`ffmpeg -y -framerate ${fps} -i "frame-%d.png" -i ${audioFile} -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -t ${totalDuration} -shortest final-video.mp4`, { stdio: 'inherit' });
  
  // 5. 验证
  const videoDuration = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 final-video.mp4`, { encoding: 'utf8' }).trim());
  const stats = fs.statSync("final-video.mp4");
  
  console.log("\n[5/5] 验证结果");
  console.log(`  时长: ${videoDuration.toFixed(1)}秒 (${(videoDuration/60).toFixed(1)}分钟)`);
  console.log(`  大小: ${(stats.size/1024/1024).toFixed(2)}MB`);
  console.log(`  帧率: ${fps}fps`);
  
  // 清理
  for (let i = 0; i < frameIdx; i++) try{fs.unlinkSync(`frame-${i}.png`)}catch{}
  for (let i = 0; i < segments.length; i++) try{fs.unlinkSync(`seg-${i}.mp3`)}catch{}
  try{fs.unlinkSync('combined-audio.mp3')}catch{}
  try{fs.unlinkSync('audio-with-bgm.mp3')}catch{}
  
  execSync("mkdir -p out && cp final-video.mp4 out/ralph-viral.mp4");
  console.log("\n✅ 完成！");
}

run();