#!/usr/bin/env node
/**
 * Ralph v3.0 - 加长版爆款视频
 * 每段15秒+，总共20段=300秒=5分钟
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

// ============== 配置 ==============
const CONFIG = { fps: 2 };

// ============== 爆款文案（加长版）==============
const segments = [
  { text: "2026年AI圈最火的技术！MCP协议正在颠覆整个AI行业！不会的人将被淘汰！这就是时代的变革！", type: "标题" },
  { text: "什么是MCP？MCP = Model Context Protocol，模型上下文协议。它是Anthropic推出的开放标准，被称为AI世界的USB-C！", type: "干货" },
  { text: "为什么需要MCP？以前：GPT需要单独集成，Claude需要单独集成，GitHub需要单独集成。每个集成都是专属API，碎片化痛苦！", type: "干货" },
  { text: "MCP的解决方案：一个统一协议连接一切！AI应用只需要连接MCP服务器，就能访问文件、代码、邮件、数据库所有工具！", type: "干货" },
  { text: "MCP vs 传统API：架构完全不同！传统API是点对点连接，MCP是客户端-服务器架构。传统API各自认证，MCP统一标准认证！", type: "数据" },
  { text: "更大区别：传统API手动配置工具，MCP自动发现工具！传统API手动处理上下文，MCP原生支持上下文传递！效率提升10倍！", type: "数据" },
  { text: "MCP三大核心组件：客户端是AI应用如Claude和GPT，服务器是工具提供者如文件系统，协议是通信标准基于JSON-RPC2.0！", type: "干货" },
  { text: "MCP工具定义非常简洁。每个工具有名字、描述和参数定义。比如read_file工具，指定path就能读取文件！非常方便！", type: "干货" },
  { text: "MCP资源是什么？是AI的外部记忆！可以是文件、API数据、数据库查询结果、配置文件。AI可以随时访问这些资源！", type: "干货" },
  { text: "开发体验对比：传统方式需要100行代码！读取API文档、实现OAuth认证、处理API差异、解析不同响应格式、管理连接状态！", type: "数据" },
  { text: "MCP方式只需要10行代码！连接服务器，调用工具，就完成！这就是标准化带来的效率提升！这就是科技进步！", type: "数据" },
  { text: "已有大量MCP服务器支持：文件系统、GitHub、Slack、Gmail、PostgreSQL、SQLite、AWS。一个协议无限扩展！生态繁荣！", type: "干货" },
  { text: "如何安装MCP服务器？使用npm install @anthropic-ai/mcp-server 或者Docker。简单快捷！一行命令就搞定！", type: "行动" },
  { text: "配置MCP客户端也很简单。只需要指定服务器URL和认证信息，就能轻松连接。开发者友好度非常高！", type: "行动" },
  { text: "使用MCP工具只需要几行代码：连接服务器，获取工具列表，调用工具，获取结果。全程标准化！非常优雅！", type: "行动" },
  { text: "企业级应用场景：数据集成、自动化工作流、智能助手、代码分析、文档处理等等。MCP都能完美胜任！", type: "案例" },
  { text: "未来展望：MCP将成为AI工具的标准协议！就像USB-C统一了硬件连接，MCP将统一AI工具连接。这是不可逆的趋势！", type: "金句" },
  { text: "现在学习MCP就是抢占先机！随着更多AI应用支持MCP，会MCP的开发者将拥有巨大优势。越早学习，越早受益！这就是红利期！", type: "金句" },
  { text: "如果你想了解更多AI前沿技术，欢迎点赞收藏关注！下期我将告诉你如何用MCP搭建自己的AI工作流！一起进步！", type: "CTA" },
  { text: "感谢观看！2026年让我们一起掌握MCP协议，成为AI时代的先行者！点赞投币收藏关注，我们下期再见！", type: "CTA" }
];

// ============== 模板 ==============
const templates = {
  标题: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#1a1a2e,#16213e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px}
.icon{font-size:150px;margin-bottom:40px}
.title{font-size:48px;font-weight:900;background:linear-gradient(90deg,#FF6B6B,#FFE66D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.4}
</style></head><body><div class="container"><div class="icon">🔗</div><div class="title">${t}</div></div></body></html>`,
  
  干货: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px;max-width:900px}
.tag{position:absolute;top:40px;right:40px;font-size:24px;background:rgba(255,255,255,0.2);padding:12px 24px;border-radius:25px}
.title{font-size:34px;font-weight:bold;line-height:1.9}
</style></head><body><div class="container"><span class="tag">💡 知识点</span><div class="title">${t}</div></div></body></html>`,
  
  数据: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#232526,#414345);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px}
.tag{font-size:32px;background:#FF6B6B;padding:18px 45px;border-radius:35px;display:inline-block;margin-bottom:35px}
.title{font-size:38px;font-weight:bold;line-height:1.9;background:rgba(255,255,255,0.1);padding:45px;border-radius:25px}
</style></head><body><div class="container"><span class="tag">📊 数据</span><div class="title">${t}</div></div></body></html>`,
  
  案例: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f2027,#203a43);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px}
.tag{font-size:32px;background:#4ECDC4;padding:18px 45px;border-radius:35px;display:inline-block;margin-bottom:35px}
.title{font-size:36px;font-weight:bold;line-height:1.8}
</style></head><body><div class="container"><span class="tag">💼 真实案例</span><div class="title">${t}</div></div></body></html>`,
  
  行动: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px}
.title{font-size:36px;font-weight:bold;line-height:1.8}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  金句: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#4facfe,#00f2fe);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:70px;border:6px solid #fff;border-radius:35px;background:rgba(0,0,0,0.2)}
.title{font-size:44px;font-weight:900;line-height:1.7}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  CTA: () => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f0c29,#302b63);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px;border:4px solid #00D4FF;border-radius:35px;background:rgba(0,212,255,0.15)}
.title{font-size:56px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
</style></head><body><div class="container"><div class="title">👍 点赞 📥 收藏 👋 关注</div></div></body></html>`
};

async function run() {
  const fps = CONFIG.fps;
  
  console.log("╔════════════════════════════════════════╗");
  console.log("║   Ralph v3.0 - 加长版5分钟视频          ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  // 1. 生成语音
  console.log("[1/5] 生成语音...");
  const segmentDurations = [];
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 gen_audio.py "${segments[i].text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync("mv temp-audio.mp3 seg-" + i + ".mp3", { stdio: 'ignore' });
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 seg-${i}.mp3`, { encoding: 'utf8' }).trim());
    segmentDurations.push(dur);
    console.log(`  段${i+1}: ${dur.toFixed(1)}秒 - ${segments[i].type}`);
  }
  
  const totalDuration = segmentDurations.reduce((a,b) => a+b, 0);
  console.log(`\n总时长: ${totalDuration.toFixed(1)}秒 (${(totalDuration/60).toFixed(1)}分钟)\n`);
  
  // 2. 计算帧数
  console.log("[2/5] 计算帧数...");
  const framePerSeg = segmentDurations.map(d => Math.ceil(d * fps));
  const totalFrames = framePerSeg.reduce((a,b) => a+b);
  console.log(`总帧数: ${totalFrames}帧\n`);
  
  // 3. 渲染帧
  console.log("[3/5] 渲染帧...");
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  let frameIdx = 0;
  
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const html = seg.type === 'CTA' ? templates.CTA() : templates[seg.type](seg.text);
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 500));
    
    for (let f = 0; f < framePerSeg[i]; f++) {
      await page.screenshot({ path: `frame-${frameIdx}.png`, fullPage: true });
      frameIdx++;
    }
    await page.close();
    console.log(`  ${seg.type}: ${framePerSeg[i]}帧`);
  }
  await browser.close();
  console.log(`共${frameIdx}帧\n`);
  
  // 4. 合并语音
  console.log("[4/5] 合成视频...");
  let filterInputs = "", filterDesc = "";
  for (let i = 0; i < segments.length; i++) {
    filterInputs += `-i seg-${i}.mp3 `;
    filterDesc += `[${i}:a]`;
  }
  filterDesc += `concat=n=${segments.length}:v=0:a=1[out]`;
  execSync(`ffmpeg -y ${filterInputs} -filter_complex "${filterDesc}" -map "[out" combined-audio.mp3`, { stdio: 'ignore' });
  const finalDuration = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 combined-audio.mp3`, { encoding: 'utf8' }).trim());
  
  execSync(`ffmpeg -y -framerate ${fps} -i "frame-%d.png" -i combined-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -t ${totalDuration} -shortest final-video.mp4`, { stdio: 'inherit' });
  
  // 5. 验证
  const videoDuration = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 final-video.mp4`, { encoding: 'utf8' }).trim());
  const stats = fs.statSync("final-video.mp4");
  const diff = Math.abs(videoDuration - totalDuration);
  
  console.log("\n[5/5] 验证结果");
  console.log(`  时长: ${videoDuration.toFixed(1)}秒 (${(videoDuration/60).toFixed(1)}分钟)`);
  console.log(`  大小: ${(stats.size/1024/1024).toFixed(2)}MB`);
  console.log(`  同步: ${diff.toFixed(2)}秒 ${diff < 0.5 ? "✅" : "❌"}`);
  
  // 清理
  for (let i = 0; i < frameIdx; i++) try{fs.unlinkSync(`frame-${i}.png`)}catch{}
  for (let i = 0; i < segments.length; i++) try{fs.unlinkSync(`seg-${i}.mp3`)}catch{}
  try{fs.unlinkSync('combined-audio.mp3')}catch{}
  
  execSync("mkdir -p out && cp final-video.mp4 out/ralph-mcp-5min.mp4");
  console.log("\n✅ 完成！");
}

run();