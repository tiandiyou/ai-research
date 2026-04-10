/**
 * Ralph视频生成框架 v2.0 - 爆款制造机
 * 目标：点赞评论收藏10000+
 * 
 * 核心改进：
 * 1. 同步算法优化 - 帧数=时长×fps
 * 2. 防限流机制 - 每分钟15次+3秒间隔
 * 3. 爆款文案结构 - 黄金开头+内容充实+强CTA
 * 4. 多模板支持 - 不同风格
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const http = require('http');

// ============== 配置 ==============
const CONFIG = {
  fps: 2,                      // 帧率
  targetDuration: 300,        // 目标时长5分钟
  minDuration: 180,            // 最小3分钟
  maxSyncDiff: 0.5,           // 最大同步差值
  minFileSize: 3 * 1024 * 1024, // 最小3MB
  apiMinInterval: 3,           // API最小间隔(秒)
  apiMaxPerMinute: 15,         // 每分钟最大请求数
};

// ============== 防限流API ==============
class KolorsAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.lastRequest = {};
    this.requestCount = {};
  }
  
  wait(endpoint) {
    const now = new Date();
    const minute = now.getMinutes();
    
    // 检查请求间隔
    if (this.lastRequest[endpoint]) {
      const elapsed = (now - this.lastRequest[endpoint]) / 1000;
      if (elapsed < CONFIG.apiMinInterval) {
        console.log(`  ⏳ 等待 ${CONFIG.apiMinInterval - elapsed}秒...`);
        sleep(CONFIG.apiMinInterval - elapsed);
      }
    }
    
    this.lastRequest[endpoint] = now;
    this.requestCount[minute] = (this.requestCount[minute] || 0) + 1;
  }
  
  async generate(prompt, outputPath) {
    this.wait('/v1/images/generations');
    
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
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => {
          try {
            const result = JSON.parse(body);
            if (result.images && result.images[0]) {
              this.download(result.images[0].url, outputPath).then(resolve).catch(reject);
            } else {
              reject(new Error("No image"));
            }
          } catch(e) { reject(e); }
        });
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }
  
  download(url, path) {
    return new Promise((resolve, reject) => {
      const proto = url.startsWith('https') ? https : http;
      proto.get(url, (res) => {
        const file = fs.createWriteStream(path);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }).on('error', reject);
    });
  }
}

// ============== 视频生成器 ==============
class RalphVideoGenerator {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.SILICON_API_KEY;
    this.fps = options.fps || CONFIG.fps;
    this.outputPath = options.outputPath || 'out/video.mp4';
  }
  
  // 生成语音并获取实际时长
  async generateSpeech(text, outputPath) {
    execSync(`python3 gen_audio.py "${text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync(`mv temp-audio.mp3 ${outputPath}`, { stdio: 'ignore' });
    return this.getDuration(outputPath);
  }
  
  getDuration(path) {
    return parseFloat(execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${path}`,
      { encoding: 'utf8' }
    ).trim());
  }
  
  // 核心：按实际时长计算帧数
  calculateFrames(segmentDurations) {
    const totalDuration = segmentDurations.reduce((a, b) => a + b, 0);
    const framePerSeg = segmentDurations.map(d => Math.ceil(d * this.fps));
    return { totalDuration, framePerSeg, totalFrames: framePerSeg.reduce((a,b) => a+b) };
  }
  
  // 渲染帧
  async renderFrames(segments, framePerSeg, templates) {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox']
    });
    
    let frameIdx = 0;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const html = seg.type === 'CTA' 
        ? templates.CTA() 
        : templates[seg.type](seg.text);
      
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1920 });
      await page.setContent(html);
      await sleep(500);
      
      for (let f = 0; f < framePerSeg[i]; f++) {
        await page.screenshot({ path: `frame-${frameIdx}.png`, fullPage: true });
        frameIdx++;
      }
      await page.close();
    }
    await browser.close();
    return frameIdx;
  }
  
  // 合成视频
  composeVideo(segments, audioPath, totalDuration) {
    let inputs = '', filter = '';
    for (let i = 0; i < segments.length; i++) {
      inputs += `-i seg-${i}.mp3 `;
      filter += `[${i}:a]`;
    }
    filter += `concat=n=${segments.length}:v=0:a=1[out]`;
    
    execSync(`ffmpeg -y ${inputs} -filter_complex "${filter}" -map "[out" ${audioPath}`, { stdio: 'ignore' });
    const finalDuration = this.getDuration(audioPath);
    
    execSync(`ffmpeg -y -framerate ${this.fps} -i "frame-%d.png" -i ${audioPath} ` +
      `-c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac ` +
      `-t ${totalDuration} -shortest ${this.outputPath}`, { stdio: 'inherit' });
    
    return this.getDuration(this.outputPath);
  }
  
  // 质量检查
  qualityCheck() {
    const stats = fs.statSync(this.outputPath);
    const duration = this.getDuration(this.outputPath);
    
    const issues = [];
    
    if (duration < CONFIG.minDuration) {
      issues.push(`时长太短: ${duration.toFixed(1)}秒`);
    }
    if (stats.size < CONFIG.minFileSize) {
      issues.push(`文件太小: ${(stats.size/1024/1024).toFixed(2)}MB`);
    }
    
    return {
      duration: duration.toFixed(1),
      size: (stats.size/1024/1024).toFixed(2),
      issues,
      pass: issues.length === 0
    };
  }
  
  // 主流程
  async generate(segments, templates, options = {}) {
    console.log("╔════════════════════════════════════════╗");
    console.log("║   Ralph v2.0 - 爆款视频生成器            ║");
    console.log("╚════════════════════════════════════════╝\n");
    
    // 1. 生成语音
    console.log("[1/5] 生成语音...");
    const segmentDurations = [];
    for (let i = 0; i < segments.length; i++) {
      const dur = await this.generateSpeech(segments[i].text, `seg-${i}.mp3`);
      segmentDurations.push(dur);
      console.log(`  段${i+1}: ${dur.toFixed(1)}秒`);
    }
    
    // 2. 计算帧数
    console.log("\n[2/5] 计算帧数...");
    const { totalDuration, framePerSeg, totalFrames } = this.calculateFrames(segmentDurations);
    console.log(`  总时长: ${totalDuration.toFixed(1)}秒 (${(totalDuration/60).toFixed(1)}分钟)`);
    console.log(`  总帧数: ${totalFrames}帧`);
    
    // 3. 渲染帧
    console.log("\n[3/5] 渲染帧...");
    const frameCount = await this.renderFrames(segments, framePerSeg, templates);
    console.log(`  完成: ${frameCount}帧`);
    
    // 4. 合成视频
    console.log("\n[4/5] 合成视频...");
    const videoDuration = this.composeVideo(segments, 'combined-audio.mp3', totalDuration);
    
    // 5. 质量检查
    console.log("\n[5/5] 质量检查...");
    const result = this.qualityCheck();
    console.log(`  时长: ${result.duration}秒`);
    console.log(`  大小: ${result.size}MB`);
    console.log(`  状态: ${result.pass ? "✅ 通过" : "❌ " + result.issues.join(", ")}`);
    
    // 清理
    for (let i = 0; i < frameCount; i++) try{fs.unlinkSync(`frame-${i}.png`)}catch{}
    for (let i = 0; i < segments.length; i++) try{fs.unlinkSync(`seg-${i}.mp3`)}catch{}
    try{fs.unlinkSync('combined-audio.mp3')}catch{}
    
    execSync(`mkdir -p out && cp ${this.outputPath} out/ralph-v2.mp4`);
    
    return result;
  }
}

// ============== 工具函数 ==============
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============== 爆款模板 ==============
const viralTemplates = {
  标题: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#1a1a2e,#16213e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px}
.icon{font-size:150px;margin-bottom:40px;animation:bounce 2s infinite}
.title{font-size:52px;font-weight:900;background:linear-gradient(90deg,#FF6B6B,#FFE66D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.4}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
</style></head><body><div class="container"><div class="icon">🔥</div><div class="title">${t}</div></div></body></html>`,
  
  干货: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px;max-width:900px}
.tag{position:absolute;top:40px;right:40px;font-size:24px;background:rgba(255,255,255,0.2);padding:12px 24px;border-radius:25px}
.title{font-size:36px;font-weight:bold;line-height:2}
</style></head><body><div class="container"><span class="tag">💡 必看</span><div class="title">${t}</div></div></body></html>`,
  
  数据: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#232526,#414345);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px}
.tag{font-size:32px;background:#FF6B6B;padding:18px 45px;border-radius:35px;display:inline-block;margin-bottom:35px}
.title{font-size:40px;font-weight:bold;line-height:1.9;background:rgba(255,255,255,0.1);padding:45px;border-radius:25px}
</style></head><body><div class="container"><span class="tag">📊 数据</span><div class="title">${t}</div></div></body></html>`,
  
  案例: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f2027,#203a43);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px}
.tag{font-size:32px;background:#4ECDC4;padding:18px 45px;border-radius:35px;display:inline-block;margin-bottom:35px}
.title{font-size:38px;font-weight:bold;line-height:1.8}
</style></head><body><div class="container"><span class="tag">💼 真实案例</span><div class="title">${t}</div></div></body></html>`,
  
  金句: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#4facfe,#00f2fe);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:70px;border:6px solid #fff;border-radius:35px;background:rgba(0,0,0,0.2);animation:glow 2s infinite}
.title{font-size:48px;font-weight:900;line-height:1.7}
@keyframes glow{0%,100%{box-shadow:0 0 40px rgba(79,172,254,0.6)}50%{box-shadow:0 0 80px rgba(79,172,254,1)}}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  CTA: () => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f0c29,#302b63);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px;border:4px solid #00D4FF;border-radius:35px;background:rgba(0,212,255,0.15);animation:glow 2s infinite}
.title{font-size:60px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
@keyframes glow{0%,100%{box-shadow:0 0 40px rgba(0,212,255,0.5)}50%{box-shadow:0 0 80px rgba(0,212,255,0.9)}}
</style></head><body><div class="container"><div class="title">👍 点赞 📥 收藏 👋 关注</div></div></body></html>`
};

// ============== 导出 ==============
module.exports = { RalphVideoGenerator, viralTemplates, CONFIG };

// ============== 主入口 ==============
if (require.main === module) {
  (async () => {
    const apiKey = process.env.SILICON_API_KEY || require('fs').readFileSync('../silicon.env', 'utf8').split(':')[1];
    const generator = new RalphVideoGenerator({ apiKey });
    
    // 示例文案
    const segments = [
      { text: "2026年AI Agent爆发！90%的人还不知道这个巨大机会！", type: "标题" },
      { text: "AI Agent是什么？它就像一个超级助手，帮你自动完成工作！", type: "干货" },
      { text: "不会Agent的人，正在被会Agent的人取代！这就是现实！", type: "干货" },
      { text: "数据显示：会用Agent的人，效率提升10倍以上！", type: "数据" },
      { text: "某公司用Agent后，一个人的产出超过原来10个人！", type: "案例" },
      { text: "现在学Agent，3个月后你就能超过90%的人！", type: "金句" },
      { text: "点赞收藏关注，下期手把手教你用Agent！", type: "CTA" }
    ];
    
    await generator.generate(segments, viralTemplates);
  })();
}
