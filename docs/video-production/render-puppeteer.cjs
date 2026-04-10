const puppeteer = require('puppeteer');
const { execSync } = require('child_process');

async function render() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  
  const html = `<!DOCTYPE html>
<html><head>
<style>
body{margin:0;background:#0A0A1A;color:#fff;font-family:Helvetica,sans-serif}
.slide{width:100%;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
.title{font-size:80px;color:#00D4FF;font-weight:bold}
.subtitle{font-size:40px;margin-top:20px}
.highlight{color:#FF6B6B;font-size:50px;margin:20px 0}
.cta{font-size:35px;margin-top:50px}
.slide{display:none}.slide:nth-child(1){display:flex}
</style>
</head>
<body>
<div class="slide"><div class="title">AI Agent 2026革命</div></div>
<div class="slide">
<div>90%的人还在用AI聊天</div>
<div class="highlight">但只有1%的人在用AI Agent！</div>
</div>
<div class="slide">
<div>大模型是工具</div>
<div class="highlight">Agent是员工！</div>
<div class="subtitle">这就是本质区别</div>
</div>
<div class="slide"><div class="cta">👍 点赞 📥 收藏 👋 关注<br>下期讲如何用Agent搞钱</div></div>
</body></html>`;

  await page.setContent(html);
  
  // 截图4帧
  for (let i = 0; i < 4; i++) {
    await page.evaluate((idx) => {
      const slides = document.querySelectorAll('.slide');
      slides.forEach((s, j) => s.style.display = j === idx ? 'flex' : 'none');
    }, i);
    await page.screenshot({ path: `out/frame-${i}.png`, fullPage: true });
  }
  
  // 合成视频
  execSync('ffmpeg -y -framerate 1 -i out/frame-%d.png -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -r 30 -t 8 out/video-final.mp4', { stdio: 'inherit' });
  
  console.log('视频生成完成! video-final.mp4');
  await browser.close();
}

render().catch(console.error);
