const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');

async function render() {
  // Start Remotion preview server
  console.log('启动Remotion服务器...');
  const server = spawn('npx', ['remotion', 'preview', 'index.ts', '--port', '3000'], {
    stdio: 'pipe',
    shell: true
  });
  
  await new Promise(r => setTimeout(r, 5000));
  
  // Connect via Puppeteer
  console.log('连接Chrome...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--remote-debugging-port=9222']
  });
  
  const pages = await browser.pages();
  if (pages.length === 0) {
    await browser.newPage();
  }
  
  console.log('渲染中...');
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Take screenshot
  await page.screenshot({ path: 'out/screenshot.png', fullPage: true });
  console.log('截图完成!');
  
  await browser.close();
  server.kill();
}

render().catch(console.error);
