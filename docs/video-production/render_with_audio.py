import edge_tts
import asyncio
import subprocess
import os

videos = [
    {"id": 1, "title": "AI Agent 2026革命",
     "texts": ["90%的人还在用AI聊天，但只有1%的人在用AI Agent！这就是2026年最大的机会！",
              "大模型是工具，Agent是员工！这就是本质区别！记住这句话，你就懂了！",
              "AI不会取代人，但会用AI的人会取代不会用AI的人！月入3万真的难吗？"]},
    {"id": 2, "title": "MCP协议革命",
     "texts": ["微软谷歌阿里腾讯全在抢的东西！这就是MCP协议！今天一次讲清楚！",
              "MCP就是AI的USB接口！记住这句话你就懂了！未来不会MCP，就像20年前不会用电脑！",
              "月入5万不是梦，MCP开发者正在被疯抢！"]},
    {"id": 3, "title": "AI编程真相",
     "texts": ["80%程序员慌了！AI编程爆火3个月，程序员到底该怎么办？",
              "AI不会取代程序员，但会取代不会用AI的程序员！记住：未来属于会提问的人！",
              "月入5万的程序员，都在用AI！你在干什么？"]},
    {"id": 4, "title": "2026AI最大机会",
     "texts": ["2026年AI圈最大机会，不是大模型，不是Agent！而是这个！你绝对想不到！",
              "看懂趋势才能抓住红利！90%的人还没意识到这个机会！现在入场，你就能超过90%的人！",
              "记住这三点，你就超过了90%的人！"]},
    {"id": 5, "title": "AI副业搞钱",
     "texts": ["80%上班族慌了！每天2小时用AI做副业，月入3万块！看完这个视频你也行！",
              "AI不会让你失业，但会AI的人会让你失业！零成本启动，时间灵活，市场需求大！",
              "现在行动，就能超过80%的人！"]},
    {"id": 6, "title": "Claude 4震撼发布",
     "texts": ["Claude 4发布，编程能力超越人类！AI圈彻底炸锅了！",
              "这意味着什么？AI编程进入新时代！学会用AI，年薪百万不是梦！",
              "点赞收藏关注，锁死我的频道！"]},
    {"id": 7, "title": "AI Agent入门指南",
     "texts": ["手把手教你用AI Agent！学会这3点，效率提升10倍！",
              "第一步：选择合适的Agent工具！第二步：构建自己的工作流！第三步：持续优化和迭代！",
              "点赞收藏关注，立即行动！"]},
    {"id": 8, "title": "RAG实战教程",
     "texts": ["RAG是什么？怎么做？5分钟学会企业级RAG实战！",
              "向量数据库选择，Embedding优化，效果评估方法！",
              "点赞收藏关注，收藏起来慢慢学！"]},
    {"id": 9, "title": "AI创业新风口",
     "texts": ["AI创业新风口来了！这几个赛道普通人也能入！",
              "AI应用开发，AI智能硬件，AI内容创作，AI教育服务！月入10万不是梦！",
              "点赞收藏关注，创业路上一起！"]},
    {"id": 10, "title": "2026AI趋势预测",
     "texts": ["2026年AI圈10大预测！Agent全面爆发，MCP生态统一，AI编程普及，多模态进化！",
              "这些趋势你必须知道！错过再等10年！",
              "点赞收藏关注，趋势决定命运！"]},
    {"id": 11, "title": "AI圈年度大事件",
     "texts": ["2026年AI圈发生大事！ChatGPT发布4.0，Anthropic发布Claude 4，微软发布Copilot！",
              "开源模型爆发！这一年AI圈发生了什么？未来会怎样？",
              "点赞收藏关注，持续关注不迷路！"]}
]

async def generate_audio(v):
    full_text = "。".join(v["texts"])
    voice = "zh-CN-XiaoxiaoNeural" if v["id"] % 2 == 1 else "zh-CN-YunxiNeural"
    communicate = edge_tts.Communicate(full_text, voice)
    await communicate.save(f"out/audio-{v['id']}.mp3")
    print(f"✓ 语音-{v['id']}")

async def main():
    # 生成所有语音
    for v in videos:
        await generate_audio(v)
    
    # 调用Puppeteer生成视频
    for v in videos:
        subprocess.run(["node", "-e", f"""
const puppeteer = require('puppeteer');
const fs = require('fs');
const execSync = require('child_process').execSync;

const v = {videos[videos.findIndex(x => x.id === {v['id']})]};

(async () => {{
    const browser = await puppeteer.launch({{
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    }});
    const page = await browser.newPage();
    await page.setViewport({{width: 1080, height: 1920}});
    
    const html = `<html><head><style>
    body{{margin:0;background:linear-gradient(135deg,#0A0A1A,#1A1A2E);color:#fff;font-family:Helvetica,sans-serif}}
    .slide{{width:100%;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:40px}}
    .title{{font-size:72px;color:#00D4FF;font-weight:bold;margin-bottom:30px;text-shadow:0 0 20px #00D4FF}}
    .text{{font-size:36px;margin:15px 0}}
    .highlight{{color:#FF6B6B;font-size:42px;font-weight:bold}}
    .cta{{font-size:32px;margin-top:40px;padding:20px;border:2px solid #00D4FF;border-radius:10px}}
    .slide{{display:none}}.slide:nth-child(1){{display:flex}}
    </style></head><body>
    <div class="slide"><div class="title">${{v.title}}</div></div>
    <div class="slide"><div class="highlight">${{v.texts[0]}}</div></div>
    <div class="slide"><div class="text">${{v.texts[1]}}</div></div>
    <div class="slide"><div class="cta">${{v.texts[2]}}</div></div>
    </body></html>`;
    
    await page.setContent(html);
    for (let i = 0; i < 4; i++) {{
        await page.evaluate(idx => {{
            document.querySelectorAll('.slide').forEach((s, j) => s.style.display = j === idx ? 'flex' : 'none');
        }}, i);
        await page.screenshot({{path: `out/f${{v.id}}-${{i}}.png`, fullPage: true}});
    }}
    await browser.close();
    
    execSync(`ffmpeg -y -framerate 1 -i out/f${{v.id}}-%d.png -i out/audio-${{v.id}}.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -shortest -c:a aac out/video-final-${{v.id}}.mp4`, {{stdio: 'ignore'}});
    console.log(`✓ video-${{v.id}}`);
    
    for (let i = 0; i < 4; i++) {{ try {{ fs.unlinkSync(`out/f${{v.id}}-${{i}}.png`) }} catch {{}} }}try {{ fs.unlinkSync(`out/audio-${{v.id}}.mp3`) }} catch {{}}
}})();
        """], cwd="out", check=True)
    
    print(f"✓ 视频-{v['id']} 完成")

asyncio.run(main())
print("全部完成!")
