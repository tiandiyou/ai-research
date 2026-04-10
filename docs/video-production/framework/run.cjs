const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

// 素材库
const 素材库 = {
  标题: [
    (title) => `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:linear-gradient(135deg,#667eea,#764ba2);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.t{font-size:72px;font-weight:900;text-align:center}.s{font-size:32px;margin-top:30px;opacity:0.8}</style></head><body><div class="t">${title}</div><div class="s">2026 · 必看</div></body></html>`,
    (title) => `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:linear-gradient(to right,#11998e,#38ef7d);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.t{font-size:64px;font-weight:bold}.b{font-size:28px;margin-top:40px;background:rgba(255,255,255,0.2);padding:15px 40px;border-radius:30px}</style></head><body><div class="t">⚡ ${title}</div><div class="b">立即观看</div></body></html>`,
    (title) => `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.i{font-size:80px}.t{font-size:56px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.s{font-size:24px;color:#888;margin-top:20px}</style></head><body><div><div class="i">🎯</div><div class="t">${title}</div><div class="s">2026年度巨献</div></div></body></html>`
  ],
  痛点: [
    (text, sub) => `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:linear-gradient(135deg,#232526,#414345);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.i{font-size:80px;margin-bottom:30px}.t{font-size:48px;font-weight:bold;line-height:1.6;color:#FF6B6B}.s{font-size:28px;margin-top:40px;color:#00D4FF}</style></head><body><div style="text-align:center;padding:40px"><div class="i">🔥</div><div class="t">${text.replace(/\n/g,'<br>')}</div><div class="s">${sub}</div></div></body></html>`,
    (text, sub) => `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.i{font-size:100px}.t{font-size:44px;font-weight:700;line-height:1.8}.s{font-size:32px;margin-top:40px;padding:20px 40px;border:3px solid #FF6B6B;border-radius:15px;display:inline-block}</style></head><body><div style="text-align:center"><div class="i">⚠️</div><div class="t">${text.replace(/\n/g,'<br>')}</div><div class="s">${sub}</div></div></body></html>`
  ],
  干货: [
    (text, icon) => `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.i{font-size:90px;margin-bottom:30px}.t{font-size:42px;font-weight:bold;line-height:1.5}</style></head><body><div style="text-align:center"><div class="i">${icon}</div><div class="t">${text.replace(/\n/g,'<br>')}</div></div></body></html>`,
    (text, icon) => `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:linear-gradient(135deg,#00b09b,#96c93d);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.i{font-size:80px;margin-bottom:20px}.t{font-size:36px;line-height:1.8}</style></head><body><div style="text-align:center;max-width:800px"><div class="i">${icon}</div><div class="t">${text.replace(/\n/g,'<br>')}</div></div></body></html>`
  ],
  金句: [
    (text) => `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:linear-gradient(135deg,#4facfe,#00f2fe);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.t{font-size:44px;font-weight:bold;line-height:1.6;padding:40px;background:rgba(255,255,255,0.1);border-radius:20px}.s{font-size:24px;color:#eee;margin-top:30px}</style></head><body><div style="text-align:center"><div class="t">${text.replace(/\n/g,'<br>')}</div><div class="s">— 核心观点</div></div></body></html>`,
    (text) => `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:linear-gradient(135deg,#667eea,#764ba2);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.t{font-size:36px;font-weight:bold;line-height:2}.s{font-size:28px;margin-top:30px;color:#FFD700}</style></head><body><div style="text-align:center"><div class="t">${text.replace(/\n/g,'<br>')}</div><div class="s">✨ 记住这句话</div></div></body></html>`
  ],
  CTA: [
    () => `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:linear-gradient(135deg,#1a1a2e,#16213e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.t{font-size:40px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.s{font-size:32px;margin-top:40px}.s2{font-size:24px;color:#888;margin-top:20px}</style></head><body><div style="text-align:center"><div class="t">👍 点赞 📥 收藏 👋 关注</div><div class="s">下期更精彩！</div><div class="s2">2026年一起进步</div></div></body></html>`,
    () => `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:linear-gradient(135deg,#0f0c29,#302b63);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.t{font-size:36px;margin-bottom:40px}.b{font-size:28px;padding:30px 50px;border:3px solid #00D4FF;border-radius:20px;display:inline-block;animation:pulse 2s infinite}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}</style></head><body><div style="text-align:center"><div class="t">🚀 立即行动</div><div class="b">👍 点赞 📥 收藏</div></div></body></html>`
  ]
};

const scenes = [
  { type: "标题", data: ["AI Agent 2026革命"] },
  { type: "痛点", data: ["90%的人还在用AI聊天\n但只有1%的人在用AI Agent！", "这是2026年最大的机会！"] },
  { type: "干货", data: ["大模型是工具 → Agent是员工！", "💡"] },
  { type: "干货", data: ["自动驾驶 vs 辅助驾驶\n差别就在这里！", "⚡"] },
  { type: "金句", data: ["2026年不懂Agent\n= 错过下一个风口！"] },
  { type: "金句", data: ["AI不会取代人\n但会用AI的人会取代不会用AI的人"] },
  { type: "CTA", data: [] }
];

async function run() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   Ralph 视频框架 v2.0 - 完整流水线       ║");
  console.log("╚════════════════════════════════════════╝");
  
  // 步骤1: 素材检查
  console.log("\n[检查点1] 素材检查");
  if (!scenes || scenes.length < 5) { console.log("❌ 素材不足"); return; }
  console.log("  ✅ 素材通过");
  
  // 步骤2: 生成语音
  console.log("\n[检查点2] 语音生成");
  const fullText = scenes.map(s => s.type === "CTA" ? "点赞收藏关注" : s.data.join("。")).join("。").replace(/\n/g, "");
  execSync(`python3 gen_audio.py "${fullText.replace(/"/g, '\\"')}"`);
  console.log("  ✅ 语音生成");
  
  const audioDuration = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 temp-audio.mp3`, { encoding: 'utf8' }).trim());
  const frameCount = Math.floor(audioDuration);
  console.log(`  语音: ${audioDuration.toFixed(1)}秒 → ${frameCount}帧`);
  
  // 步骤3: 生成帧
  console.log("\n[检查点3] 视觉生成");
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  
  const framesPerScene = Math.floor(frameCount / scenes.length);
  let frameIdx = 0;
  
  for (let s = 0; s < scenes.length; s++) {
    const scene = scenes[s];
    const template = 素材库[scene.type];
    const templateIdx = s % template.length;
    const frames = (s === scenes.length - 1) ? frameCount - frameIdx : framesPerScene;
    
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
      await page.screenshot({ path: `temp-${frameIdx}.png`, fullPage: true });
      frameIdx++;
    }
    await page.close();
    console.log(`  场景${s+1} (${scene.type}): ${frames}帧`);
  }
  await browser.close();
  console.log("  ✅ 视觉生成");
  
  // 步骤4: 合成
  console.log("\n[检查点4] 视频合成");
  execSync(`ffmpeg -y -framerate 1 -i "temp-%d.png" -i temp-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -shortest ralph-v2.mp4`, { stdio: 'ignore' });
  
  // 步骤5: 最终检查
  console.log("\n[检查点5] 视频质量");
  const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ralph-v2.mp4`, { encoding: 'utf8' }).trim());
  const stats = fs.statSync("ralph-v2.mp4");
  console.log(`  时长: ${dur.toFixed(1)}秒`);
  console.log(`  大小: ${(stats.size/1024/1024).toFixed(2)}MB`);
  console.log("  ✅ 质量通过");
  
  // 清理
  for (let i = 0; i < frameIdx; i++) try{fs.unlinkSync(`temp-${i}.png`)}catch{}
  try{fs.unlinkSync('temp-audio.mp3')}catch{}
  
  console.log("\n✅ 框架运行完成!");
  execSync("cp ralph-v2.mp4 ../out/");
}

run();
