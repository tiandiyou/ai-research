const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const fs = require('fs');

// 高质量Demo - 第1个视频
const video = {
  id: 1,
  title: "AI Agent 2026革命",
  texts: [
    "🔥 90%的人还在用AI聊天\n但只有1%的人在用AI Agent！",
    "💡 大模型是工具\nAgent是员工！",
    "⚡ 自动驾驶 vs 辅助驾驶\n差别就在这里！",
    "🎯 2026年\n不懂Agent = 错过下一个风口！",
    "💰 AI不会取代人\n但会用AI的人会取代不会用AI的人",
    "👍 点赞 📥 收藏 👋 关注\n下期讲如何用Agent搞钱！"
  ]
};

// 高质量HTML模板
const html = (text) => `<!DOCTYPE html>
<html><head>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Noto Sans SC', sans-serif;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  color: #fff;
  overflow: hidden;
}
/* 动态背景 */
.bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(0,212,255,0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,107,107,0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(0,212,255,0.05) 0%, transparent 70%);
  animation: bgMove 8s ease-in-out infinite;
}
@keyframes bgMove {
  0%,100%{transform:scale(1) rotate(0deg);}
  50%{transform:scale(1.1) rotate(5deg);}
}

/* 粒子效果 */
.particles {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
}
.particle {
  position: absolute;
  width: 4px; height: 4px;
  background: rgba(0,212,255,0.6);
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}
.particle:nth-child(1){top:10%;left:20%;animation-delay:0s;}
.particle:nth-child(2){top:20%;left:80%;animation-delay:1s;}
.particle:nth-child(3){top:80%;left:30%;animation-delay:2s;}
.particle:nth-child(4){top:60%;left:70%;animation-delay:0.5s;}
.particle:nth-child(5){top:40%;left:50%;animation-delay:1.5s;}
@keyframes float {
  0%,100%{transform:translateY(0) scale(1);opacity:0.6;}
  50%{transform:translateY(-30px) scale(1.5);opacity:1;}
}

/* 主容器 */
.container {
  position: relative;
  width: 100%; height: 100vh;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 60px;
  z-index: 10;
}
/* 标题 */
.title {
  font-size: 56px; font-weight: 900;
  background: linear-gradient(90deg, #00D4FF, #00FF88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 20px;
  animation: titlePulse 2s ease-in-out infinite;
  text-shadow: 0 0 40px rgba(0,212,255,0.3);
}
@keyframes titlePulse {
  0%,100%{transform:scale(1);}
  50%{transform:scale(1.02);}
}
/* 内容区 */
.content {
  font-size: 36px; font-weight: 700;
  text-align: center;
  line-height: 1.8;
  max-width: 800px;
}
/* 图标 */
.icon {
  font-size: 48px;
  margin-bottom: 20px;
  display: block;
  animation: iconBounce 1s ease-in-out infinite;
}
@keyframes iconBounce {
  0%,100%{transform:translateY(0);}
  50%{transform:translateY(-10px);}
}
/* 高亮 */
.highlight {
  color: #FF6B6B;
  display: block;
  margin: 10px 0;
}
/* CTA按钮 */
.cta-box {
  margin-top: 40px;
  padding: 30px 50px;
  background: linear-gradient(90deg, rgba(0,212,255,0.2), rgba(0,255,136,0.2));
  border: 2px solid rgba(0,212,255,0.5);
  border-radius: 20px;
  font-size: 28px;
  text-align: center;
  animation: ctaGlow 2s ease-in-out infinite;
}
@keyframes ctaGlow {
  0%,100%{box-shadow:0 0 20px rgba(0,212,255,0.3);}
  50%{box-shadow:0 0 40px rgba(0,212,255,0.6);}
}
/* 进入动画 */
.slide { opacity: 0; transform: translateY(30px); }
.slide.show { animation: slideIn 0.8s forwards; }
@keyframes slideIn {
  to { opacity: 1; transform: translateY(0); }
}
</style>
</head>
<body>
<div class="bg"></div>
<div class="particles">
  <div class="particle"></div><div class="particle"></div>
  <div class="particle"></div><div class="particle"></div>
  <div class="particle"></div>
</div>
<div class="container">
  <div class="slide">
    <span class="icon">🤖</span>
    <div class="title">AI Agent 2026革命</div>
    <div style="font-size:24px;color:#888;margin-top:20px;">2026必看 · 颠覆认知</div>
  </div>
</div>
</body></html>`;

const html2 = (text) => `<!DOCTYPE html>
<html><head>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Noto Sans SC', sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #fff;
  overflow: hidden;
}
.bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at 30% 70%, rgba(255,107,107,0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(0,212,255,0.1) 0%, transparent 50%);
  animation: bgMove 6s ease-in-out infinite;
}
@keyframes bgMove {
  0%,100%{transform:scale(1);}
  50%{transform:scale(1.05);}
}
.container {
  position: relative;
  width: 100%; height: 100vh;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 60px;
  z-index: 10;
}
.content {
  font-size: 40px; font-weight: 700;
  text-align: center;
  line-height: 2;
  max-width: 900px;
}
.highlight { color: #FF6B6B; }
.icon { font-size: 64px; display: block; margin-bottom: 30px; }
.slide { opacity: 0; transform: translateY(30px); }
.slide.show { animation: slideIn 0.8s forwards; }
@keyframes slideIn {
  to { opacity: 1; transform: translateY(0); }
}
</style>
</head>
<body>
<div class="bg"></div>
<div class="container">
  <div class="slide show">
    <span class="icon">🔥</span>
    <div class="content">
      <span class="highlight">90%的人还在用AI聊天</span><br>
      <span style="color:#888;">但只有</span><span class="highlight">1%</span><span style="color:#888;">的人在用AI Agent！</span>
    </div>
    <div style="font-size:28px;color:#00D4FF;margin-top:40px;">这是2026年最大的机会！</div>
  </div>
</div>
</body></html>`;

const html3 = (text) => `<!DOCTYPE html>
<html><head>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Noto Sans SC', sans-serif;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 100%);
  color: #fff;
  overflow: hidden;
}
.container {
  width: 100%; height: 100vh;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 60px;
}
.content {
  font-size: 44px; font-weight: 700;
  text-align: center;
  line-height: 2;
}
.icon { font-size: 72px; display: block; margin-bottom: 40px; }
.highlight { color: #00D4FF; }
.slide { animation: fadeIn 0.8s forwards; }
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
</head>
<body>
<div class="container">
  <div class="slide">
    <span class="icon">💡</span>
    <div class="content">
      <span class="highlight">大模型是工具</span><br>
      <span style="color:#888;">→</span><br>
      <span class="highlight">Agent是员工！</span>
    </div>
  </div>
</div>
</body></html>`;

const html4 = (text) => `<!DOCTYPE html>
<html><head>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Noto Sans SC', sans-serif;
  background: linear-gradient(135deg, #141E30 0%, #243B55 100%);
  color: #fff;
  overflow: hidden;
}
.container {
  width: 100%; height: 100vh;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 60px;
}
.content {
  font-size: 42px; font-weight: 700;
  text-align: center;
  line-height: 2;
}
.icon { font-size: 72px; display: block; margin-bottom: 40px; }
.highlight { color: #FF6B6B; }
.sub { color: #00D4FF; font-size: 32px; margin-top: 30px; }
.slide { animation: slideUp 0.8s forwards; }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
</head>
<body>
<div class="container">
  <div class="slide">
    <span class="icon">⚡</span>
    <div class="content">
      <span style="color:#888;">自动驾驶 vs 辅助驾驶</span><br>
      <span class="highlight">差别就在这里！</span>
    </div>
    <div class="sub">🚗 🤖 🚗</div>
  </div>
</div>
</body></html>`;

const html5 = (text) => `<!DOCTYPE html>
<html><head>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Noto Sans SC', sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #4a148c 50%, #1a1a2e 100%);
  color: #fff;
  overflow: hidden;
}
.container {
  width: 100%; height: 100vh;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 60px;
}
.content {
  font-size: 44px; font-weight: 700;
  text-align: center;
  line-height: 2;
}
.icon { font-size: 72px; display: block; margin-bottom: 40px; }
.highlight { color: #00FF88; }
.year { 
  font-size: 80px; font-weight: 900; 
  background: linear-gradient(90deg, #00D4FF, #00FF88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.slide { animation: zoomIn 0.8s forwards; }
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
</style>
</head>
<body>
<div class="container">
  <div class="slide">
    <span class="icon">🎯</span>
    <div class="content">
      <span class="year">2026</span><br>
      <span style="color:#888;">不懂</span><span class="highlight">Agent</span><br>
      <span style="color:#888;">= 错过下一个</span><span class="highlight">风口！</span>
    </div>
  </div>
</div>
</body></html>`;

const html6 = (text) => `<!DOCTYPE html>
<html><head>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Noto Sans SC', sans-serif;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  color: #fff;
  overflow: hidden;
}
.container {
  width: 100%; height: 100vh;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 60px;
}
.content {
  font-size: 40px; font-weight: 700;
  text-align: center;
  line-height: 2;
}
.highlight { color: #FF6B6B; }
.highlight2 { color: #00D4FF; }
.slide { animation: fadeIn 0.8s forwards; }
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
</head>
<body>
<div class="container">
  <div class="slide">
    <div class="content">
      <span class="highlight2">AI不会取代人</span><br><br>
      <span style="color:#888;">但会用</span><span class="highlight">AI的人</span><br>
      <span style="color:#888;">会取代</span><span class="highlight">不会用AI的人</span>
    </div>
  </div>
</div>
</body></html>`;

const html7 = (text) => `<!DOCTYPE html>
<html><head>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Noto Sans SC', sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  overflow: hidden;
}
.container {
  width: 100%; height: 100vh;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 60px;
}
.cta-box {
  padding: 40px 60px;
  background: linear-gradient(90deg, rgba(0,212,255,0.3), rgba(0,255,136,0.3));
  border: 3px solid #00D4FF;
  border-radius: 30px;
  text-align: center;
  animation: ctaPulse 2s infinite;
}
@keyframes ctaPulse {
  0%,100%{box-shadow:0 0 30px rgba(0,212,255,0.4);}
  50%{box-shadow:0 0 60px rgba(0,212,255,0.8);}
}
.title {
  font-size: 48px; font-weight: 900;
  background: linear-gradient(90deg, #00D4FF, #00FF88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.actions {
  font-size: 36px; margin-top: 30px;
}
.sub {
  font-size: 28px; color: #888; margin-top: 20px;
}
</style>
</head>
<body>
<div class="container">
  <div class="cta-box">
    <div class="title">👍 点赞 📥 收藏 👋 关注</div>
    <div class="actions">下期讲如何用Agent搞钱！</div>
    <div class="sub">2026年一起搞钱！</div>
  </div>
</div>
</body></html>`;

const templates = [html, html2, html3, html4, html5, html6, html7];

async function run() {
  // 生成语音
  const fullText = video.texts.join("。").replace(/\n/g, "");
  execSync(`python3 -c "import edge_tts, asyncio; asyncio.run(edge_tts.Communicate('${fullText}', 'zh-CN-XiaoxiaoNeural').save('out/demo-audio.mp3'))"`, { stdio: 'ignore' });
  console.log("✓ 语音生成");
  
  // 生成7帧
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });
  
  for (let i = 0; i < templates.length; i++) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(templates[i]());
    await page.waitForTimeout(500); // 等待动画
    await page.screenshot({ path: `out/demo-${i}.png`, fullPage: true });
    console.log(`✓ 帧${i+1}`);
  }
  await browser.close();
  
  // 合成视频 (7帧 x 8秒 = 56秒)
  execSync(`ffmpeg -y -framerate 1 -i out/demo-%d.png -i out/demo-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -shortest -c:a aac -t 56 out/demo-final.mp4`, { stdio: 'ignore' });
  
  // 清理
  for (let i = 0; i < templates.length; i++) {
    try { fs.unlinkSync(`out/demo-${i}.png`); } catch {}
  }
  try { fs.unlinkSync(`out/demo-audio.mp3`); } catch {}
  
  console.log("✓ Demo完成! 56秒高质量版本");
}

run();
