/**
 * Kolors图片生成视频 - 1分钟版
 * 使用Kolors文生图生成素材
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const http = require('http');

// Kolors生成图片
function generateKolorsImage(prompt, outputPath) {
  return new Promise((resolve, reject) => {
    const API_KEY = "sk-ysycigzzwlfdgkvgnpkwavpimhpozptlofkyehotomdrtufy";
    const data = JSON.stringify({
      model: "Kwai-Kolors/Kolors",
      prompt: prompt,
      image_size: "1024x1024",
      batch_size: 1,
      num_inference_steps: 20,
      guidance_scale: 7.5
    });

    const options = {
      hostname: 'api.siliconflow.cn',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          if (result.images && result.images[0]) {
            const url = result.images[0].url;
            // 下载图片
            downloadImage(url, outputPath).then(resolve).catch(reject);
          } else {
            reject(new Error("No image returned"));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      const file = fs.createWriteStream(outputPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

// 视频文案和对应的图片描述
const segments = [
  { text: "2026年AI最火技术！MCP协议正在改变AI！它被称为AI世界的USB-C，一个协议连接所有工具！", prompt: "futuristic technology concept, digital network connections, glowing circuit lines, blue and purple theme, cyber style, high tech, 8k", type: "标题" },
  { text: "什么是MCP？MCP = Model Context Protocol，模型上下文协议。Anthropic推出的开放标准！", prompt: "abstract technology concept, protocol connection, data flow visualization, blue gradient, modern tech style", type: "干货" },
  { text: "为什么需要MCP？以前每个工具单独集成，碎片化痛苦！现在一个协议连接一切！", prompt: "chaos to order transformation, scattered elements coming together, glowing particles, purple blue theme", type: "干货" },
  { text: "MCP解决方案：一个统一协议！AI应用连接MCP服务器，访问文件、代码、邮件、数据库所有工具！", prompt: "unified platform concept, multiple interfaces connecting to central hub, glowing connections, modern tech", type: "干货" },
  { text: "MCP vs 传统API：架构完全不同！传统点对点，MCP是客户端-服务器架构！", prompt: "architecture comparison, client server model visualization, digital nodes connected, blue cyan glow", type: "数据" },
  { text: "更大区别：MCP自动发现工具！原生支持上下文！效率提升10倍！", prompt: "efficiency improvement, speed concept, fast forward motion, glowing speed lines, blue theme", type: "数据" },
  { text: "MCP三大核心：客户端是AI应用，服务器是工具提供者，协议是JSON-RPC2.0通信标准！", prompt: "three pillars concept, connected nodes forming triangle, glowing blue structure, tech style", type: "干货" },
  { text: "MCP工具定义简洁。每个工具有名字、描述和参数。read_file指定path就能读取文件！", prompt: "code programming concept, floating code elements, syntax highlighting, blue glow, developer workspace", type: "干货" },
  { text: "MCP资源是AI的外部记忆！文件、API数据、数据库查询结果、配置文件！", prompt: "memory storage concept, floating data blocks, digital brain, glowing blue spheres, data visualization", type: "干货" },
  { text: "传统方式需要100行代码！MCP方式只需要10行！标准化效率就这么快！", prompt: "code efficiency comparison, large code block vs small code block, reduction visualization, blue theme", type: "数据" },
  { text: "已有大量MCP服务器：文件系统、GitHub、Slack、Gmail、PostgreSQL、AWS。一个协议无限扩展！", prompt: "ecosystem expansion, multiple app logos connecting, network visualization, glowing blue purple", type: "干货" },
  { text: "如何安装？npm install或者Docker。简单快捷！", prompt: "installation concept, download progress, glowing install button, technology setup", type: "行动" },
  { text: "配置客户端很简单。指定服务器URL和认证信息，就能连接。开发者友好！", prompt: "configuration setup, settings panel, connection indicator, blue tech interface", type: "行动" },
  { text: "使用MCP工具：连接服务器，获取工具列表，调用工具，获取结果。全程标准化！", prompt: "workflow automation, steps connecting, process flow, glowing blue arrows, sequential steps", type: "行动" },
  { text: "企业级应用：数据集成、自动化工作流、智能助手、代码分析、文档处理！", prompt: "enterprise applications, business technology, corporate digital transformation, blue modern office", type: "案例" },
  { text: "未来展望：MCP将成为AI工具标准协议！就像USB-C统一硬件连接！不可逆的趋势！", prompt: "future technology, vision concept, forward motion, glowing pathway, blue purple gradient", type: "金句" },
  { text: "现在学习MCP就是抢占先机！越早学习越早受益！", prompt: "learning opportunity, growth concept, rising graph, glowing upward direction, blue theme", type: "金句" },
  { text: "点赞收藏关注！下期告诉你如何用MCP搭建AI工作流！", prompt: "social media engagement, like subscribe button, glowing notifications, blue gradient", type: "CTA" },
  { text: "感谢观看！2026年让我们一起掌握MCP协议！点赞投币收藏关注，下期再见！", prompt: "thank you message, appreciation gesture, glowing heart, blue gradient background", type: "CTA" }
];

const templates = {
  标题: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#1a1a2e,#16213e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px 40px}
.title{font-size:48px;font-weight:900;background:linear-gradient(90deg,#FF6B6B,#FFE66D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.5}
.sub{font-size:32px;color:#00D4FF;margin-top:30px}
</style></head><body><div class="container"><div class="title">${t}</div><div class="sub">🔗 MCP协议</div></div></body></html>`,
  
  干货: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px 60px;max-width:900px}
.title{font-size:36px;font-weight:bold;line-height:1.8}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  数据: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#232526,#414345);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px 60px}
.tag{font-size:28px;background:#FF6B6B;padding:15px 40px;border-radius:30px;display:inline-block;margin-bottom:30px}
.title{font-size:38px;font-weight:bold;line-height:2;background:rgba(255,255,255,0.1);padding:40px;border-radius:20px}
</style></head><body><div class="container"><span class="tag">📊 数据对比</span><div class="title">${t}</div></div></body></html>`,
  
  案例: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f2027,#203a43);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px 60px}
.tag{font-size:28px;background:#4ECDC4;padding:15px 40px;border-radius:30px;display:inline-block;margin-bottom:30px}
.title{font-size:36px;font-weight:bold;line-height:1.9}
</style></head><body><div class="container"><span class="tag">💼 应用场景</span><div class="title">${t}</div></div></body></html>`,
  
  行动: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px 60px}
.title{font-size:40px;font-weight:bold;line-height:1.8}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  金句: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#4facfe,#00f2fe);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px;border:5px solid #fff;border-radius:30px;background:rgba(0,0,0,0.2)}
.title{font-size:44px;font-weight:900;line-height:1.8}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  CTA: () => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f0c29,#302b63);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px;border:3px solid #00D4FF;border-radius:30px;background:rgba(0,212,255,0.1)}
.title{font-size:52px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
</style></head><body><div class="container"><div class="title">👍 点赞 📥 收藏 👋 关注</div></div></body></html>`
};

async function run() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   Kolors图片生成 - 1分钟视频            ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  const fps = 2;
  const targetDuration = 60; // 1分钟
  
  // 步骤1: 使用Kolors生成图片背景
  console.log("[步骤1] 使用Kolors生成图片背景");
  
  // 为每个场景生成背景图片
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    try {
      console.log(`  生成图片 ${i+1}/${segments.length}...`);
      await generateKolorsImage(seg.prompt, `bg-${i}.png`);
      console.log(`  ✅ ${seg.type}`);
    } catch (e) {
      console.log(`  ❌ ${e.message}`);
      // 使用纯色背景作为后备
    }
  }
  
  // 步骤2: 生成语音
  console.log("\n[步骤2] 生成语音");
  const segmentDurations = [];
  
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 gen_audio.py "${segments[i].text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync("mv temp-audio.mp3 seg-" + i + ".mp3", { stdio: 'ignore' });
    
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 seg-${i}.mp3`, { encoding: 'utf8' }).trim());
    segmentDurations.push(dur);
  }
  
  const totalDuration = segmentDurations.reduce((a, b) => a + b, 0);
  console.log(`总时长: ${totalDuration.toFixed(1)}秒\n`);
  
  // 步骤3: 计算帧数
  const framePerSeg = segmentDurations.map(d => Math.ceil(d * fps));
  const totalFrames = framePerSeg.reduce((a,b)=>a+b);
  
  // 步骤4: 生成帧 - 使用Kolors图片作为背景
  console.log("[步骤4] 生成帧（使用Kolors背景）");
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  
  let frameIdx = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    let html;
    if (seg.type === "CTA") {
      html = templates.CTA();
    } else {
      html = templates[seg.type](seg.text);
    }
    
    // 检查是否有生成的背景图片
    const bgExists = fs.existsSync(`bg-${i}.png`);
    
    // 创建带背景的HTML
    let bgStyle = bgExists ? `background-image: url('bg-${i}.png'); background-size: cover; background-position: center;` : '';
    html = html.replace('body{', `body{${bgStyle}body{`).replace('body{', 'body{');
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 500));
    
    for (let f = 0; f < framePerSeg[i]; f++) {
      await page.screenshot({ path: `frame-${frameIdx}.png`, fullPage: true });
      frameIdx++;
    }
    await page.close();
    console.log(`  ${seg.type}: ${framePerSeg[i]}帧 ${bgExists ? "✅" : "⬜"}`);
  }
  await browser.close();
  console.log(`共${frameIdx}帧\n`);
  
  // 步骤5: 合并语音
  console.log("[步骤5] 合并语音");
  let filterInputs = "", filterDesc = "";
  for (let i = 0; i < segments.length; i++) {
    filterInputs += `-i seg-${i}.mp3 `;
    filterDesc += `[${i}:a]`;
  }
  filterDesc += `concat=n=${segments.length}:v=0:a=1[out]`;
  execSync(`ffmpeg -y ${filterInputs} -filter_complex "${filterDesc}" -map "[out" combined-audio.mp3`, { stdio: 'ignore' });
  const finalDuration = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 combined-audio.mp3`, { encoding: 'utf8' }).trim());
  
  // 步骤6: 合成视频
  console.log("[步骤6] 合成视频");
  execSync(`ffmpeg -y -framerate ${fps} -i "frame-%d.png" -i combined-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -t ${totalDuration} -shortest final-video.mp4`, { stdio: 'inherit' });
  
  // 验证
  const videoDuration = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 final-video.mp4`, { encoding: 'utf8' }).trim());
  const diff = Math.abs(videoDuration - totalDuration);
  const stats = fs.statSync("final-video.mp4");
  
  console.log("\n[验证结果]");
  console.log(`  视频: ${videoDuration.toFixed(1)}秒`);
  console.log(`  同步: ${diff.toFixed(2)}秒 ${diff < 0.5 ? "✅" : "❌"}`);
  console.log(`  大小: ${(stats.size/1024/1024).toFixed(2)}MB`);
  
  // 清理临时文件
  for (let i = 0; i < frameIdx; i++) try{fs.unlinkSync(`frame-${i}.png`)}catch{}
  for (let i = 0; i < segments.length; i++) {
    try{fs.unlinkSync(`seg-${i}.mp3`)}catch{}
    try{fs.unlinkSync(`bg-${i}.png`)}catch{}
  }
  try{fs.unlinkSync('combined-audio.mp3')}catch{}
  
  execSync("mkdir -p out && cp final-video.mp4 out/mcp-kolors-1min.mp4");
  console.log("\n✅ 完成！");
}

run();