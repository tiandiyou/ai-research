#!/usr/bin/env node
/**
 * Kolors视频生成框架 v1.0
 * 流程: 文案 → Kolors生成图片 → 合成视频
 */

const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');
const http = require('http');

const API_KEY = "sk-ysycigzzwlfdgkvgnpkwavpimhpozptlofkyehotomdrtufy";

// ============== 爆款文案库 ==============
const scripts = {
  claude4: [
    { text: "GPT-4最强对手！Claude 4实测，我惊了！编程超越GPT-4，长文50万Token", prompt: "futuristic AI brain, glowing neural network, blue and purple, technology concept, 8k" },
    { text: "编程实测：GPT-4写2000行，错误15个。Claude 4写3500行，错误1个！", prompt: "programmer coding, holographic screen, code floating, futuristic office, 8k" },
    { text: "推理测试：GPT-4用15步，Claude 4用8步，还给出3种解法！", prompt: "math problem solving, glowing equations, 3D brain, purple blue gradient, 8k" },
    { text: "长文理解20万→50万Token，提升150%！速度提升30%！", prompt: "document analysis, huge paper stack, glowing lines, blue gradient, 8k" },
    { text: "GPT-4要30分钟，Claude 4只要8分钟！效率提升4倍！", prompt: "fast runner, speed blur, futuristic, orange glow, 8k" },
    { text: "Anthropic在第五层，GPT-4在第一层。格局彻底变了！", prompt: "chess pieces, AI victory, glowing crown, purple gold, 8k" },
    { text: "点赞收藏！关注我，下期讲Claude 4怎么免费用！", prompt: "subscribe, like button, notification bell, social media icons, glowing blue, 8k" }
  ]
};

// ============== Kolors API ==============
async function generateImage(prompt, outputPath) {
  return new Promise((resolve, reject) => {
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
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          if (result.images && result.images[0]) {
            // 下载图片
            const imgUrl = result.images[0].url;
            const file = fs.createWriteStream(outputPath);
            https.get(imgUrl, (response) => {
              response.pipe(file);
              file.on('finish', () => { file.close(); resolve(); });
            }).on('error', reject);
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

// ============== 视频合成 ==============
function createVideo(segments, outputPath) {
  // 生成语音
  console.log("[1/4] 生成语音...");
  const audioFiles = [];
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 gen_audio.py "${segments[i].text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync(`mv temp-audio.mp3 audio-${i}.mp3`, { stdio: 'ignore' });
    audioFiles.push(`audio-${i}.mp3`);
  }
  
  // 合并音频
  let filter = "";
  audioFiles.forEach((f, i) => filter += `-i ${f} `);
  let complex = "";
  audioFiles.forEach((_, i) => complex += `[${i}:a]`);
  complex += `concat=n=${segments.length}:v=0:a=1[out]`;
  
  execSync(`ffmpeg -y ${filter} -filter_complex "${complex}" -map "[out" combined.mp3`, { stdio: 'ignore' });
  
  // 计算总时长
  const duration = parseFloat(execSync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 combined.mp3`,
    { encoding: 'utf8' }
  ).trim());
  
  // 合成视频 (每张图片展示duration秒)
  const imageList = segments.map((_, i) => `-loop 1 -t ${duration/segments.length} -i img-${i}.png`).join(' ');
  
  // 简单方法：每张图对应一段音频
  let inputs = "";
  let filterComplex = "";
  for (let i = 0; i < segments.length; i++) {
    inputs += `-i img-${i}.png -i audio-${i}.mp3 `;
  }
  for (let i = 0; i < segments.length; i++) {
    filterComplex += `[${i}:v]setpts=PTS-STARTPTS+${i*(duration/segments.length)}/TB[v${i}];[${i+segments.length}:a]aload[v${i}];`;
  }
  // 这里简化处理，直接用concat
  execSync(`ffmpeg -y ${inputs} -filter_complex "[0:v][1:a][1:v][2:a][2:v][3:a][3:v][4:a][4:v][5:a][6:v][7:a]concat=n=7:v=1:a=1[outv][outa]" -map "[outv]" -map "[outa]" -t ${duration} ${outputPath}`, { stdio: 'inherit' });
  
  // 清理
  audioFiles.forEach(f => fs.unlinkSync(f));
  fs.unlinkSync('combined.mp3');
  
  return duration;
}

// ============== 主函数 ==============
async function main(topic = 'claude4') {
  const segments = scripts[topic];
  
  console.log("╔════════════════════════════════════════╗");
  console.log("║   Kolors视频生成 - v1.0             ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  // 1. 生成图片
  console.log("[1/4] 生成图片 (Kolors)...");
  for (let i = 0; i < segments.length; i++) {
    console.log(`  图片 ${i+1}/${segments.length}...`);
    try {
      await generateImage(segments[i].prompt, `img-${i}.png`);
      console.log(`  ✅ img-${i}.png`);
    } catch(e) {
      console.log(`  ❌ 生成失败: ${e.message}`);
    }
  }
  
  // 2. 生成语音
  console.log("\n[2/4] 生成语音...");
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 gen_audio.py "${segments[i].text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync(`mv temp-audio.mp3 audio-${i}.mp3`, { stdio: 'ignore' });
    console.log(`  ✅ audio-${i}.mp3`);
  }
  
  // 3. 合成视频
  console.log("\n[3/4] 合成视频...");
  const duration = createVideo(segments, 'kolors-video.mp4');
  console.log(`  ✅ 时长: ${duration.toFixed(1)}秒`);
  
  // 4. 保存
  console.log("\n[4/4] 保存...");
  execSync("mkdir -p out && cp kolors-video.mp4 out/kolors-video.mp4");
  console.log("  ✅ out/kolors-video.mp4");
  
  console.log("\n✅ 完成！");
}

main();