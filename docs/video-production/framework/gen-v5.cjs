/**
 * 爆款视频生成器 - 5分钟版 v5 (完整长文案)
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

// 15段，每段约20秒 = 300秒 = 5分钟
const segments = [
  { text: "2026年，AI正在杀死程序员！不是AI要取代程序员，而是会用AI的程序员，正在取代不会用AI的程序员！这不是预测，这是正在发生的现实！", type: "标题" },
  { text: "让我们先看一组数据。2026年，全球AI编程工具爆发！Claude Code、Cursor、v0、Devin，每一个都是革命性的工具！GitHub Copilot企业版代码生成率超过50%！", type: "干货" },
  { text: "Stack Overflow最新调查结果显示，70%的开发者已经在使用AI工具编程。微软推出了Copilot Workspace，AI可以自主完成整个开发任务！这是质的飞跃！", type: "干货" },
  { text: "AI编程效率提升究竟有多恐怖？简单Web页面开发：从4小时缩短到10分钟，提升24倍！这是24倍的效率提升！", type: "数据" },
  { text: "REST API开发：从8小时缩短到30分钟，16倍提升！Bug修复：从2小时缩短到5分钟，也是24倍！单元测试：从4小时缩短到10分钟！", type: "数据" },
  { text: "小程序开发：从2天缩短到2小时！曾经需要团队工作一周的任务，现在一个人+AI一天就能完成！这不是科幻，这是现实！", type: "数据" },
  { text: "来看几个真实案例。某硅谷互联网公司裁掉50%的基础程序员，效率反而提升了30%！这就是AI的力量！", type: "案例" },
  { text: "另一个案例：一位初级程序员配上AI工具，效率超过了5个不会用AI的高级程序员！AI抹平了经验差距！", type: "案例" },
  { text: "某外包公司引入AI工具后，3个人完成了原来20人的工作量！AI不仅能写代码，还能自己测试、自己修复Bug！", type: "案例" },
  { text: "目前正在消失的岗位包括：CRUD开发、简单页面开发、基础测试工程师、简单API对接、模板化代码编写。这些岗位正在被AI取代！", type: "干货" },
  { text: "不容易被AI替代的岗位：系统架构师、AI工程师、安全工程师、技术管理、复杂问题专家。这些需要深度专业知识的岗位仍然安全。", type: "干货" },
  { text: "核心能力！AI无法替代的能力：复杂问题分析、系统设计、创新方案、团队协作、跨语言开发。这些是程序员的核心竞争力！", type: "干货" },
  { text: "AI不能做什么？它不能理解业务需求、不能做系统架构、不能做技术创新、不能带团队。AI是工具，不是替代者！", type: "干货" },
  { text: "立即行动！每天学习1小时AI编程工具，3个月后甩开90%的人！推荐学习路线：Python基础、ChatGPT提示工程、Claude、Cursor！", type: "行动" },
  { text: "进阶路线：学会v0生成前端、使用Devin做项目、自己开发Agent！学会用AI协作，而不是和AI竞争！", type: "行动" },
  { text: "未来已来！AI编程不是选择题，是必答题！不会AI编程的程序员，将被时代淘汰！就像当年不会用电脑的人被淘汰一样！", type: "金句" },
  { text: "最后记住一句话：AI不会杀死程序员，但会杀死不会AI的程序员！趁现在学起来，还来得及！点赞收藏关注，下期讲如何用AI做副业月入过万！", type: "金句" }
];

const templates = {
  标题: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#1a1a2e,#16213e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px 40px}
.icon{font-size:120px;margin-bottom:30px}
.title{font-size:48px;font-weight:900;background:linear-gradient(90deg,#FF6B6B,#FFE66D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.5}
</style></head><body><div class="container"><div class="icon">💻</div><div class="title">${t}</div></div></body></html>`,
  
  干货: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px 60px;max-width:900px}
.title{font-size:34px;font-weight:bold;line-height:1.8}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  数据: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#232526,#414345);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px 60px}
.tag{font-size:28px;background:#FF6B6B;padding:15px 40px;border-radius:30px;display:inline-block;margin-bottom:30px}
.title{font-size:38px;font-weight:bold;line-height:2;background:rgba(255,255,255,0.1);padding:40px;border-radius:20px}
</style></head><body><div class="container"><span class="tag">📊 数据</span><div class="title">${t}</div></div></body></html>`,
  
  案例: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f2027,#203a43);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px 60px}
.tag{font-size:28px;background:#4ECDC4;padding:15px 40px;border-radius:30px;display:inline-block;margin-bottom:30px}
.title{font-size:36px;font-weight:bold;line-height:1.8}
</style></head><body><div class="container"><span class="tag">📌 真实案例</span><div class="title">${t}</div></div></body></html>`,
  
  行动: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:50px 60px}
.title{font-size:38px;font-weight:bold;line-height:1.8}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`,
  
  金句: (t) => `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
*{margin:0;padding:0}body{background:linear-gradient(135deg,#4facfe,#00f2fe);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}
.container{text-align:center;padding:60px;border:5px solid #fff;border-radius:30px;background:rgba(0,0,0,0.2)}
.title{font-size:42px;font-weight:900;line-height:1.8}
</style></head><body><div class="container"><div class="title">${t}</div></div></body></html>`
};

async function run() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   爆款视频生成器 - 5分钟版 v5          ║");
  console.log("║   完整长文案版                         ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  const fps = 2;
  
  // 步骤1: 生成语音
  console.log("[步骤1] 生成语音");
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 gen_audio.py "${segments[i].text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync("mv temp-audio.mp3 seg-" + i + ".mp3", { stdio: 'ignore' });
  }
  
  // 合并语音
  let filterInputs = "", filterDesc = "";
  for (let i = 0; i < segments.length; i++) {
    filterInputs += `-i seg-${i}.mp3 `;
    filterDesc += `[${i}:a]`;
  }
  filterDesc += `concat=n=${segments.length}:v=0:a=1[out]`;
  execSync(`ffmpeg -y ${filterInputs} -filter_complex "${filterDesc}" -map "[out" combined-audio.mp3`, { stdio: 'ignore' });
  const audioDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 combined-audio.mp3`, { encoding: 'utf8' }).trim());
  console.log(`语音: ${audioDur.toFixed(1)}秒 (${(audioDur/60).toFixed(1)}分钟)\n`);
  
  // 计算帧数
  const totalFrames = Math.ceil(audioDur * fps);
  const framesPerSeg = Math.ceil(totalFrames / segments.length);
  console.log(`帧数: ${totalFrames}帧, 每段: ${framesPerSeg}帧\n`);
  
  // 步骤2: 生成帧
  console.log("[步骤2] 生成帧图片");
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  
  let frameIdx = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    let html = templates[seg.type](seg.text);
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 300));
    
    for (let f = 0; f < framesPerSeg; f++) {
      await page.screenshot({ path: `frame-${frameIdx}.png`, fullPage: true });
      frameIdx++;
    }
    await page.close();
    console.log(`  ${seg.type}: ${framesPerSeg}帧`);
  }
  await browser.close();
  console.log(`共${frameIdx}帧\n`);
  
  // 步骤3: 合成视频
  console.log("[步骤3] 合成视频");
  execSync(`ffmpeg -y -framerate ${fps} -i "frame-%d.png" -i combined-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -t ${audioDur} final-video.mp4`, { stdio: 'inherit' });
  
  // 验证
  const videoDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 final-video.mp4`, { encoding: 'utf8' }).trim());
  const stats = fs.statSync("final-video.mp4");
  
  console.log(`\n[结果]`);
  console.log(`  时长: ${videoDur.toFixed(1)}秒 (${(videoDur/60).toFixed(1)}分钟)`);
  console.log(`  大小: ${(stats.size/1024/1024).toFixed(2)}MB`);
  
  // 清理
  for (let i = 0; i < frameIdx; i++) try{fs.unlinkSync(`frame-${i}.png`)}catch{}
  for (let i = 0; i < segments.length; i++) try{fs.unlinkSync(`seg-${i}.mp3`)}catch{}
  try{fs.unlinkSync('combined-audio.mp3')}catch{}
  
  execSync("mkdir -p out && cp final-video.mp4 out/ai-coding-v5.mp4");
  console.log("\n✅ 完成！");
}

run();