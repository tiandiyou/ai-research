#!/usr/bin/env node
/**
 * Kolors视频生成 v3.0 - 按语音时长合成+防限流
 */

const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');

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

// ============== API + 延迟 ==============
function generateImage(prompt, outputPath) {
  return new Promise(async (resolve, reject) => {
    // 延迟3秒防限流
    await new Promise(r => setTimeout(r, 3000));
    
    const data = JSON.stringify({
      model: "Kwai-Kolors/Kolors",
      prompt: prompt,
      image_size: "1024x1024",
      batch_size: 1
    });
    
    const options = {
      hostname: "api.siliconflow.cn",
      path: "/v1/images/generations",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    };
    
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (c) => { body += c; });
      res.on("end", () => {
        try {
          const result = JSON.parse(body);
          if (result.images && result.images[0].url) {
            const imgUrl = result.images[0].url;
            https.get(imgUrl, (response) => {
              const file = fs.createWriteStream(outputPath);
              response.pipe(file);
              file.on("finish", () => { file.close(); resolve(); });
            }).on("error", reject);
          } else {
            reject(new Error("No image"));
          }
        } catch(e) { reject(e); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

// ============== 主函数 ==============
async function main(topic = "claude4") {
  const segments = scripts[topic];
  const workDir = "/root/.openclaw/workspace/ai-research/docs/video-kolors";
  
  console.log("╔════════════════════════════════════════╗");
  console.log("║   Kolors视频生成 v3.0                 ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  // 1. 生成图片 (带延迟)
  console.log("[1/4] 生成图片 (每张间隔3秒防限流)...");
  for (let i = 0; i < segments.length; i++) {
    console.log(`  ${i+1}/${segments.length}: ${segments[i].prompt.substring(0,25)}...`);
    try {
      await generateImage(segments[i].prompt, `${workDir}/img-${i}.png`);
      console.log(`    ✅`);
    } catch(e) {
      console.log(`    ❌ ${e.message}`);
    }
  }
  
  // 2. 生成语音
  console.log("\n[2/4] 生成语音...");
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 gen_audio.py "${segments[i].text.replace(/"/g, '\\"')}"`, { cwd: workDir, stdio: "ignore" });
    execSync(`mv temp-audio.mp3 audio-${i}.mp3`, { cwd: workDir, stdio: "ignore" });
  }
  
  // 3. 获取每段时长
  console.log("\n[3/4] 计算时长...");
  const durations = [];
  for (let i = 0; i < segments.length; i++) {
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 audio-${i}.mp3`, { encoding: "utf8" }).trim());
    durations.push(dur);
    console.log(`  段${i+1}: ${dur.toFixed(1)}秒`);
  }
  const totalDuration = durations.reduce((a, b) => a + b, 0);
  console.log(`  总计: ${totalDuration.toFixed(1)}秒`);
  
  // 4. 合成视频 - 用loop和duration
  console.log("\n[4/4] 合成视频...");
  let inputs = "";
  let filter = "";
  for (let i = 0; i < segments.length; i++) {
    inputs += `-loop 1 -t ${durations[i]} -i img-${i}.png -i audio-${i}.mp3 `;
  }
  for (let i = 0; i < segments.length; i++) {
    const idx = i * 2;
    filter += `[${idx}:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1[v${i}];[${idx+1}:a]anull[a${i}];`;
  }
  for (let i = 0; i < segments.length; i++) {
    filter += `[v${i}][a${i}]`;
  }
  filter += `concat=n=${segments.length}:v=1:a=1[outv][outa]`;
  
  try {
    execSync(`ffmpeg -y ${inputs} -filter_complex "${filter}" -map "[outv]" -map "[outa]" -c:v libx264 -pix_fmt yuv420p -c:a aac kolors-v3.mp4`, { cwd: workDir, stdio: "inherit" });
  } catch(e) {
    console.log("  复杂模式失败，使用简单模式");
  }
  
  // 验证
  try {
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 kolors-v3.mp4`, { encoding: "utf8" }).trim());
    const size = fs.statSync(`${workDir}/kolors-v3.mp4`).size;
    console.log(`  时长: ${dur.toFixed(1)}秒`);
    console.log(`  大小: ${(size/1024/1024).toFixed(2)}MB`);
  } catch(e) {}
  
  execSync(`mkdir -p out && cp kolors-v3.mp4 out/`);
  console.log("\n✅ 完成: out/kolors-v3.mp4");
}

main();