const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const fs = require('fs');

// 7帧，每帧对应一段语音，总共56秒语音
// 所以每帧应该是 56/7 = 8秒

const templates = [
  () => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);color:#fff;overflow:hidden}
.bg{position:fixed;inset:0;background:radial-gradient(circle at 20%80%,rgba(0,212,255,0.15)0,transparent 50%),radial-gradient(circle at 80%20%,rgba(255,107,107,0.1)0,transparent 50%);animation:bgMove 8s ease-in-out infinite}
@keyframes bgMove{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
.p{position:absolute;width:4px;height:4px;background:rgba(0,212,255,0.6);border-radius:50%;animation:float 3s ease-in-out infinite}
.p:nth-child(1){top:10%;left:20%}.p:nth-child(2){top:20%;left:80%;animation-delay:1s}.p:nth-child(3){top:80%;left:30%;animation-delay:2s}.p:nth-child(4){top:60%;left:70%;animation-delay:0.5s}
@keyframes float{0%,100%{transform:translateY(0);opacity:0.6}50%{transform:translateY(-30px);opacity:1}}
.c{position:relative;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px;z-index:10}
.t{font-size:56px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-align:center;margin-bottom:20px;animation:titlePulse 2s ease-in-out infinite}
@keyframes titlePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
.s{font-size:24px;color:#888;margin-top:20px}
</style></head><body><div class="bg"></div><div class="p"></div><div class="p"></div><div class="p"></div><div class="p"></div><div class="c"><div class="t">AI Agent 2026革命</div><div class="s">2026必看 · 颠覆认知</div></div></body></html>`,
  () => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);color:#fff;overflow:hidden}
.bg{position:fixed;inset:0;background:radial-gradient(circle at 30%70%,rgba(255,107,107,0.15)0,transparent 50%),radial-gradient(circle at 70%30%,rgba(0,212,255,0.1)0,transparent 50%)}
.c{height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px}
.i{font-size:64px;margin-bottom:30px;display:block}
.h{font-size:40px;font-weight:700;text-align:center;line-height:2;color:#FF6B6B}
.s{font-size:28px;color:#00D4FF;margin-top:40px}
</style></head><body><div class="bg"></div><div class="c"><span class="i">🔥</span><div class="h">90%的人还在用AI聊天<br>但只有<span style="font-size:60px">1%</span>的人在用AI Agent！</div><div class="s">这是2026年最大的机会！</div></div></body></html>`,
  () => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63);color:#fff;overflow:hidden}
.c{height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px}
.i{font-size:72px;margin-bottom:40px;display:block}
.h{font-size:44px;font-weight:700;text-align:center;line-height:2;color:#00D4FF}
</style></head><body><div class="c"><span class="i">💡</span><div class="h">大模型是工具<br>→<br>Agent是员工！</div></div></body></html>`,
  () => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#141E30,#243B55);color:#fff;overflow:hidden}
.c{height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px}
.i{font-size:72px;margin-bottom:40px;display:block}
.h{font-size:42px;font-weight:700;text-align:center;line-height:2;color:#FF6B6B}
.s{color:#00D4FF;font-size:32px;margin-top:30px}
</style></head><body><div class="c"><span class="i">⚡</span><div class="h">自动驾驶 vs 辅助驾驶<br>差别就在这里！</div><div class="s">🚗 🤖 🚗</div></div></body></html>`,
  () => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#1a1a2e,#4a148c,#1a1a2e);color:#fff;overflow:hidden}
.c{height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px}
.i{font-size:72px;margin-bottom:40px;display:block}
.y{font-size:80px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.h{font-size:44px;font-weight:700;color:#00FF88;margin-top:20px}
</style></head><body><div class="c"><span class="i">🎯</span><div class="y">2026</div><div class="h">不懂Agent = 错过下一个风口！</div></div></body></html>`,
  () => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);color:#fff;overflow:hidden}
.c{height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px}
.h{font-size:40px;font-weight:700;text-align:center;line-height:2}
.c1{color:#00D4FF}.c2{color:#FF6B6B}
</style></head><body><div class="c"><div class="h"><span class="c1">AI不会取代人</span><br><br><span style="color:#888">但会用</span><span class="c2">AI的人</span><br><span style="color:#888">会取代</span><span class="c2">不会用AI的人</span></div></div></body></html>`,
  () => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans SC',sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;overflow:hidden}
.c{height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px}
.box{padding:40px 60px;background:linear-gradient(90deg,rgba(0,212,255,0.3),rgba(0,255,136,0.3));border:3px solid #00D4FF;border-radius:30px;text-align:center;animation:ctaPulse 2s infinite}
@keyframes ctaPulse{0%,100%{box-shadow:0 0 30px rgba(0,212,255,0.4)}50%{box-shadow:0 0 60px rgba(0,212,255,0.8)}}
.t{font-size:48px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.a{font-size:36px;margin-top:30px}
.s{font-size:28px;color:#888;margin-top:20px}
</style></head><body><div class="c"><div class="box"><div class="t">👍 点赞 📥 收藏 👋 关注</div><div class="a">下期讲如何用Agent搞钱！</div><div class="s">2026年一起搞钱！</div></div></div></body></html>`
];

// 文案和时长分配（总56秒）
const segments = [
  { text: "AI Agent 2026革命", duration: 8 },      // 0-8秒
  { text: "90%的人还在用AI聊天，但只有1%的人在用AI Agent！这是2026年最大的机会！", duration: 8 },  // 8-16秒
  { text: "大模型是工具，Agent是员工！", duration: 8 },  // 16-24秒
  { text: "自动驾驶 vs 辅助驾驶，差别就在这里！", duration: 8 },  // 24-32秒
  { text: "2026年不懂Agent等于错过下一个风口！", duration: 8 },  // 32-40秒
  { text: "AI不会取代人，但会用AI的人会取代不会用AI的人", duration: 8 },  // 40-48秒
  { text: "点赞收藏关注，下期讲如何用Agent搞钱！", duration: 8 }   // 48-56秒
];

async function run() {
  // 1. 逐段生成语音
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 -c "import edge_tts, asyncio; asyncio.run(edge_tts.Communicate('${segments[i].text}', 'zh-CN-XiaoxiaoNeural').save('out/seg-${i}.mp3'))"`, { stdio: 'ignore' });
    console.log(`✓ 语音段${i+1}`);
  }
  
  // 2. 合并所有语音为一段
  const list = segments.map((_, i) => `file 'out/seg-${i}.mp3'`).join('\n');
  fs.writeFileSync('out/segments.txt', list);
  execSync('ffmpeg -y -f concat -safe 0 -i out/segments.txt -c copy out/combined-audio.mp3', { stdio: 'ignore' });
  console.log("✓ 语音合并");
  
  // 3. 为每帧生成对应时长的图片
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (let i = 0; i < templates.length; i++) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(templates[i]());
    await new Promise(r => setTimeout(r, 500));
    
    // 复制该帧多次，每帧持续duration秒
    for (let j = 0; j < segments[i].duration; j++) {
      await page.screenshot({ path: `out/frame-${i}-${j}.png`, fullPage: true });
    }
    console.log(`✓ 帧${i+1} x ${segments[i].duration}秒`);
  }
  await browser.close();
  
  // 4. 用恒定帧率合成视频
  execSync(`ffmpeg -y -framerate 1 -i "out/frame-%d.png" -i out/combined-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac out/demo-v2.mp4`, { stdio: 'ignore' });
  console.log("✓ 视频合成");
  
  // 清理
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 8; j++) try{fs.unlinkSync(`out/frame-${i}-${j}.png`)}catch{}
    try{fs.unlinkSync(`out/seg-${i}.mp3`)}catch{}
  }
  try{fs.unlinkSync('out/segments.txt')}catch{}
  try{fs.unlinkSync('out/combined-audio.mp3')}catch{}
  
  console.log("✓ 完成! 56秒同步版");
}

run();
