/**
 * 从Markdown文档自动生成视频
 * 使用Remotion渲染
 */
const fs = require('fs');
const path = require('path');

// 文档解析
function parseMarkdown(docPath) {
  const content = fs.readFileSync(docPath, 'utf-8');
  
  // 提取标题
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'AI技术分析';
  
  // 提取关键词
  const keywordsMatch = content.match(/关键词：(.+)$/m);
  const keywords = keywordsMatch ? keywordsMatch[1].split('、') : [];
  
  // 提取正文段落
  const paragraphs = content
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .slice(0, 10); // 取前10段
    
  return {
    title,
    keywords,
    paragraphs,
    duration: paragraphs.length * 5 // 每段5秒
  };
}

// 生成视频配置
function generateVideoConfig(docData) {
  return {
    width: 1920,
    height: 1080,
    fps: 30,
    duration: docData.duration,
    segments: [
      {
        type: 'title',
        duration: 5,
        content: docData.title
      },
      ...docData.paragraphs.map(p => ({
        type: 'content',
        duration: 5,
        content: p
      })),
      {
        type: 'outro',
        duration: 3,
        content: '欢迎关注，学习更多AI技术'
      }
    ]
  };
}

// 主函数
async function main() {
  const docPath = process.argv[2] || './docs/AI-Tech-001.md';
  
  console.log(`📄 解析文档: ${docPath}`);
  
  const docData = parseMarkdown(docPath);
  console.log(`✅ 标题: ${docData.title}`);
  console.log(`✅ 时长: ${docData.duration}秒`);
  
  // 生成视频配置
  const videoConfig = generateVideoConfig(docData);
  
  // 保存配置供Remotion使用
  fs.writeFileSync(
    './src/config.json',
    JSON.stringify(videoConfig, null, 2)
  );
  
  console.log('✅ 视频配置已生成');
  console.log('📹 运行: npm run build');
}

// 执行
main().catch(console.error);