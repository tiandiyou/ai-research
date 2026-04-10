const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');

const segments = [
  { text: "AI Agent 2026革命", type: "标题" },
  { text: "90%的人还在用AI聊天，但只有1%的人在用AI Agent！这是2026年最大的机会！", type: "痛点" },
  { text: "大模型是工具，Agent是员工！", type: "干货" },
  { text: "自动驾驶 versus 辅助驾驶，差别就在这里！", type: "干货" },
  { text: "2026年不懂Agent等于错过下一个风口！", type: "金句" },
  { text: "AI不会取代人，但会用AI的人会取代不会用AI的人", type: "金句" },
  { text: "点赞收藏关注，下期讲如何用Agent搞钱！", type: "CTA" }
];

const templates = {
  标题: (t) => `<!DOCTYPE html><html><head><style>*{margin:0}body{background:linear-gradient(135deg,#667eea,#764ba2);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.t{font-size:72px;font-weight:900}.s{font-size:32px;margin-top:30px;opacity:0.8}</style></head><body><div style="text-align:center"><div class="t">${t}</div><div class="s">2026 · 必看</div></div></body></html>`,
  痛点: (t,s) => `<!DOCTYPE html><html><head><style>*{margin:0}body{background:linear-gradient(135deg,#232526,#414345);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.i{font-size:80px}.t{font-size:48px;font-weight:bold;line-height:1.6;color:#FF6B6B}.s{font-size:28px;margin-top:40px;color:#00D4FF}</style></head><body><div style="text-align:center;padding:40px"><div class="i">🔥</div><div class="t">${t.replace(/\n/g,'<br>')}</div><div class="s">${s}</div></div></body></html>`,
  干货: (t,i) => `<!DOCTYPE html><html><head><style>*{margin:0}body{background:linear-gradient(135deg,#134E5E,#71B280);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.i{font-size:90px;margin-bottom:30px}.t{font-size:42px;font-weight:bold;line-height:1.5}</style></head><body><div style="text-align:center"><div class="i">${i}</div><div class="t">${t.replace(/\n/g,'<br>')}</div></div></body></html>`,
  金句: (t) => `<!DOCTYPE html><html><head><style>*{margin:0}body{background:linear-gradient(135deg,#4facfe,#00f2fe);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.t{font-size:44px;font-weight:bold;line-height:1.6;padding:40px;background:rgba(255,255,255,0.1);border-radius:20px}</style></head><body><div style="text-align:center"><div class="t">${t.replace(/\n/g,'<br>')}</div></div></body></html>`,
  CTA: () => `<!DOCTYPE html><html><head><style>*{margin:0}body{background:linear-gradient(135deg,#1a1a2e,#16213e);height:100vh;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Noto Sans SC'}.t{font-size:40px;font-weight:900;background:linear-gradient(90deg,#00D4FF,#00FF88);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.s{font-size:32px;margin-top:40px}.s2{font-size:24px;color:#888;margin-top:20px}</style></head><body><div style="text-align:center"><div class="t">👍 点赞 📥 收藏 👋 关注</div><div class="s">下期更精彩！</div><div class="s2">2026年一起进步</div></div></body></html>`
};

async function run() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   Ralph 框架 v2.2 - 向上取整同步版     ║");
  console.log("╚════════════════════════════════════════╝\n");
  
  // 步骤1: 逐段生成语音，获取实际时长
  console.log("[步骤1] 逐段生成语音，获取实际时长");
  const durations = [];
  let totalAudio = 0;
  
  for (let i = 0; i < segments.length; i++) {
    execSync(`python3 gen_audio.py "${segments[i].text.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    execSync("mv temp-audio.mp3 seg-" + i + ".mp3", { stdio: 'ignore' });
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 seg-${i}.mp3`, { encoding: 'utf8' }).trim());
    durations.push(dur);
    totalAudio += dur;
    console.log(`  段${i+1}: ${dur.toFixed(1)}秒`);
  }
  console.log(`  总时长: ${totalAudio.toFixed(1)}秒\n`);
  
  // 步骤2: 向上取整帧数（关键修复！）
  console.log("[步骤2] 向上取整分配帧数");
  const totalFrames = Math.ceil(totalAudio);  // 向上取整
  console.log(`  帧数: ${totalFrames}帧 (语音向上取整)\n`);
  
  // 步骤3: 按比例分配帧数
  let frameIdx = 0;
  const frame分配 = [];
  
  for (let i = 0; i < segments.length; i++) {
    const frames = (i === segments.length - 1) 
      ? totalFrames - frameIdx 
      : Math.floor((durations[i] / totalAudio) * totalFrames);
    frame分配.push(frames);
    frameIdx += frames;
    console.log(`  段${i+1}: ${frames}帧`);
  }
  console.log(`  总帧数: ${frameIdx}\n`);
  
  // 步骤4: 生成帧
  console.log("[步骤3] 生成帧图片");
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  
  frameIdx = 0;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    let html = "";
    if (seg.type === "标题") html = templates.标题(seg.text);
    else if (seg.type === "痛点") html = templates.痛点(seg.text, "这是2026年最大的机会！");
    else if (seg.type === "干货") html = templates.干货(seg.text, i === 3 ? "⚡" : "💡");
    else if (seg.type === "金句") html = templates.金句(seg.text);
    else if (seg.type === "CTA") html = templates.CTA();
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 200));
    
    for (let f = 0; f < frame分配[i]; f++) {
      await page.screenshot({ path: `frame-${frameIdx}.png`, fullPage: true });
      frameIdx++;
    }
    await page.close();
  }
  await browser.close();
  console.log("  ✅ 完成\n");
  
  // 步骤5: 合并语音
  console.log("[步骤4] 合并语音");
  let filterInputs = "";
  let filterDesc = "";
  for (let i = 0; i < segments.length; i++) {
    filterInputs += `-i seg-${i}.mp3 `;
    filterDesc += `[${i}:a]`;
  }
  filterDesc += `concat=n=${segments.length}:v=0:a=1[out]`;
  execSync(`ffmpeg -y ${filterInputs} -filter_complex "${filterDesc}" -map "[out" combined-audio.mp3`, { stdio: 'ignore' });
  
  const finalDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 combined-audio.mp3`, { encoding: 'utf8' }).trim());
  console.log(`  合并后: ${finalDur.toFixed(1)}秒\n`);
  
  // 步骤6: 合成视频
  console.log("[步骤5] 合成视频");
  // 关键：不用-shortest，让视频以语音为准
  execSync(`ffmpeg -y -framerate 1 -i "frame-%d.png" -i combined-audio.mp3 -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -c:a aac -t ${finalDur} final-v2.2.mp4`, { stdio: 'ignore' });
  
  // 步骤7: 验证
  console.log("\n[步骤6] 验证同步");
  const videoDur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 final-v2.2.mp4`, { encoding: 'utf8' }).trim());
  const diff = Math.abs(videoDur - finalDur);
  const syncOK = diff < 0.5;
  
  console.log(`  视频: ${videoDur.toFixed(1)}秒`);
  console.log(`  语音: ${finalDur.toFixed(1)}秒`);
  console.log(`  差值: ${diff.toFixed(1)}秒 ${syncOK ? '✅ 同步' : '❌ 不同步'}`);
  
  // 清理
  for (let i = 0; i < frameIdx; i++) try{fs.unlinkSync(`frame-${i}.png`)}catch{}
  for (let i = 0; i < segments.length; i++) try{fs.unlinkSync(`seg-${i}.mp3`)}catch{}
  try{fs.unlinkSync('combined-audio.mp3')}catch{}
  
  if (syncOK) {
    execSync("cp final-v2.2.mp4 ../out/ralph-v2.2.mp4");
    console.log("\n✅ 已保存到 out/ralph-v2.2.mp4");
  } else {
    console.log("\n❌ 仍需调整");
  }
}

run();
