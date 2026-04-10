#!/usr/bin/env node
/**
 * 批量视频渲染脚本
 * 遍历prd目录，渲染每个视频
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PRD_DIR = './prd';
const OUT_DIR = './out';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getPrdFiles() {
  return fs.readdirSync(PRD_DIR)
    .filter(f => f.endsWith('.json'))
    .filter(f => !f.startsWith('prd-'));
}

function renderVideo(prdFile) {
  const outputName = prdFile.replace('.json', '.mp4');
  const outputPath = path.join(OUT_DIR, outputName);
  
  console.log(`\n📹 渲染: ${prdFile} → ${outputName}`);
  
  try {
    execSync(
      `npx remotion render index.ts AiTutorial "${outputPath}"`,
      { stdio: 'inherit' }
    );
    console.log(`✅ 完成: ${outputName}`);
    return true;
  } catch (err) {
    console.error(`❌ 失败: ${prdFile}`, err.message);
    return false;
  }
}

function main() {
  console.log('🎬 视频批量渲染开始\n');
  console.log('=' .repeat(50));
  
  ensureDir(OUT_DIR);
  
  const prdFiles = getPrdFiles();
  console.log(`找到 ${prdFiles.length} 个PRD文件\n`);
  
  let success = 0;
  let failed = 0;
  
  for (const prd of prdFiles) {
    if (renderVideo(prd)) {
      success++;
    } else {
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 渲染结果: 成功 ${success}, 失败 ${failed}`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

main();
