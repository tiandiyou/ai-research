const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const fs = require('fs');

const videos = [
  { id: 1, title: "AI Agent 2026革命", t1: "90%的人还在用AI聊天", t2: "但只有1%的人在用AI Agent！", t3: "大模型是工具，Agent是员工！", cta: "👍点赞📥收藏👋关注" },
  { id: 2, title: "MCP协议革命", t1: "微软谷歌阿里腾讯全在抢", t2: "这就是MCP协议！", t3: "MCP就是AI的USB接口！", cta: "👍点赞📥收藏👋关注" },
  { id: 3, title: "AI编程真相", t1: "80%程序员慌了！", t2: "AI不会取代程序员", t3: "但会取代不会用AI的程序员！", cta: "👍点赞📥收藏👋关注" },
  { id: 4, title: "2026AI最大机会", t1: "不是大模型，不是Agent！", t2: "而是这个！你绝对想不到！", t3: "看懂趋势才能抓住红利！", cta: "👍点赞📥收藏👋关注" },
  { id: 5, title: "AI副业搞钱", t1: "每天2小时用AI做副业", t2: "月入3万块！", t3: "AI不会让你失业，但会AI的人会让你失业！", cta: "👍点赞📥收藏👋关注" },
  { id: 6, title: "Claude 4震撼发布", t1: "Claude 4发布", t2: "编程能力超越人类！", t3: "AI圈彻底炸锅！", cta: "👍点赞📥收藏👋关注" },
  { id: 7, title: "AI Agent入门指南", t1: "手把手教你用Agent", t2: "学会这3点效率提升10倍", t3: "第一步：选对工具", cta: "👍点赞📥收藏👋关注" },
  { id: 8, title: "RAG实战教程", t1: "RAG是什么？怎么做？", t2: "5分钟学会企业级RAG！", t3: "向量数据库+Embedding", cta: "👍点赞📥收藏👋关注" },
  { id: 9, title: "AI创业新风口", t1: "AI创业新风口来了！", t2: "这几个赛道普通人也能入！", t3: "AI应用开发|AI内容创作", cta: "👍点赞📥收藏👋关注" },
  { id: 10, title: "2026AI趋势预测", t1: "2026年AI圈10大预测！", t2: "Agent全面爆发|MCP生态统一", t3: "AI编程普及", cta: "👍点赞📥收藏👋关注" },
  { id: 11, title: "AI圈年度大事件", t1: "2026年AI圈发生大事！", t2: "ChatGPT 4.0|Claude 4", t3: "开源模型爆发", cta: "👍点赞📥收藏👋关注" }
];

const htmlTemplate = (v) => `<!DOCTYPE html>
<html><head>
<style>
body{margin:0;background:linear-gradient(135deg,#0A0A1A,#1A1A2E);color:#fff;font-family:Helvetica,sans-serif}
.slide{width:100%;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:40px;box-sizing:border-box}
.title{font-size:72px;color:#00D4FF;font-weight:bold;margin-bottom:30px;text-shadow:0 0 20px #00D4FF}
.text{font-size:36px;margin:15px 0}
.highlight{color:#FF6B6B;font-size:42px;font-weight:bold}
.sub{font-size:28px;color:#888;margin-top:20px}
.cta{font-size:32px;margin-top:40px;padding:20px;border:2px solid #00D4FF;border-radius:10px}
.slide{display:none}.slide:nth-child(1){display:flex}
</style>
</head>
<body>
<div class="slide"><div class="title">${v.title}</div></div>
<div class="slide"><div class="text">${v.t1}</div><div class="highlight">${v.t2}</div></div>
<div class="slide"><div class="text">${v.t3}</div></div>
<div class="slide"><div class="cta">${v.cta}</div></div>
</body></html>`;

async function generateVideo(v) {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  await page.setContent(htmlTemplate(v));
  
  for (let i = 0; i < 4; i++) {
    await page.evaluate((idx) => {
      const slides = document.querySelectorAll('.slide');
      slides.forEach((s, j) => s.style.display = j === idx ? 'flex' : 'none');
    }, i);
    await page.screenshot({ path: `out/f${v.id}-${i}.png`, fullPage: true });
  }
  
  try {
    execSync(`ffmpeg -y -framerate 1 -i out/f${v.id}-%d.png -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -r 30 -t 8 out/video-hq-${v.id}.mp4`, { stdio: 'ignore' });
    console.log(`✓ video-${v.id}.mp4`);
  } catch (e) {}
  
  // 清理帧
  for (let i = 0; i < 4; i++) {
    try { fs.unlinkSync(`out/f${v.id}-${i}.png`); } catch {}
  }
  
  await browser.close();
}

(async () => {
  for (const v of videos) {
    await generateVideo(v);
  }
  console.log("全部完成!");
})();
