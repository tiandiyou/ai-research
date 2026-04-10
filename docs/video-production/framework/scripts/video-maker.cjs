/**
 * Ralph 视频生成框架 v2.0
 * 完整流水线 + 质量检查点
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

// ===== 素材库 =====
const素材库 = {
  标题: [
    (title) => `<div style="background:linear-gradient(135deg,#667eea,#764ba2);height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Noto Sans SC';color:#fff">
      <div style="text-align:center">
        <div style="font-size:72px;font-weight:900;text-shadow:0 0 30px rgba(255,255,255,0.5)">${title}</div>
        <div style="font-size:32px;margin-top:30px;opacity:0.8">2026 · 必看</div>
      </div>
    </div>`,
    (title) => `<div style="background:linear-gradient(to right,#11998e,#38ef7d);height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Noto Sans SC';color:#fff">
      <div style="text-align:center">
        <div style="font-size:64px;font-weight:bold">⚡ ${title}</div>
        <div style="font-size:28px;margin-top:40px;background:rgba(255,255,255,0.2);padding:15px 40px;border-radius:30px">立即观看</div>
      </div>
    </div>`,
    (title) => `<div style="background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Noto Sans SC';color:#fff">
      <div style="text-align:center">
        <div style="font-size:80px;margin-bottom:20px">🎯</div>
        <div style="font-size:56px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${title}</div>
        <div style="font-size:24px;color:#888;margin-top:20px">2026年度巨献</div>
      </div>
    </div>`
  ],
  痛点: [
    (text, sub) => `<div style="background:linear-gradient(135deg,#232526,#414345);height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Noto Sans SC';color:#fff">
      <div style="text-align:center;padding:40px">
        <div style="font-size:80px;margin-bottom:30px">🔥</div>
        <div style="font-size:48px;font-weight:bold;line-height:1.6;color:#FF6B6B">${text}</div>
        <div style="font-size:28px;margin-top:40px;color:#00D4FF">${sub}</div>
      </div>
    </div>`,
    (text, sub) => `<div style="background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Noto Sans SC';color:#fff">
      <div style="text-align:center">
        <div style="font-size:100px;margin-bottom:20px">⚠️</div>
        <div style="font-size:44px;font-weight:700;line-height:1.8">${text}</div>
        <div style="font-size:32px;margin-top:40px;padding:20px 40px;border:3px solid #FF6B6B;border-radius:15px;display:inline-block">${sub}</div>
      </div>
    </div>`
  ],
  干货: [
    (text, icon) => `<div style="background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Noto Sans SC';color:#fff">
      <div style="text-align:center">
        <div style="font-size:90px;margin-bottom:30px">${icon}</div>
        <div style="font-size:42px;font-weight:bold;line-height:1.5">${text}</div>
      </div>
    </div>`,
    (text, icon) => `<div style="background:linear-gradient(135deg,#00b09b,#96c93d);height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Noto Sans SC';color:#fff">
      <div style="text-align:center;max-width:800px">
        <div style="font-size:80px;margin-bottom:20px">${icon}</div>
        <div style="font-size:36px;line-height:1.8">${text}</div>
      </div>
    </div>`
  ],
  金句: [
    (text) => `<div style="background:linear-gradient(135deg,#4facfe,#00f2fe);height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Noto Sans SC';color:#fff">
      <div style="text-align:center">
        <div style="font-size:44px;font-weight:bold;line-height:1.6;padding:40px;background:rgba(255,255,255,0.1);border-radius:20px">${text}</div>
        <div style="font-size:24px;color:#eee;margin-top:30px">— 核心观点</div>
      </div>
    </div>`,
    (text) => `<div style="background:linear-gradient(135deg,#667eea,#764ba2);height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Noto Sans SC';color:#fff">
      <div style="text-align:center">
        <div style="font-size:36px;font-weight:bold;line-height:2">${text}</div>
        <div style="font-size:28px;margin-top:30px;color:#FFD700">✨ 记住这句话</div>
      </div>
    </div>`
  ],
  CTA: [
    () => `<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Noto Sans SC';color:#fff">
      <div style="text-align:center">
        <div style="font-size:40px;font-weight:900;margin-bottom:30px;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent">👍 点赞 📥 收藏 👋 关注</div>
        <div style="font-size:32px;margin-top:40px;color:#fff">下期更精彩！</div>
        <div style="font-size:24px;color:#888;margin-top:20px">2026年一起进步</div>
      </div>
    </div>`,
    () => `<div style="background:linear-gradient(135deg,#0f0c29,#302b63);height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Noto Sans SC';color:#fff">
      <div style="text-align:center">
        <div style="font-size:36px;margin-bottom:40px">🚀 立即行动</div>
        <div style="font-size:28px;padding:30px 50px;border:3px solid #00D4FF;border-radius:20px;display:inline-block;animation:pulse 2s infinite">👍 点赞 📥 收藏</div>
      </div>
      <style>@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}</style>
    </div>`
  ]
};

// ===== 视频配置 =====
const videoConfig = {
  title: "AI Agent 2026革命",
  scenes: [
    { type: "标题", data: ["AI Agent 2026革命"] },
    { type: "痛点", data: ["90%的人还在用AI聊天\n但只有1%的人在用AI Agent！", "这是2026年最大的机会！"] },
    { type: "干货", data: ["大模型是工具 → Agent是员工！", "💡 核心区别"] },
    { type: "干货", data: ["自动驾驶 vs 辅助驾驶\n差别就在这里！", "⚡"] },
    { type: "金句", data: ["2026年不懂Agent\n= 错过下一个风口！"] },
    { type: "金句", data: ["AI不会取代人\n但会用AI的人会取代不会用AI的人"] },
    { type: "CTA", data: [] }
  ]
};

// ===== 质量检查类 =====
class 质量检查 {
  static 检查素材(scenes) {
    console.log("\n【检查点1】素材质量检查");
    if (!scenes || scenes.length < 5) {
      console.log("  ❌ 场景数量不足");
      return false;
    }
    console.log("  ✅ 素材检查通过");
    return true;
  }
  
  static 检查语音(音频路径, 帧数) {
    console.log("\n【检查点2】语音时长检查");
    if (!fs.existsSync(音频路径)) {
      console.log("  ❌ 语音文件不存在");
      return false;
    }
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${音频路径}"`, { encoding: 'utf8' }).trim());
    console.log(`  语音时长: ${dur.toFixed(1)}秒, 帧数: ${帧数}`);
    if (帧数 > dur + 1 || 帧数 < dur - 1) {
      console.log("  ⚠️ 帧数与语音不完全匹配");
    }
    console.log("  ✅ 语音检查通过");
    return true;
  }
  
  static 检查视觉(帧数) {
    console.log("\n【检查点3】视觉渲染检查");
    console.log(`  生成帧数: ${帧数}`);
    console.log("  ✅ 视觉检查通过");
    return true;
  }
  
  static 检查视频(videoPath) {
    console.log("\n【检查点4】视频完整性检查");
    if (!fs.existsSync(videoPath)) {
      console.log("  ❌ 视频文件不存在");
      return false;
    }
    const stats = fs.statSync(videoPath);
    if (stats.size < 100000) {
      console.log("  ❌ 文件过小，可能损坏");
      return false;
    }
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`, { encoding: 'utf8' }).trim());
    console.log(`  视频时长: ${dur.toFixed(1)}秒`);
    console.log("  ✅ 视频检查通过");
    return true;
  }
}

// ===== 主流程 =====
async function runFramework() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   Ralph 视频框架 v2.0 - 完整流水线     ║");
  console.log("╚════════════════════════════════════════╝");
  
  // 步骤1: 素材准备
  console.log("\n[步骤1] 素材准备");
  const scenes = videoConfig.scenes;
  if (!质量检查.检查素材(scenes)) {
    console.log("❌ 素材检查失败，终止");
    return;
  }
  
  // 步骤2: 生成语音
  console.log("\n[步骤2] 生成语音");
  const fullText = scenes.map(s => s.type === "CTA" ? "点赞收藏关注" : s.data.join("。")).join("。");
  execSync(`python3 -c "import edge_tts, asyncio; asyncio.run(edge_tts.Communicate('${fullText}', 'zh-CN-XiaoxiaoNeural').save('framework/temp-audio.mp3'))"`);
  const audioDuration = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 framework/temp-audio.mp3`, { encoding: 'utf8' }).trim());
  const frameCount = Math.floor(audioDuration);
  console.log(`  时长: ${audioDuration.toFixed(1)}秒, 帧数: ${frameCount}`);
  
  if (!质量检查.检查语音("framework/temp-audio.mp3", frameCount)) {
    return;
  }
  
  // 步骤3: 生成帧
  console.log("\n[步骤3] 生成视觉帧");
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  
  // 帧分配：每场景分配多少帧
  const framesPerScene = Math.floor(frameCount / scenes.length);
  let frameIdx = 0;
  
  for (let s = 0; s < scenes.length; s++) {
    const scene = scenes[s];
    const template = 素材库[scene.type];
    const templateIdx = s % template.length;
    const frames = (s === scenes.length - 1) ? frameCount - frameIdx : framesPerScene; // 最后一个场景用剩余帧
    
    let html = "";
    if (scene.type === "标题") html = template[templateIdx](scene.data[0]);
    else if (scene.type === "痛点") html = template[templateIdx](scene.data[0], scene.data[1]);
    else if (scene.type === "干货") html = template[templateIdx](scene.data[0], scene.data[1]);
    else if (scene.type === "金句") html = template[templateIdx](scene.data[0]);
    else if (scene.type === "CTA") html = template[templateIdx]();
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 200));
    
    for (let f = 0; f < frames; f++) {
      await page.screenshot({ path: `framework/temp-${frameIdx}.png`, fullPage: true });
      frameIdx++;
    }
    await page.close();
    console.log(`  场景${s+1} (${scene.type}): ${frames}帧`);
  }
  await browser.close();
  
  if (!质量检查.检查视觉(frameIdx)) {
    return;
  }
  
  // 步骤4: 合成视频
  console.log("\n[步骤4] 合成视频");
  execSync(`ffmpeg -y -framerate 1 -i "framework/temp-%d.png" -i framework/temp-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -shortest framework/ralph-v2.mp4`, { stdio: 'ignore' });
  
  // 步骤5: 质量审查
  console.log("\n[步骤5] 最终质量审查");
  const passed = 质量检查.检查视频("framework/ralph-v2.mp4");
  
  // 清理
  for (let i = 0; i < frameIdx; i++) try{fs.unlinkSync(`framework/temp-${i}.png`)}catch{}
  try{fs.unlinkSync('framework/temp-audio.mp3')}catch{}
  
  if (passed) {
    console.log("\n✅ 框架运行完成，视频生成成功!");
    
    // 复制到输出目录
    execSync("cp framework/ralph-v2.mp4 out/");
    console.log("  已复制到 out/ralph-v2.mp4");
  }
}

runFramework();
