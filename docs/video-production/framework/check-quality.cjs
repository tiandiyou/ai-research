/**
 * 视频质量检查器
 * 在生成视频后自动检查质量
 */

const { execSync } = require('child_process');
const fs = require('fs');

function checkVideo(videoPath) {
  console.log("\n" + "═".repeat(50));
  console.log("🔍 视频质量检查");
  console.log("═".repeat(50));
  
  let errors = [];
  let warnings = [];
  
  // 1. 检查文件存在
  if (!fs.existsSync(videoPath)) {
    errors.push("❌ 文件不存在: " + videoPath);
    return { pass: false, errors, warnings };
  }
  
  const stats = fs.statSync(videoPath);
  const sizeMB = stats.size / 1024 / 1024;
  
  // 2. 检查文件大小
  console.log(`\n📏 文件大小: ${sizeMB.toFixed(2)}MB`);
  if (sizeMB < 1) {
    errors.push(`❌ 文件太小: ${sizeMB.toFixed(2)}MB (至少1MB)`);
  } else if (sizeMB < 3) {
    warnings.push(`⚠️ 文件偏小: ${sizeMB.toFixed(2)}MB (建议3MB+)`);
  } else if (sizeMB > 50) {
    warnings.push(`⚠️ 文件偏大: ${sizeMB.toFixed(2)}MB (可能需要压缩)`);
  }
  
  // 3. 检查视频时长
  try {
    const duration = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`, { encoding: 'utf8' }).trim());
    const durationMin = duration / 60;
    console.log(`⏱️ 视频时长: ${duration.toFixed(1)}秒 (${durationMin.toFixed(1)}分钟)`);
    
    if (duration < 60) {
      errors.push(`❌ 时长太短: ${duration.toFixed(1)}秒 (至少60秒)`);
    } else if (duration < 180) {
      warnings.push(`⚠️ 时长偏短: ${duration.toFixed(1)}秒 (建议3分钟+)`);
    } else if (duration > 600) {
      warnings.push(`⚠️ 时长偏长: ${duration.toFixed(1)}秒 (建议10分钟以内)`);
    }
    
    // 4. 检查音视频同步
    const audioDuration = parseFloat(execSync(`ffprobe -v error -show_entries stream=duration -of default=noprint_wrappers=nokey=1 "${videoPath}" -select_streams a:0`, { encoding: 'utf8' }).trim());
    const syncDiff = Math.abs(duration - audioDuration);
    console.log(`🔊 音频时长: ${audioDuration.toFixed(1)}秒`);
    console.log(`🔄 同步检查: 差值 ${syncDiff.toFixed(1)}秒`);
    
    if (syncDiff > 1) {
      errors.push(`❌ 音视频不同步: 差值 ${syncDiff.toFixed(1)}秒`);
    }
    
    // 5. 检查视频编码
    const videoInfo = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,rFrame_rate -of default=noprint_wrappers=nokey=1 "${videoPath}"`, { encoding: 'utf8' }).trim();
    console.log(`🎬 视频信息:\n${videoInfo}`);
    
    // 6. 检查音频编码
    const audioInfo = execSync(`ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate -of default=noprint_wrappers=nokey=1 "${videoPath}"`, { encoding: 'utf8' }).trim();
    console.log(`🔊 音频信息:\n${audioInfo}`);
    
  } catch (e) {
    errors.push("❌ 无法读取视频信息: " + e.message);
  }
  
  // 总结
  console.log("\n" + "═".repeat(50));
  console.log("📋 检查结果");
  console.log("═".repeat(50));
  
  if (errors.length > 0) {
    console.log("\n❌ 错误:");
    errors.forEach(e => console.log("  " + e));
  }
  
  if (warnings.length > 0) {
    console.log("\n⚠️ 警告:");
    warnings.forEach(w => console.log("  " + w));
  }
  
  const pass = errors.length === 0;
  console.log(`\n${pass ? "✅ 通过检查" : "❌ 未通过检查"}`);
  console.log("═".repeat(50));
  
  return { pass, errors, warnings };
}

// 运行检查
const videoPath = process.argv[2] || "out/ai-coding-v6.mp4";
const result = checkVideo(videoPath);
process.exit(result.pass ? 0 : 1);
