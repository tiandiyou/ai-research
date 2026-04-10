const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const fs = require('fs');

const videos = [
  { id: 6, title: "Claude 4震撼发布", texts: ["Claude 4发布，编程能力超越人类！AI圈彻底炸锅了！", "这意味着什么？AI编程进入新时代！", "点赞收藏关注，锁死我的频道！"] },
  { id: 7, title: "AI Agent入门指南", texts: ["手把手教你用AI Agent！学会这3点，效率提升10倍！", "第一步：选择合适的Agent工具！第二步：构建工作流！", "点赞收藏关注，立即行动！"] },
  { id: 8, title: "RAG实战教程", texts: ["RAG是什么？怎么做？5分钟学会企业级RAG！", "向量数据库选择，Embedding优化！", "点赞收藏关注，收藏起来慢慢学！"] },
  { id: 9, title: "AI创业新风口", texts: ["AI创业新风口来了！这几个赛道普通人也能入！", "AI应用开发，AI内容创作！月入10万不是梦！", "点赞收藏关注，创业路上一起！"] },
  { id: 10, title: "2026AI趋势预测", texts: ["2026年AI圈10大预测！Agent全面爆发！", "这些趋势你必须知道！错过再等10年！", "点赞收藏关注，趋势决定命运！"] },
  { id: 11, title: "AI圈年度大事件", texts: ["2026年AI圈发生大事！ChatGPT 4.0发布！", "开源模型爆发！这一年AI圈发生了什么？", "点赞收藏关注，持续关注不迷路！"] },
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
  console.log("全部完成!");
})();
