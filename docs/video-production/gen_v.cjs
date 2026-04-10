const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const fs = require('fs');

const videos = [
  { id: 3, title: "AI编程真相", texts: ["80%程序员慌了！AI编程爆火3个月，程序员到底该怎么办？", "AI不会取代程序员，但会取代不会用AI的程序员！", "月入5万的程序员，都在用AI！"] },
  { id: 4, "title": "2026AI最大机会", texts: ["2026年AI圈最大机会，不是大模型，不是Agent！而是这个！", "看懂趋势才能抓住红利！90%的人还没意识到！", "记住这三点，你就超过了90%的人！"] },
  { id: 5, "title": "AI副业搞钱", texts: ["每天2小时用AI做副业，月入3万块！", "AI不会让你失业，但会AI的人会让你失业！", "现在行动，就能超过80%的人！"] },
];

const html = (v) => `<html><head><style>
body{margin:0;background:linear-gradient(135deg,#0A0A1A,#1A1A2E);color:#fff;font-family:Helvetica}
.slide{width:100%;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:40px}
.title{font-size:72px;color:#00D4FF;font-weight:bold;margin-bottom:30px}
.text{font-size:36px;margin:15px 0}
.highlight{color:#FF6B6B;font-size:42px;font-weight:bold}
.cta{font-size:32px;margin-top:40px;padding:20px;border:2px solid #00D4FF;border-radius:10px}
.slide{display:none}.slide:nth-child(1){display:flex}
</style></head><body>
<div class="slide"><div class="title">${v.title}</div></div>
<div class="slide"><div class="highlight">${v.texts[0]}</div></div>
<div class="slide"><div class="text">${v.texts[1]}</div></div>
<div class="slide"><div class="cta">${v.texts[2]}</div></div>
</body></html>`;

async function run(v) {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1080, height: 1920 });
  await p.setContent(html(v));
  for (let i = 0; i < 4; i++) {
    await p.evaluate(x => document.querySelectorAll('.slide').forEach((s, j) => s.style.display = j === x ? 'flex' : 'none'), i);
    await p.screenshot({ path: `out/f${v.id}-${i}.png`, fullPage: true });
  }
  await b.close();
  execSync(`ffmpeg -y -framerate 1 -i out/f${v.id}-%d.png -i out/audio-${v.id}.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -shortest -c:a aac out/video-with-audio-${v.id}.mp4`, { stdio: 'ignore' });
  for (let i = 0; i < 4; i++) { try { fs.unlinkSync(`out/f${v.id}-${i}.png`) } catch {} }
  console.log(`✓ ${v.id}`);
}

(async () => {
  for (const v of videos) await run(v);
  console.log("完成!");
})();
