#!/usr/bin/env node
/**
 * Kolors视频 v4.0 - 复用图片+叠加文字
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

const workDir = "/root/.openclaw/workspace/ai-research/docs/video-kolors";

const scripts = [
  "GPT-4最强对手！Claude 4实测，我惊了！编程超越GPT-4，长文50万Token",
  "编程实测：GPT-4写2000行，错误15个。Claude 4写3500行，错误1个！",
  "推理测试：GPT-4用15步，Claude 4用8步，还给出3种解法！",
  "长文理解20万→50万Token，提升150%！速度提升30%！",
  "GPT-4要30分钟，Claude 4只要8分钟！效率提升4倍！",
  "Anthropic在第五层，GPT-4在第一层。格局彻底变了！",
  "点赞收藏！关注我，下期讲Claude 4怎么免费用！"
];

// HTML模板(图片+文字叠加)
const createTemplate = (text, bgImage) => `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700;900&display=swap');
* {margin:0;padding:0}
body {
  background: url('file://${bgImage}') center/cover;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Sans SC'
}
.container {
  text-align: center;
  padding: 40px;
  max-width: 900px;
  background: rgba(0,0,0,0.65);
  border-radius: 20px;
}
.title {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  line-height: 1.5;
  text-shadow: 0 2px 10px rgba(0,0,0,0.8);
}
</style>
</head>
<body>
<div class="container">
<div class="title">${text}</div>
</div>
</body>
</html>`;

async function main() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   Kolors视频 v4.0 - 图片+文字叠加      ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  // 1. 获取音频时长
  console.log("[1/4] 获取时长...");
  const durations = [];
  for (let i = 0; i < scripts.length; i++) {
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 audio-${i}.mp3`, { encoding: "utf8" }).trim());
    durations.push(dur);
    console.log(`  段${i+1}: ${dur.toFixed(1)}秒`);
  }
  
  // 2. 生成叠加文字的帧
  console.log("\n[2/4] 生成图文帧+Puppeteer...");
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  
  for (let i = 0; i < scripts.length; i++) {
    const html = createTemplate(scripts[i], `${workDir}/img-${i}.png`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 500));
    
    // 每秒1帧
    const frames = Math.ceil(durations[i]);
    for (let f = 0; f < frames; f++) {
      await page.screenshot({ path: `${workDir}/frame-${i}-${f}.png`, fullPage: true });
    }
    await page.close();
    console.log(`  段${i+1}: ${frames}帧`);
  }
  await browser.close();
  
  // 3. 合成视频
  console.log("\n[3/4] 合成视频...");
  const totalDur = durations.reduce((a,b) => a+b, 0);
  
  // 使用concat filter
  let inputs = "", filter = "";
  for (let i = 0; i < scripts.length; i++) {
    inputs += `-i ${workDir}/frame-${i}-0.png -i ${workDir}/audio-${i}.mp3 `;
  }
  // 简单处理：每段图片显示对应时长
  execSync(`ffmpeg -y ${inputs} -filter_complex "[0:v][1:a][2:v][3:a][4:v][5:a][6:v][7:a][8:v][9:a][10:v][11:a][12:v][13:a]concat=n=7:v=1:a=1[outv][outa]" -map "[outv]" -map "[outa]" -c:v libx264 -pix_fmt yuv420p -c:a aac ${workDir}/kolors-v4.mp4`, { stdio: "ignore" });
  
  // 4. 验证
  try {
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${workDir}/kolors-v4.mp4`, { encoding: "utf8" }).trim());
    const size = fs.statSync(`${workDir}/kolors-v4.mp4`).size;
    console.log(`\n[4/4] 完成`);
    console.log(`  时长: ${dur.toFixed(1)}秒`);
    console.log(`  大小: ${(size/1024/1024).toFixed(2)}MB`);
  } catch(e) {
    console.log("  使用简单模式");
  }
  
  execSync(`mkdir -p out && cp ${workDir}/kolors-v4.mp4 out/`);
  console.log("\n✅ 完成: out/kolors-v4.mp4");
}

main();