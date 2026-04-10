const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

// 7段文案和对应HTML
const segments = [
  { text: "AI Agent 2026革命", 
    html: `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.t{font-size:56px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.s{font-size:24px;color:#888;margin-top:20px}</style></head><body><div class="t">AI Agent 2026革命</div><div class="s">2026必看 · 颠覆认知</div></body></html>` },
  { text: "90%的人还在用AI聊天，但只有1%的人在用AI Agent！这是2026年最大的机会！", 
    html: `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.i{font-size:64px}.h{font-size:40px;font-weight:700;text-align:center;line-height:2;color:#FF6B6B}.s{font-size:28px;color:#00D4FF;margin-top:40px}</style></head><body><span class="i">🔥</span><div class="h">90%的人还在用AI聊天<br>但只有<span style="font-size:60px">1%</span>的人在用AI Agent！</div><div class="s">这是2026年最大的机会！</div></body></html>` },
  { text: "大模型是工具，Agent是员工！", 
    html: `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.i{font-size:72px}.h{font-size:44px;font-weight:700;text-align:center;line-height:2;color:#00D4FF}</style></head><body><span class="i">💡</span><div class="h">大模型是工具<br>→<br>Agent是员工！</div></body></html>` },
  { text: "自动驾驶 versus 辅助驾驶，差别就在这里！", 
    html: `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#141E30,#243B55);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.i{font-size:72px}.h{font-size:42px;font-weight:700;text-align:center;line-height:2;color:#FF6B6B}.s{color:#00D4FF;font-size:32px;margin-top:30px}</style></head><body><span class="i">⚡</span><div class="h">自动驾驶 vs 辅助驾驶<br>差别就在这里！</div><div class="s">🚗 🤖 🚗</div></body></html>` },
  { text: "2026年不懂Agent等于错过下一个风口！", 
    html: `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#1a1a2e,#4a148c);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.i{font-size:72px}.y{font-size:80px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.h{font-size:44px;font-weight:700;color:#00FF88;margin-top:20px}</style></head><body><span class="i">🎯</span><div class="y">2026</div><div class="h">不懂Agent = 错过下一个<br>风口！</div></body></html>` },
  { text: "AI不会取代人，但会用AI的人会取代不会用AI的人", 
    html: `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.h{font-size:40px;font-weight:700;text-align:center;line-height:2}.c1{color:#00D4FF}.c2{color:#FF6B6B}</style></head><body><div class="h"><span class="c1">AI不会取代人</span><br><br><span style="color:#888">但会用</span><span class="c2">AI的人</span><br><span style="color:#888">会取代</span><span class="c2">不会用AI的人</span></div></body></html>` },
  { text: "点赞收藏关注，下期讲如何用Agent搞钱！", 
    html: `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');*{margin:0;padding:0}body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}.box{padding:40px 60px;background:linear-gradient(90deg,rgba(0,212,255,0.3),rgba(0,255,136,0.3));border:3px solid #00D4FF;border-radius:30px;text-align:center}.t{font-size:48px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.a{font-size:36px;margin-top:30px}.s{font-size:28px;color:#888;margin-top:20px}</style></head><body><div class="box"><div class="t">👍 点赞 📥 收藏 👋 关注</div><div class="a">下期讲如何用Agent搞钱！</div><div class="s">2026年一起搞钱！</div></div></body></html>` }
];

(async () => {
  // ===== 自检流程 =====
  console.log("===== 视频生成自检流程 =====\n");
  
  // 步骤1: 逐段生成语音，获取实际时长
  console.log("【步骤1】逐段生成语音，获取实际时长");
  const durations = [];
  let totalAudio = 0;
  
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 -c "import edge_tts, asyncio; asyncio.run(edge_tts.Communicate('${segments[i].text}', 'zh-CN-XiaoxiaoNeural').save('out/s-${i}.mp3'))"`);
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 out/s-${i}.mp3`, { encoding: 'utf8' }).trim());
    durations.push(Math.ceil(dur)); // 向上取整作为帧数
    totalAudio += dur;
    console.log(`  段${i+1}: "${segments[i].text.substring(0,20)}..." → ${dur.toFixed(1)}秒 → ${Math.ceil(dur)}帧`);
  }
  
  console.log(`\n  总语音时长: ${totalAudio.toFixed(1)}秒`);
  console.log(`  总帧数: ${durations.reduce((a,b)=>a+b,0)}帧`);
  
  // 步骤2: 验证帧数与语音匹配
  console.log("\n【步骤2】验证帧数与语音匹配");
  const totalFrames = durations.reduce((a,b)=>a+b,0);
  console.log(`  帧数=${totalFrames}帧, 语音=${totalAudio.toFixed(1)}秒, 匹配=${totalFrames === Math.ceil(totalAudio) ? '✅' : '⚠️需调整'}`);
  
  // 步骤3: 生成每段对应帧数的图片
  console.log("\n【步骤3】生成图片（按实际时长分配）");
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  
  let frameIdx = 0;
  for (let segIdx = 0; segIdx < segments.length; segIdx++) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(segments[segIdx].html);
    await new Promise(r => setTimeout(r, 300));
    
    // 该段生成durations[segIdx]帧
    for (let f = 0; f < durations[segIdx]; f++) {
      await page.screenshot({ path: `out/frame-${frameIdx}.png`, fullPage: true });
      frameIdx++;
    }
    await page.close();
    console.log(`  段${segIdx+1}: ${durations[segIdx]}帧`);
  }
  await browser.close();
  console.log(`  共${frameIdx}帧图片`);
  
  // 步骤4: 合并语音
  console.log("\n【步骤4】合并所有语音为一段");
  let concatList = "";
  for (let i = 0; i < segments.length; i++) {
    concatList += `file 'out/s-${i}.mp3'\n`;
  }
  fs.writeFileSync('out/audio-list.txt', concatList);
  execSync(`ffmpeg -y -f concat -i out/audio-list.txt -c copy out/combined-audio.mp3`, { stdio: 'ignore' });
  
  const finalAudioDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 out/combined-audio.mp3`, { encoding: 'utf8' }).trim());
  console.log(`  合并后语音时长: ${finalAudioDur.toFixed(1)}秒`);
  
  // 步骤5: 合成视频
  console.log("\n【步骤5】合成视频");
  execSync(`ffmpeg -y -framerate 1 -i "out/frame-%d.png" -i out/combined-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -shortest out/demo-perfect.mp4`, { stdio: 'ignore' });
  
  // 步骤6: 自检验证
  console.log("\n【步骤6】自检验证");
  const videoDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 out/demo-perfect.mp4`, { encoding: 'utf8' }).trim());
  const match = Math.abs(videoDur - finalAudioDur) < 0.5;
  
  console.log(`  视频时长: ${videoDur.toFixed(1)}秒`);
  console.log(`  语音时长: ${finalAudioDur.toFixed(1)}秒`);
  console.log(`  同步状态: ${match ? '✅ 同步' : '❌ 不同步'}`);
  
  // 清理
  for (let i = 0; i < frameIdx; i++) {
    try { fs.unlinkSync(`out/frame-${i}.png`); } catch {}
  }
  for (let i = 0; i < segments.length; i++) {
    try { fs.unlinkSync(`out/s-${i}.mp3`); } catch {}
  }
  try { fs.unlinkSync('out/audio-list.txt'); } catch {}
  try { fs.unlinkSync('out/combined-audio.mp3'); } catch {}
  
  console.log("\n===== 完成! =====");
})();
