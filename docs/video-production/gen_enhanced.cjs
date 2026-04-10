const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const fs = require('fs');

const videos = [
  { id: 1, title: "AI Agent 2026革命", 
    texts: [
      "90%的人还在用AI聊天，只有1%的人在用AI Agent！这是2026年最大的机会！",
      "大模型是工具，Agent是员工！自动驾驶vs辅助驾驶，差别就在这里！",
      "2026年，不懂Agent等于错过下一个风口！记住这句话，你就懂了！",
      "AI不会取代人，但会用AI的人会取代不会用AI的人！月入3万真的难吗？",
      "关注我，下期讲如何用Agent搞钱！"
    ]},
  { id: 2, title: "MCP协议革命",
    texts: [
      "微软谷歌阿里腾讯全在抢的东西！这就是MCP协议，今天一次讲清楚！",
      "MCP就是AI的USB接口！一次开发，处处运行！打破数据孤岛！",
      "未来不会MCP，就像20年前不会用电脑！生态统一已成定局！",
      "月入5万不是梦，MCP开发者正在被疯抢！早入场就是优势！",
      "点赞收藏关注，下期手把手教你写MCP！"
    ]},
  { id: 3, title: "AI编程真相",
    texts: [
      "80%程序员慌了！AI编程爆火3个月，程序员到底该怎么办？",
      "AI不会取代程序员，但会取代不会用AI的程序员！这就是真相！",
      "记住：未来属于会提问的人，不会提问就等于不会用AI！",
      "月入5万的程序员，都在用AI！打造个人AI工作流，效率翻10倍！",
      "点赞收藏关注，下期教你打造AI工作流！"
    ]},
  { id: 4, title: "2026AI最大机会",
    texts: [
      "2026年AI圈最大机会，不是大模型，不是Agent！而是这个！你绝对想不到！",
      "看懂趋势才能抓住红利！90%的人还没意识到这个机会！",
      "现在入场，你就能超过90%的人！记住这三点，你就赢了！",
      "2026年AI圈第一波红利，错过再等10年！",
      "点赞收藏关注，下期告诉你答案！"
    ]},
  { id: 5, title: "AI副业搞钱",
    texts: [
      "80%上班族慌了！每天2小时用AI做副业，月入3万块！看完你也行！",
      "AI不会让你失业，但会AI的人会让你失业！零成本启动！",
      "时间灵活，市场需求大！AI代写、AI短视频、AI设计！",
      "现在行动，就能超过80%的人！学会用AI，收入翻倍！",
      "点赞收藏关注，下期手把手教你做AI副业！"
    ]},
  { id: 6, title: "Claude 4震撼发布",
    texts: [
      "Claude 4发布，编程能力超越人类！AI圈彻底炸锅了！",
      "这意味着什么？AI编程进入新时代！学会用AI，年薪百万不是梦！",
      "Claude 4 vs GPT-4，谁更强？实测结果让人震惊！",
      "AI工具爆发，学会用AI就是核心竞争力！",
      "点赞收藏关注，锁死我的频道！"
    ]},
  { id: 7, title: "AI Agent入门指南",
    texts: [
      "手把手教你用AI Agent！学会这3点，效率提升10倍！",
      "第一步：选择合适的Agent工具！Cursor、Devin如何选？",
      "第二步：构建自己的工作流！自动化处理重复任务！",
      "第三步：持续优化和迭代！打造个人AI助手！",
      "点赞收藏关注，立即行动！"
    ]},
  { id: 8, title: "RAG实战教程",
    texts: [
      "RAG是什么？怎么做？5分钟学会企业级RAG实战！",
      "向量数据库选择：Chroma、Pinecone、Milvus哪个好？",
      "Embedding优化：如何让搜索更准确？效果评估方法！",
      "RAG是AI落地的核心技术，学会它就等于掌握了AI应用密码！",
      "点赞收藏关注，收藏起来慢慢学！"
    ]},
  { id: 9, title: "AI创业新风口",
    texts: [
      "AI创业新风口来了！这几个赛道普通人也能入！",
      "AI应用开发：SaaS工具、企业服务！",
      "AI智能硬件：AI手机、AI眼镜！",
      "AI内容创作：短视频、自媒体！AI教育服务！月入10万不是梦！",
      "点赞收藏关注，创业路上一起！"
    ]},
  { id: 10, title: "2026AI趋势预测",
    texts: [
      "2026年AI圈10大预测！Agent全面爆发，MCP生态统一！",
      "AI编程普及：人人都会写代码！",
      "多模态进化：AI能看能听能说！",
      "这些趋势你必须知道！错过再等10年！",
      "点赞收藏关注，趋势决定命运！"
    ]},
  { id: 11, title: "AI圈年度大事件",
    texts: [
      "2026年AI圈发生大事！ChatGPT 4.0、Claude 4、Copilot全面爆发！",
      "开源模型爆发：Llama 4、Mistral谁来统治？",
      "这一年AI圈发生了什么？资本疯狂涌入！",
      "未来会怎样？AI将改变所有行业！",
      "点赞收藏关注，持续关注不迷路！"
    ]}
];

const html = (v, idx) => `<!DOCTYPE html>
<html><head>
<style>
body{margin:0;background:linear-gradient(135deg,#0A0A1A,#1A1A2E);color:#fff;font-family:'PingFang SC',Helvetica,sans-serif}
.slide{width:100%;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:60px 40px;box-sizing:border-box}
.title{font-size:64px;color:#00D4FF;font-weight:bold;margin-bottom:40px;text-shadow:0 0 30px rgba(0,212,255,0.5)}
.text{font-size:32px;margin:20px 0;line-height:1.6}
.highlight{color:#FF6B6B;font-size:36px;font-weight:bold}
.sub{font-size:24px;color:#888;margin-top:30px}
.cta{font-size:28px;margin-top:50px;padding:25px 40px;border:3px solid #00D4FF;border-radius:15px;background:rgba(0,212,255,0.1)}
.slide{display:none}.slide:nth-child(1){display:flex}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
.title{animation:pulse 2s infinite}
</style>
</head>
<body>
<div class="slide"><div class="title">${v.title}</div><div class="sub">2026必看</div></div>
<div class="slide"><div class="highlight">${v.texts[0]}</div></div>
<div class="slide"><div class="text">${v.texts[1]}</div></div>
<div class="slide"><div class="text">${v.texts[2]}</div></div>
<div class="slide"><div class="highlight">${v.texts[3]}</div></div>
<div class="slide"><div class="cta">${v.texts[4]}<br><br>👍点赞 📥收藏 👋关注</div></div>
</body></html>`;

async function run(v) {
  // 生成6帧，每帧8秒 = 48秒视频
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1080, height: 1920 });
  await p.setContent(html(v));
  
  for (let i = 0; i < 6; i++) {
    await p.evaluate(x => document.querySelectorAll('.slide').forEach((s, j) => s.style.display = j === x ? 'flex' : 'none'), i);
    await p.screenshot({ path: `out/enhance-${v.id}-${i}.png`, fullPage: true });
  }
  await b.close();
  
  // 48秒视频 @ 1fps = 48帧，合成
  execSync(`ffmpeg -y -framerate 1 -i out/enhance-${v.id}-%d.png -i out/audio-${v.id}.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -shortest -c:a aac -t 48 out/video-enhanced-${v.id}.mp4`, { stdio: 'ignore' });
  
  // 清理
  for (let i = 0; i < 6; i++) { try { fs.unlinkSync(`out/enhance-${v.id}-${i}.png`) } catch {} }
  console.log(`✓ ${v.id} (48秒)`);
}

(async () => {
  // 先生成语音
  const { execSync } = require('child_process');
  for (const v of videos) {
    const fullText = v.texts.join("。");
    execSync(`python3 -c "import edge_tts, asyncio; asyncio.run(edge_tts.Communicate('${fullText}', 'zh-CN-XiaoxiaoNeural').save('out/audio-${v.id}.mp3'))"`, { stdio: 'ignore' });
    console.log(`✓ 语音-${v.id}`);
  }
  
  // 生成视频
  for (const v of videos) await run(v);
  console.log("全部完成! 48秒版本");
})();
