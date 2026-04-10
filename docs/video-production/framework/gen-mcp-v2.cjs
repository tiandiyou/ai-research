/**
 * MCP协议视频生成器 - 优化版 v2
 * 修复同步问题 + 增加视觉效果
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

// 20段优化文案 - 每段更短更精炼
const segments = [
  { text: "2026年AI最火技术！MCP协议正在改变AI！它被称为AI世界的USB-C，一个协议连接所有工具！不会MCP，你将错失下一个时代红利！", type: "标题", icon: "🔗" },
  { text: "什么是MCP？MCP = Model Context Protocol，模型上下文协议。Anthropic推出的开放标准，让AI统一连接各种工具和数据源！", type: "干货", icon: "🤖" },
  { text: "为什么需要MCP？以前：GPT单独集成，Claude单独集成，GitHub单独集成。每个集成都是专属API，碎片化痛苦！", type: "干货", icon: "😩" },
  { text: "MCP解决方案：一个统一协议连接一切！AI应用只需连接MCP服务器，就能访问文件、代码、邮件、数据库所有工具！", type: "干货", icon: "✅" },
  { text: "MCP vs 传统API：架构完全不同！传统API点对点连接，MCP是客户端-服务器架构。传统API各自认证，MCP统一标准！", type: "数据", icon: "⚡" },
  { text: "更大区别：传统API手动配置工具，MCP自动发现工具！传统API手动处理上下文，MCP原生支持！效率提升10倍！", type: "数据", icon: "🚀" },
  { text: "MCP三大核心：客户端是AI应用如Claude和GPT，服务器是工具提供者如文件系统，协议是通信标准基于JSON-RPC2.0！", type: "干货", icon: "🏗️" },
  { text: "MCP工具定义非常简洁。每个工具有名字、描述和参数定义。比如read_file工具，指定path就能读取文件！", type: "干货", icon: "📝" },
  { text: "MCP资源是AI的外部记忆！可以是文件、API数据、数据库查询结果、配置文件。AI随时访问这些资源！", type: "干货", icon: "🧠" },
  { text: "开发体验对比：传统方式需要100行代码！读取API文档、实现OAuth、处理差异、解析响应、管理状态！", type: "数据", icon: "📊" },
  { text: "MCP方式只需要10行代码！连接服务器，调用工具，就完成！标准化带来的效率提升就是这么快！", type: "数据", icon: "⚡" },
  { text: "已有大量MCP服务器支持：文件系统、GitHub、Slack、Gmail、PostgreSQL、SQLite、AWS。一个协议无限扩展！", type: "干货", icon: "🌐" },
  { text: "如何安装？npm install @anthropic-ai/mcp-server 或者Docker。简单快捷！", type: "行动", icon: "💻" },
  { text: "配置客户端也很简单。指定服务器URL和认证信息就能连接。开发者友好度非常高！", type: "行动", icon: "🔧" },
  { text: "使用MCP工具只需要几行代码：连接服务器，获取工具列表，调用工具，获取结果。全程标准化！", type: "行动", icon: "📋" },
  { text: "企业级应用场景：数据集成、自动化工作流、智能助手、代码分析、文档处理。MCP都能完美胜任！", type: "案例", icon: "🏢" },
  { text: "未来展望：MCP将成为AI工具的标准协议！就像USB-C统一硬件连接，MCP将统一AI工具连接。这是不可逆的趋势！", type: "金句", icon: "🔮" },
  { text: "现在学习MCP就是抢占先机！更多AI应用支持MCP，会MCP的开发者将拥有巨大优势。越早学习越早受益！", type: "金句", icon: "💎" },
  { text: "想了解更多AI前沿技术？点赞收藏关注！下期告诉你如何用MCP搭建自己的AI工作流！", type: "CTA", icon: "📱" },
  { text: "感谢观看！2026年让我们一起掌握MCP协议，成为AI时代先行者！点赞投币收藏关注，下期再见！", type: "CTA", icon: "👋" }
];

// 多种模板风格
const templates = {
  标题: (t, icon) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#1a1a2e,#16213e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px 40px;animation:fadeIn 1s}
.icon{font-size:140px;margin-bottom:40px;animation:bounce 2s infinite}
.title{font-size:44px;font-weight:900;background:linear-gradient(90deg,#FF6B6B,#FFE66D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.5}
@keyframes fadeIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
</style></head><body><div class="container"><div class="icon">${icon}</div><div class="title">${t}</div></div></body></html>`,
  
  干货: (t, icon) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px 60px;max-width:900px;animation:slideIn 0.5s}
.icon{font-size:80px;margin-bottom:30px;display:block}
.title{font-size:32px;font-weight:bold;line-height:2}
.tag{position:absolute;top:30px;right:30px;font-size:24px;background:rgba(255,255,255,0.2);padding:10px 20px;border-radius:20px}
@keyframes slideIn{from{transform:translateX(-50px);opacity:0}to{transform:translateX(0);opacity:1}}
</style></head><body><div class="container"><span class="tag">💡 知识点</span><div class="icon">${icon}</div><div class="title">${t}</div></div></body></html>`,
  
  数据: (t, icon) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#232526,#414345);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px 60px;animation:pulse 2s}
.icon{font-size:80px;margin-bottom:30px;display:block}
.tag{font-size:28px;background:#FF6B6B;padding:15px 40px;border-radius:30px;display:inline-block;margin-bottom:30px}
.title{font-size:34px;font-weight:bold;line-height:2;background:rgba(255,255,255,0.1);padding:40px;border-radius:20px}
.highlight{color:#4ECDC4;font-weight:900}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
</style></head><body><div class="container"><span class="tag">📊 数据对比</span><div class="icon">${icon}</div><div class="title">${t}</div></div></body></html>`,
  
  案例: (t, icon) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f2027,#203a43);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px 60px;animation:slideUp 0.5s}
.icon{font-size:80px;margin-bottom:30px;display:block}
.tag{font-size:28px;background:#4ECDC4;padding:15px 40px;border-radius:30px;display:inline-block;margin-bottom:30px}
.title{font-size:32px;font-weight:bold;line-height:1.9}
@keyframes slideUp{from{transform:translateY(50px);opacity:0}to{transform:translateY(0);opacity:1}}
</style></head><body><div class="container"><span class="tag">💼 应用场景</span><div class="icon">${icon}</div><div class="title">${t}</div></div></body></html>`,
  
  行动: (t, icon) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px 60px;animation:scaleIn 0.5s}
.icon{font-size:100px;margin-bottom:30px;display:block}
.title{font-size:36px;font-weight:bold;line-height:1.8}
@keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
</style></head><body><div class="container"><div class="icon">${icon}</div><div class="title">${t}</div></div></body></html>`,
  
  金句: (t, icon) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#4facfe,#00f2fe);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px;border:5px solid #fff;border-radius:30px;background:rgba(0,0,0,0.2);animation:glow 2s infinite}
.icon{font-size:100px;margin-bottom:30px;display:block}
.title{font-size:40px;font-weight:900;line-height:1.8}
@keyframes glow{0%,100%{box-shadow:0 0 30px rgba(79,172,254,0.5)}50%{box-shadow:0 0 60px rgba(79,172,254,0.9)}}
</style></head><body><div class="container"><div class="icon">${icon}</div><div class="title">${t}</div></div></body></html>`,
  
  CTA: (icon) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f0c29,#302b63);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px;border:3px solid #00D4FF;border-radius:30px;background:rgba(0,212,255,0.1);animation:glow 2s infinite}
.icon{font-size:120px;margin-bottom:30px}
.title{font-size:52px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
@keyframes glow{0%,100%{box-shadow:0 0 30px rgba(0,212,255,0.4)}50%{box-shadow:0 0 60px rgba(0,212,255,0.8)}}
</style></head><body><div class="container"><div class="icon">${icon}</div><div class="title">👍 点赞 📥 收藏 👋 关注</div></div></body></html>`
};

async function run() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   MCP协议视频 - 优化版 v2              ║");
  console.log("║   修复同步 + 增加视觉效果              ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  const fps = 2;
  
  // 步骤1: 每段单独生成语音
  console.log("[步骤1] 生成语音");
  const segmentDurations = [];
  
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 gen_audio.py "${segments[i].text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync("mv temp-audio.mp3 seg-" + i + ".mp3", { stdio: 'ignore' });
    
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 seg-${i}.mp3`, { encoding: 'utf8' }).trim());
    segmentDurations.push(dur);
    console.log(`  段${i+1}: ${dur.toFixed(1)}秒 - ${segments[i].icon}`);
  }
  
  const totalDuration = segmentDurations.reduce((a, b) => a + b, 0);
  console.log(`\n总时长: ${totalDuration.toFixed(1)}秒 (${(totalDuration/60).toFixed(1)}分钟)\n`);
  
  // 步骤2: 计算帧数
  console.log("[步骤2] 计算帧数");
  const framePerSeg = segmentDurations.map(d => Math.ceil(d * fps));
  const totalFrames = framePerSeg.reduce((a,b)=>a+b);
  console.log(`总帧数: ${totalFrames}帧\n`);
  
  // 步骤3: 生成帧 - 每段独立生成页面
  console.log("[步骤3] 生成帧图片");
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  
  let frameIdx = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    let html;
    if (seg.type === "CTA") {
      html = templates.CTA(seg.icon);
    } else {
      html = templates[seg.type](seg.text, seg.icon);
    }
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 500));
    
    for (let f = 0; f < framePerSeg[i]; f++) {
      await page.screenshot({ path: `frame-${frameIdx}.png`, fullPage: true });
      frameIdx++;
    }
    await page.close();
    console.log(`  ${seg.type} ${seg.icon}: ${framePerSeg[i]}帧`);
  }
  await browser.close();
  console.log(`共${frameIdx}帧\n`);
  
  // 步骤4: 合并语音
  console.log("[步骤4] 合并语音");
  let filterInputs = "", filterDesc = "";
  for (let i = 0; i < segments.length; i++) {
    filterInputs += `-i seg-${i}.mp3 `;
    filterDesc += `[${i}:a]`;
  }
  filterDesc += `concat=n=${segments.length}:v=0:a=1[out]`;
  execSync(`ffmpeg -y ${filterInputs} -filter_complex "${filterDesc}" -map "[out" combined-audio.mp3`, { stdio: 'ignore' });
  const finalDuration = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 combined-audio.mp3`, { encoding: 'utf8' }).trim());
  
  // 步骤5: 合成视频 - 关键修复：用totalDuration而不是finalDuration
  console.log("[步骤5] 合成视频");
  execSync(`ffmpeg -y -framerate ${fps} -i "frame-%d.png" -i combined-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -t ${totalDuration} -shortest final-video.mp4`, { stdio: 'inherit' });
  
  // 验证
  const videoDuration = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 final-video.mp4`, { encoding: 'utf8' }).trim());
  const diff = Math.abs(videoDuration - totalDuration);
  const stats = fs.statSync("final-video.mp4");
  
  console.log("\n[验证结果]");
  console.log(`  目标: ${totalDuration.toFixed(1)}秒`);
  console.log(`  视频: ${videoDuration.toFixed(1)}秒`);
  console.log(`  同步: ${diff.toFixed(2)}秒 ${diff < 0.5 ? "✅" : "❌"}`);
  console.log(`  大小: ${(stats.size/1024/1024).toFixed(2)}MB`);
  
  // 清理
  for (let i = 0; i < frameIdx; i++) try{fs.unlinkSync(`frame-${i}.png`)}catch{}
  for (let i = 0; i < segments.length; i++) try{fs.unlinkSync(`seg-${i}.mp3`)}catch{}
  try{fs.unlinkSync('combined-audio.mp3')}catch{}
  
  execSync("mkdir -p out && cp final-video.mp4 out/mcp-v2.mp4");
  console.log("\n✅ 完成！");
}

run();