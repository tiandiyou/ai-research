#!/usr/bin/env node
/**
 * 爆款视频框架 v6.0 - 专业版
 * 改进：图片背景+BGM+真实案例+多风格
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

// ============== 配置 ==============
const CONFIG = {
  fps: 12,              // 提高帧率
  resolution: '1080x1920',
  duration: '3-5分钟',
  needBGM: true,
  needImages: true
};

// ============== 爆款文案库 ==============
const viralScripts = {
  // 主题1: AI入门
  ai_rumen: [
    { text: "🔥AI时真的来了！不会用AI的人，正在被淘汰！学会这3个工具，工资翻倍！", type: "标题", time: 15 },
    { text: "AI是什么？简单说，就是让机器像人一样思考帮你干活。写文案、画图、写代码、分析数据，AI都能做！", type: "干货", time: 20 },
    { text: "为什么必须学AI？数据显示：会用AI的人，效率提升10倍，工资高出50%！不会的人，找工作都难！", type: "数据", time: 15 },
    { text: "普通人怎么学AI？第一步：了解AI能做什么。第二步：亲自动手试试。第三步：用在工作里！", type: "行动", time: 15 },
    { text: "推荐3个必学工具：ChatGPT写文案、Midjourney画图、Copilot写代码！", type: "案例", time: 15 },
    { text: "记住：AI不会取代人，但会用AI的人会取代不会用AI的人！", type: "金句", time: 10 },
    { text: "觉得有用点赞收藏！关注我，下期讲AI搞钱副业！", type: "CTA", time: 10 }
  ],
  
  // 主题2: MCP协议
  mcp: [
    { text: "⚡2026年AI圈最火的技术！MCP协议正在颠覆整个行业！不会的人将被淘汰！", type: "标题", time: 15 },
    { text: "MCP是什么？它是AI世界的USB-C！一个协议连接所有AI工具！", type: "干货", time: 20 },
    { text: "以前：每个工具单独集成。现在：一个MCP服务器搞定一切！效率提升10倍！", type: "数据", time: 15 },
    { text: "如何安装？一行代码：npm install @anthropic-ai/mcp-server", type: "行动", time: 15 },
    { text: "已有大量MCP服务器：文件系统、GitHub、Slack、Gmail、AWS...", type: "案例", time: 15 },
    { text: "未来：MCP将成为AI工具的标准协议！就像USB统一硬件！", type: "金句", time: 10 },
    { text: "点赞收藏关注！下期教你用MCP搭建AI工作流！", type: "CTA", time: 10 }
  ],
  
  // 主题3: AI副业
  ai_fuye: [
    { text: "💰用AI做副业太香了！有人已经月入10万+，你还不赶紧上车？", type: "标题", time: 15 },
    { text: "AI副业有哪些？AI写文案、AI做视频、AI生成图片、AI写代码...几乎所有技能都能变现！", type: "干货", time: 20 },
    { text: "真实案例：有人在闲鱼用AI生成头像，一单59元，每天轻松赚500+！", type: "案例", time: 15 },
    { text: "数据统计：AI副业平均月收入3000-10000+，时间自由门槛低！", type: "数据", time: 15 },
    { text: "如何开始？先选一个方向：文案、视频、图片、代码，然后找到一个平台：闲鱼、小红书、B站！", type: "行动", time: 15 },
    { text: "记住：执行力才是赚钱的关键！看完就去做！", type: "金句", time: 10 },
    { text: "点赞收藏关注！下期分享具体操作流程！", type: "CTA", time: 10 }
  ]
};

// ============== 图片素材库 ==============
const imageLibrary = {
  标题: [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1080", // AI大脑
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1080", // 机器人
    "https://images.unsplash.com/photo-1555255707-c07966088b67?w=1080"  // 科技
  ],
  干货: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1080", // 数据
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1080", // 学习
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4174?w=1080"  // 书本
  ],
  数据: [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1080", // 图表
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1080", // 数据分析
    "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1080"  // 数字
  ],
  案例: [
    "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=1080", // 成功
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1080", // 团队
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1080"  // 会议
  ],
  行动: [
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1080", // 行动
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1080", // 起步
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6faa2?w=1080"  // 电脑
  ],
  金句: [
    "https://images.unsplash.com/photo-1507003211169-0a1e722ac822?w=1080", // 激励
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1080", // 书
    "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=1080"  // 道路
  ],
  CTA: [
    "https://images.unsplash.com/photo-1611162617474-5bdaa51d2fdf?w=1080", // 社交
    "https://images.unsplash.com/photo-1611162616305-c24b8e60d5da?w=1080", // 点赞
    "https://images.unsplash.com/photo-1432828626592-55b0916c17ce?w=1080"  // 手机
  ]
};

// ============== 模板（带图片背景）==============
const templates = {
  标题: (t, img) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.bg{position:fixed;inset:0;background:url('${img}')center/cover;filter:blur(3px)brightness(0.4)}
.container{text-align:center;padding:40px;position:relative;z-index:1;animation:fadeIn 0.5s}
.icon{font-size:160px;margin-bottom:40px}
.title{font-size:44px;font-weight:900;line-height:1.3;text-shadow:0 4px 20px rgba(0,0,0,0.5)}
@keyframes fadeIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
</style></head><body><div class="bg"></div><div class="container"><div class="icon">⚡</div><div class="title">${t}</div></div></body></html>`,
  
  干货: (t, img) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.bg{position:fixed;inset:0;background:url('${img}')center/cover;filter:blur(3px)brightness(0.5)}
.container{text-align:center;padding:40px;max-width:750px;position:relative;z-index:1}
.tag{position:absolute;top:30px;left:30px;font-size:20px;background:linear-gradient(90deg,#00d4ff,#0099ff);padding:10px 20px;border-radius:20px}
.icon{font-size:90px;margin-bottom:25px}
.title{font-size:30px;font-weight:700;line-height:1.6}
</style></head><body><div class="bg"></div><div class="container"><span class="tag">💡 知识点</span><div class="icon">🧠</div><div class="title">${t}</div></div></body></html>`,
  
  数据: (t, img) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.bg{position:fixed;inset:0;background:url('${img}')center/cover;filter:blur(3px)brightness(0.4)}
.container{text-align:center;padding:40px;position:relative;z-index:1}
.tag{font-size:24px;background:linear-gradient(90deg,#ff6b6b,#ff8e53);padding:15px 35px;border-radius:25px;display:inline-block;margin-bottom:30px}
.title{font-size:34px;font-weight:700;line-height:1.6;background:rgba(0,0,0,0.4);padding:30px;border-radius:15px}
</style></head><body><div class="bg"></div><div class="container"><span class="tag">📊 数据</span><div class="title">${t}</div></div></body></html>`,
  
  案例: (t, img) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.bg{position:fixed;inset:0;background:url('${img}')center/cover;filter:blur(3px)brightness(0.5)}
.container{text-align:center;padding:40px;position:relative;z-index:1}
.tag{font-size:24px;background:linear-gradient(90deg,#4ECDC4,#44a08d);padding:15px 35px;border-radius:25px;display:inline-block;margin-bottom:30px}
.title{font-size:34px;font-weight:700;line-height:1.6}
</style></head><body><div class="bg"></div><div class="container"><span class="tag">💼 真实案例</span><div class="title">${t}</div></div></body></html>`,
  
  行动: (t, img) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.bg{position:fixed;inset:0;background:url('${img}')center/cover;filter:blur(3px)brightness(0.5)}
.container{text-align:center;padding:40px;position:relative;z-index:1}
.icon{font-size:100px;margin-bottom:25px}
.title{font-size:32px;font-weight:700;line-height:1.6}
</style></head><body><div class="bg"></div><div class="container"><div class="icon">🎯</div><div class="title">${t}</div></div></body></html>`,
  
  金句: (t, img) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.bg{position:fixed;inset:0;background:url('${img}')center/cover;filter:blur(3px)brightness(0.4)}
.container{text-align:center;padding:50px;border:5px solid #fff;border-radius:30px;background:rgba(0,0,0,0.5);position:relative;z-index:1}
.title{font-size:40px;font-weight:900;line-height:1.5}
</style></head><body><div class="bg"></div><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  CTA: (t, img) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.bg{position:fixed;inset:0;background:url('${img}')center/cover;filter:blur(3px)brightness(0.5)}
.container{text-align:center;padding:50px;border:4px solid #fff;border-radius:30px;background:rgba(0,0,0,0.4);position:relative;z-index:1}
.title{font-size:48px;font-weight:900;background:linear-gradient(90deg,#ff6b6b,#f093fb);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
</style></head><body><div class="bg"></div><div class="container"><div class="title">👍 点赞 📥 收藏 👋 关注</div></div></body></html>`
};

// ============== 导出 ==============
module.exports = { CONFIG, viralScripts, imageLibrary, templates };

// ============== 主函数 ==============
function listScripts() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   可用主题                        ║");
  console.log("╚════════════════════════════════════════╝");
  Object.keys(viralScripts).forEach((key, i) => {
    const segs = viralScripts[key];
    const totalTime = segs.reduce((a, b) => a + b.time, 0);
    console.log(`${i+1}. ${key} - ${segs.length}段/${totalTime}秒`);
  });
}

function getScript(topic) {
  if (!viralScripts[topic]) {
    console.log(`❌ 未知主题: ${topic}`);
    listScripts();
    process.exit(1);
  }
  return viralScripts[topic];
}

function printScript(topic) {
  const segs = getScript(topic);
  const totalTime = segs.reduce((a, b) => a + b.time, 0);
  
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║   文案预览 - ${topic}              ║`);
  console.log(`║   总时长: ${totalTime}秒 (${(totalTime/60).toFixed(1)}分钟)            ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
  
  segs.forEach((seg, i) => {
    console.log(`【${i+1}】[${seg.type}] ${seg.time}秒`);
    console.log(`   ${seg.text}\n`);
  });
  
  console.log(`总计: ${segs.length}段 / ${totalTime}秒\n`);
  return segs;
}

// ============== 运行 ==============
const topic = process.argv[2];
if (topic) {
  printScript(topic);
} else {
  listScripts();
  console.log("\n用法: node script-v6.js <主题>");
  console.log("示例: node script-v6.js ai入门");
}