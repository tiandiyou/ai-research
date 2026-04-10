/**
 * Ralph视频生成框架
 * 包含自检和质量审查
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

// 视频文案配置
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

function qualityCheck(videoPath) {
  console.log("\n【质量审查】");
  console.log("═".repeat(40));
  
  if (!fs.existsSync(videoPath)) {
    console.log("❌ 文件不存在!");
    return false;
  }
  
  const stats = fs.statSync(videoPath);
  console.log(`📁 文件大小: ${(stats.size/1024/1024).toFixed(2)}MB`);
  
  try {
    const info = JSON.parse(execSync(`ffprobe -v error -show_entries format=duration -show_entries stream=width,height,codec_type -of json "${videoPath}"`, { encoding: 'utf8' }));
    
    const dur = parseFloat(info.format.duration);
    const videoStream = info.streams.find(s => s.codec_type === "video");
    const audioStream = info.streams.find(s => s.codec_type === "audio");
    
    console.log(`⏱️  时长: ${dur.toFixed(1)}秒`);
    console.log(`📐 分辨率: ${videoStream?.width || 0}x${videoStream?.height || 0}`);
    console.log(`🔊 音频: ${audioStream ? '✅ 有' : '❌ 无'}`);
    
    // 质量判定
    let pass = true;
    if (dur < 20) { console.log("⚠️ 时长过短"); pass = false; }
    if (!audioStream) { console.log("⚠️ 缺少音频"); pass = false; }
    if (!videoStream || videoStream.width < 720) { console.log("⚠️ 分辨率不足"); pass = false; }
    
    console.log(pass ? "\n✅ 质量通过" : "\n❌ 质量不通过");
    return pass;
  } catch (e) {
    console.log("❌ 无法读取视频信息");
    return false;
  }
}

(async () => {
  console.log("╔══════════════════════════════════════╗");
  console.log("║     Ralph 视频生成框架 v1.0          ║");
  console.log("╚══════════════════════════════════════╝\n");
  
  // ===== 步骤1: 生成完整语音 =====
  console.log("【步骤1】生成语音");
  const fullText = segments.map(s => s.text).join("。");
  execSync(`python3 -c "import edge_tts, asyncio; asyncio.run(edge_tts.Communicate('${fullText}', 'zh-CN-XiaoxiaoNeural').save('out/ralph-audio.mp3'))"`);
  
  const audioDuration = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 out/ralph-audio.mp3`, { encoding: 'utf8' }).trim());
  console.log(`  语音时长: ${audioDuration.toFixed(1)}秒`);
  
  // 关键修复：帧数 = floor(语音时长)，不是ceil
  const frameCount = Math.floor(audioDuration);
  console.log(`  帧数: ${frameCount}帧 (语音向下取整)\n`);
  
  // ===== 步骤2: 按时间点分配场景 =====
  console.log("【步骤2】场景时间分配");
  // 累积时间计算每个场景的起始帧
  const sceneTimes = [];
  let accumTime = 0;
  
  // 估算每段文字的相对时长比例
  const textLengths = segments.map(s => s.text.length);
  const totalLen = textLengths.reduce((a,b) => a+b, 0);
  
  for (let i = 0; i < segments.length; i++) {
    const ratio = textLengths[i] / totalLen;
    const startFrame = Math.floor(accumTime);
    const endFrame = Math.floor(accumTime + ratio * frameCount);
    sceneTimes.push({ start: startFrame, end: endFrame, index: i });
    accumTime += ratio * frameCount;
    console.log(`  段${i+1}: 帧${startFrame}-${endFrame}`);
  }
  console.log();
  
  // ===== 步骤3: 生成帧图片 =====
  console.log("【步骤3】生成帧图片");
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  
  for (let f = 0; f < frameCount; f++) {
    // 找到当前帧对应的场景
    let sceneIdx = 0;
    for (let s = 0; s < sceneTimes.length; s++) {
      if (f >= sceneTimes[s].start && f < sceneTimes[s].end) {
        sceneIdx = s;
        break;
      }
    }
    if (f >= sceneTimes[sceneTimes.length-1].end) sceneIdx = sceneTimes.length - 1;
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(segments[sceneIdx].html);
    await new Promise(r => setTimeout(r, 100));
    await page.screenshot({ path: `out/ralph-${f}.png`, fullPage: true });
    await page.close();
    
    if (f % 10 === 0) console.log(`  进度: ${f}/${frameCount}`);
  }
  await browser.close();
  console.log(`  完成: ${frameCount}帧\n`);
  
  // ===== 步骤4: 合成视频 =====
  console.log("【步骤4】合成视频");
  execSync(`ffmpeg -y -framerate 1 -i "out/ralph-%d.png" -i out/ralph-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -shortest out/ralph-final.mp4`, { stdio: 'ignore' });
  console.log("  视频合成完成\n");
  
  // ===== 步骤5: 质量审查 =====
  console.log("【步骤5】质量审查");
  const passed = qualityCheck("out/ralph-final.mp4");
  
  // 清理
  for (let i = 0; i < frameCount; i++) try{fs.unlinkSync(`out/ralph-${i}.png`)}catch{}
  try{fs.unlinkSync('out/ralph-audio.mp3')}catch{}
  
  console.log(passed ? "\n✅ 视频生成并通过质量审查!" : "\n❌ 需要重新生成");
})();
