/**
 * 视频质量检查工具
 * 检查：时长、分辨率、帧率、音频、文件大小
 */

const { execSync } = require('child_process');
const fs = require('fs');

function checkVideo(videoPath) {
  console.log(`\n📊 检查视频: ${videoPath}\n`);
  console.log("═".repeat(50));
  
  // 1. 文件存在检查
  if (!fs.existsSync(videoPath)) {
    console.log("❌ 文件不存在!");
    return { score: 0, issues: ["文件不存在"] };
  }
  
  // 2. 获取文件大小
  const stats = fs.statSync(videoPath);
  const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`📁 文件大小: ${fileSizeMB} MB`);
  
  let issues = [];
  let score = 100;
  
  // 3. 获取视频信息
  try {
    const output = execSync(`ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=width,height,codec_name,r_frame_rate,duration -of json "${videoPath}"`, { encoding: 'utf8' });
    const info = JSON.parse(output);
    
    // 解析视频信息
    const videoStream = info.streams?.find(s => s.codec_type === "video");
    const audioStream = info.streams?.find(s => s.codec_type === "audio");
    const format = info.format;
    
    // 时长检查
    const duration = parseFloat(format?.duration || 0);
    console.log(`⏱️  时长: ${duration.toFixed(1)}秒`);
    if (duration < 30) {
      issues.push(`时长过短: ${duration.toFixed(1)}秒 (建议30-60秒)`);
      score -= 20;
    } else if (duration > 120) {
      issues.push(`时长过长: ${duration.toFixed(1)}秒 (建议30-60秒)`);
      score -= 10;
    }
    
    // 分辨率检查
    const width = videoStream?.width || 0;
    const height = videoStream?.height || 0;
    console.log(`📐 分辨率: ${width}x${height}`);
    if (width < 720 || height < 1280) {
      issues.push(`分辨率不足: ${width}x${height} (建议1080x1920)`);
      score -= 25;
    }
    
    // 帧率检查
    const fps = videoStream?.r_frame_rate || "0";
    const fpsNum = eval(fps);
    console.log(`🎬 帧率: ${fps} fps`);
    if (fpsNum < 24) {
      issues.push(`帧率过低: ${fps} fps (建议25-30fps)`);
      score -= 15;
    }
    
    // 音频检查
    if (audioStream) {
      console.log(`🔊 音频: ✅ 有音频 (${audioStream.codec_name})`);
    } else {
      issues.push("缺少音频");
      score -= 30;
    }
    
    // 比特率检查
    const bitrate = parseInt(format?.bit_rate || 0) / 1000;
    console.log(`📶 比特率: ${bitrate} kbps`);
    if (bitrate < 500) {
      issues.push(`比特率过低: ${bitrate}kbps (可能导致画质模糊)`);
      score -= 15;
    }
    
  } catch (e) {
    issues.push("无法读取视频信息: " + e.message);
    score = 0;
  }
  
  // 4. 质量评分
  console.log("\n" + "═".repeat(50));
  console.log("📈 质量评分:");
  console.log("═".repeat(50));
  
  if (score >= 90) console.log("✅ 优秀 (90-100)");
  else if (score >= 70) console.log("✅ 良好 (70-89)");
  else if (score >= 50) console.log("⚠️  一般 (50-69)");
  else console.log("❌ 不合格 (<50)");
  
  console.log(`   得分: ${score}/100`);
  
  // 5. 问题列表
  if (issues.length > 0) {
    console.log("\n⚠️  发现问题:");
    issues.forEach((issue, i) => console.log(`   ${i+1}. ${issue}`));
  } else {
    console.log("\n✅ 无问题发现!");
  }
  
  return { score, issues, fileSize: fileSizeMB };
}

// 检查所有视频
console.log("🎬 视频质量检查工具 v1.0");
console.log("═".repeat(50));

const videos = [
  "out/demo-final.mp4",
  "out/demo-hq.mp4", 
  "out/video-enhanced-1.mp4"
];

videos.forEach(v => {
  if (fs.existsSync(v)) {
    checkVideo(v);
  }
});

console.log("\n✅ 检查完成!");
