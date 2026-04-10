const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

// 完整文案（合并所有段）
const fullText = "AI Agent 2026革命。90%的人还在用AI聊天，但只有1%的人在用AI Agent！这是2026年最大的机会！大模型是工具，Agent是员工！自动驾驶 versus 辅助驾驶，差别就在这里！2026年不懂Agent等于错过下一个风口！AI不会取代人，但会用AI的人会取代不会用AI的人。点赞收藏关注，下期讲如何用Agent搞钱！";

// 7个场景HTML
const scenes = [
  `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.t{font-size:56px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.s{font-size:24px;color:#888;margin-top:20px}</style></head><body><div class="t">AI Agent 2026革命</div><div class="s">2026必看 · 颠覆认知</div></body></html>`,
  `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.i{font-size:64px}.h{font-size:40px;font-weight:700;text-align:center;line-height:2;color:#FF6B6B}.s{font-size:28px;color:#00D4FF;margin-top:40px}</style></head><body><span class="i">🔥</span><div class="h">90%的人还在用AI聊天<br>但只有<span style="font-size:60px">1%</span>的人在用AI Agent！</div><div class="s">这是2026年最大的机会！</div></body></html>`,
  `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.i{font-size:72px}.h{font-size:44px;font-weight:700;text-align:center;line-height:2;color:#00D4FF}</style></head><body><span class="i">💡</span><div class="h">大模型是工具<br>→<br>Agent是员工！</div></body></html>`,
  `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#141E30,#243B55);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.i{font-size:72px}.h{font-size:42px;font-weight:700;text-align:center;line-height:2;color:#FF6B6B}.s{color:#00D4FF;font-size:32px;margin-top:30px}</style></head><body><span class="i">⚡</span><div class="h">自动驾驶 vs 辅助驾驶<br>差别就在这里！</div><div class="s">🚗 🤖 🚗</div></body></html>`,
  `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#1a1a2e,#4a148c);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.i{font-size:72px}.y{font-size:80px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.h{font-size:44px;font-weight:700;color:#00FF88;margin-top:20px}</style></head><body><span class="i">🎯</span><div class="y">2026</div><div class="h">不懂Agent = 错过下一个<br>风口！</div></body></html>`,
  `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.h{font-size:40px;font-weight:700;text-align:center;line-height:2}.c1{color:#00D4FF}.c2{color:#FF6B6B}</style></head><body><div class="h"><span class="c1">AI不会取代人</span><br><br><span style="color:#888">但会用</span><span class="c2">AI的人</span><br><span style="color:#888">会取代</span><span class="c2">不会用AI的人</span></div></body></html>`,
  `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.box{padding:40px 60px;background:linear-gradient(90deg,rgba(0,212,255,0.3),rgba(0,255,136,0.3));border:3px solid #00D4FF;border-radius:30px;text-align:center}.t{font-size:48px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.a{font-size:36px;margin-top:30px}.s{font-size:28px;color:#888;margin-top:20px}</style></head><body><div class="box"><div class="t">👍 点赞 📥 收藏 👋 关注</div><div class="a">下期讲如何用Agent搞钱！</div><div class="s">2026年一起搞钱！</div></div></body></html>`
];

// 场景对应的时间点（秒）- 根据语音长度估算
// 语音总长约35秒，7个场景大致分配
const timePoints = [0, 3, 12, 17, 22, 27, 32]; // 开始时间

(async () => {
  // 1. 生成完整语音
  execSync(`python3 -c "import edge_tts, asyncio; asyncio.run(edge_tts.Communicate('${fullText}', 'zh-CN-XiaoxiaoNeural').save('out/full-audio.mp3'))"`);
  console.log("✓ 语音生成");
  
  // 获取语音时长
  const audioDuration = parseFloat(execSync("ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 out/full-audio.mp3", { encoding: 'utf8' }).trim());
  console.log(`语音时长: ${audioDuration.toFixed(1)}秒`);
  
  // 2. 生成7个场景的图片，每个场景重复显示直到切换
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  
  // 计算每帧持续时间：总时长/总帧数，但场景要按时间点切换
  // 使用1fps，每秒1帧
  const fps = 1;
  const totalFrames = Math.ceil(audioDuration * fps);
  
  let frameIdx = 0;
  for (let sec = 0; sec < totalFrames; sec++) {
    // 确定当前秒对应哪个场景
    let sceneIdx = 0;
    for (let i = 0; i < timePoints.length; i++) {
      if (sec >= timePoints[i]) sceneIdx = i;
    }
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(scenes[sceneIdx]);
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({ path: `out/f-${frameIdx}.png`, fullPage: true });
    await page.close();
    
    frameIdx++;
    if (sec % 5 === 0) console.log(`✓ 帧${sec}`);
  }
  await browser.close();
  console.log(`✓ 共${totalFrames}帧`);
  
  // 3. 合成视频
  execSync(`ffmpeg -y -framerate 1 -i "out/f-%d.png" -i out/full-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -shortest out/demo-v4.mp4`, { stdio: 'ignore' });
  
  // 清理
  for (let i = 0; i < totalFrames; i++) {
    try { fs.unlinkSync(`out/f-${i}.png`); } catch {}
  }
  try { fs.unlinkSync('out/full-audio.mp3'); } catch {}
  
  // 验证
  const videoDur = execSync("ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 out/demo-v4.mp4", { encoding: 'utf8' }).trim();
  console.log(`\n✓ 完成! 视频时长: ${videoDur}秒`);
})();
