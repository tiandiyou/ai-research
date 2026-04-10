const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const fs = require('fs');

const videos = [
  { id: 1, title: "AI Agent 2026革命", texts: ["90%的人还在用AI聊天，但只有1%的人在用AI Agent！这就是2026年最大的机会！", "大模型是工具，Agent是员工！这就是本质区别！", "AI不会取代人，但会用AI的人会取代不会用AI的人！"] },
  { id: 2, title: "MCP协议革命", texts: ["微软谷歌阿里腾讯全在抢的东西！这就是MCP协议！", "MCP就是AI的USB接口！记住这句话你就懂了！", "月入5万不是梦，MCP开发者正在被疯抢！"] },
];

const htmlTemplate = (v) => `<!DOCTYPE html>
<html><head>
<style>
body{margin:0;background:linear-gradient(135deg,#0A0A1A,#1A1A2E);color:#fff;font-family:Helvetica,sans-serif}
.slide{width:100%;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:40px}
.title{font-size:72px;color:#00D4FF;font-weight:bold;margin-bottom:30px;text-shadow:0 0 20px #00D4FF}
.text{font-size:36px;margin:15px 0}
.highlight{color:#FF6B6B;font-size:42px;font-weight:bold}
.cta{font-size:32px;margin-top:40px;padding:20px;border:2px solid #00D4FF;border-radius:10px}
.slide{display:none}.slide:nth-child(1){display:flex}
</style>
</head>
<body>
<div class="slide"><div class="title">${v.title}</div></div>
<div class="slide"><div class="highlight">${v.texts[0]}</div></div>
<div class="slide"><div class="text">${v.texts[1]}</div></div>
<div class="slide"><div class="cta">${v.texts[2]}</div></div>
</body></html>`;

async function renderVideo(v) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  await page.setContent(htmlTemplate(v));
  
  for (let i = 0; i < 4; i++) {
    await page.evaluate(idx => {
      document.querySelectorAll('.slide').forEach((s, j) => s.style.display = j === idx ? 'flex' : 'none');
    }, i);
    await page.screenshot({ path: `out/f${v.id}-${i}.png`, fullPage: true });
  }
  await browser.close();
  
  // 合并视频+音频
  execSync(`ffmpeg -y -framerate 1 -i out/f${v.id}-%d.png -i out/audio-${v.id}.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -shortest -c:a aac out/video-with-audio-${v.id}.mp4`, { stdio: 'ignore' });
  
  // 清理
  for (let i = 0; i < 4; i++) {
    try { fs.unlinkSync(`out/f${v.id}-${i}.png`); } catch {}
  }
  try { fs.unlinkSync(`out/audio-${v.id}.mp3`); } catch {}
  
  console.log(`✓ video-${v.id}`);
}

(async () => {
  for (const v of videos) {
    await renderVideo(v);
  }
  console.log("全部完成!");
})();
