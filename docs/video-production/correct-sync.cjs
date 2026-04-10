const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

// 7段文案，分别生成语音
const segments = [
  { text: "AI Agent 2026革命", html: `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.t{font-size:56px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.s{font-size:24px;color:#888;margin-top:20px}</style></head><body><div class="t">AI Agent 2026革命</div><div class="s">2026必看 · 颠覆认知</div></body></html>` },
  { text: "90%的人还在用AI聊天，但只有1%的人在用AI Agent！这是2026年最大的机会！", html: `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.i{font-size:64px}.h{font-size:40px;font-weight:700;text-align:center;line-height:2;color:#FF6B6B}.s{font-size:28px;color:#00D4FF;margin-top:40px}</style></head><body><span class="i">🔥</span><div class="h">90%的人还在用AI聊天<br>但只有<span style="font-size:60px">1%</span>的人在用AI Agent！</div><div class="s">这是2026年最大的机会！</div></body></html>` },
  { text: "大模型是工具，Agent是员工！", html: `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.i{font-size:72px}.h{font-size:44px;font-weight:700;text-align:center;line-height:2;color:#00D4FF}</style></head><body><span class="i">💡</span><div class="h">大模型是工具<br>→<br>Agent是员工！</div></body></html>` },
  { text: "自动驾驶 versus 辅助驾驶，差别就在这里！", html: `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#141E30,#243B55);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.i{font-size:72px}.h{font-size:42px;font-weight:700;text-align:center;line-height:2;color:#FF6B6B}.s{color:#00D4FF;font-size:32px;margin-top:30px}</style></head><body><span class="i">⚡</span><div class="h">自动驾驶 vs 辅助驾驶<br>差别就在这里！</div><div class="s">🚗 🤖 🚗</div></body></html>` },
  { text: "2026年不懂Agent等于错过下一个风口！", html: `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#1a1a2e,#4a148c);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.i{font-size:72px}.y{font-size:80px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.h{font-size:44px;font-weight:700;color:#00FF88;margin-top:20px}</style></head><body><span class="i">🎯</span><div class="y">2026</div><div class="h">不懂Agent = 错过下一个<br>风口！</div></body></html>` },
  { text: "AI不会取代人，但会用AI的人会取代不会用AI的人", html: `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.h{font-size:40px;font-weight:700;text-align:center;line-height:2}.c1{color:#00D4FF}.c2{color:#FF6B6B}</style></head><body><div class="h"><span class="c1">AI不会取代人</span><br><br><span style="color:#888">但会用</span><span class="c2">AI的人</span><br><span style="color:#888">会取代</span><span class="c2">不会用AI的人</span></div></body></html>` },
  { text: "点赞收藏关注，下期讲如何用Agent搞钱！", html: `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.box{padding:40px 60px;background:linear-gradient(90deg,rgba(0,212,255,0.3),rgba(0,255,136,0.3));border:3px solid #00D4FF;border-radius:30px;text-align:center}.t{font-size:48px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.a{font-size:36px;margin-top:30px}.s{font-size:28px;color:#888;margin-top:20px}</style></head><body><div class="box"><div class="t">👍 点赞 📥 收藏 👋 关注</div><div class="a">下期讲如何用Agent搞钱！</div><div class="s">2026年一起搞钱！</div></div></body></html>` }
];

(async () => {
  // 1. 逐段生成语音，获取实际时长
  let totalDuration = 0;
  const durations = [];
  
  for (let i = 0; i < segments.length; i++) {
    const text = segments[i].text;
    execSync(`python3 -c "import edge_tts, asyncio; asyncio.run(edge_tts.Communicate('${text}', 'zh-CN-XiaoxiaoNeural').save('out/seg-${i}.mp3'))"`);
    
    // 获取该段语音的实际时长
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 out/seg-${i}.mp3`, { encoding: 'utf8' }).trim());
    durations.push(dur);
    totalDuration += dur;
    console.log(`✓ 段${i+1}: ${dur.toFixed(1)}秒`);
  }
  
  console.log(`\n总语音时长: ${totalDuration.toFixed(1)}秒\n`);
  
  // 2. 生成每段对应的图片（每段1帧）
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  
  for (let i = 0; i < segments.length; i++) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(segments[i].html);
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `out/img-${i}.png`, fullPage: true });
    await page.close();
    console.log(`✓ 图片${i+1}`);
  }
  await browser.close();
  
  // 3. 用concat生成视频，每帧持续对应语音时长
  // 创建每帧的持续时间文件
  let concatList = "";
  for (let i = 0; i < segments.length; i++) {
    concatList += `file 'out/img-${i}.png'\nduration ${durations[i]}\n`;
  }
  // 最后加一次最后一张图
  concatList += `file 'out/img-${segments.length-1}.png'`;
  
  fs.writeFileSync('out/ffmpeg-concat.txt', concatList);
  
  // 用concat demuxer合成，帧率设为1但通过duration控制每帧时长
  execSync(`ffmpeg -y -f concat -i out/ffmpeg-concat.txt -i out/seg-0.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -shortest out/demo-correct.mp4`, { stdio: 'ignore' });
  
  // 清理
  for (let i = 0; i < segments.length; i++) {
    try { fs.unlinkSync(`out/seg-${i}.mp3`); } catch {}
    try { fs.unlinkSync(`out/img-${i}.png`); } catch {}
  }
  try { fs.unlinkSync('out/ffmpeg-concat.txt'); } catch {}
  
  console.log("✓ 完成!");
  
  // 验证
  const info = execSync("ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 out/demo-correct.mp4", { encoding: 'utf8' }).trim();
  console.log(`视频时长: ${info}秒`);
})();
