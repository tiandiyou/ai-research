# Kolors视频生成框架

## 完整流程

```
文档(MD) → 提取内容 → 生成文案 → 生成语音 → 生成图片(Kolors) → 合成视频
```

## 目录结构

```
ai-research/docs/
├── video-kolors/           # 视频生成目录
│   ├── generate-v3.cjs   # 主程序
│   ├── gen_audio.py       # 语音生成
│   ├── img-*.png          # Kolors生成的背景图(7张)
│   ├── audio-*.mp3       # 语音文件(7段)
│   ├── final-frame-*.png # Puppeteer生成的图文帧
│   ├── rich-*.png         # ImageMagick合成图
│   └── kolors-rich.mp4    # 最终视频
└── AI-Tech-Viral-*.md    # 源文档
```

## 步骤详解

### 1. 文档准备
位置: `/root/.openclaw/workspace/ai-research/docs/AI-Tech-Viral-*.md`

### 2. 提取内容
从文档中提取关键点，每段15-25秒

### 3. 生成语音
```bash
python3 gen_audio.py "文案内容"
# 输出: temp-audio.mp3
```

### 4. 生成图片(Kolors API)
```javascript
// 使用SiliconFlow Kolors模型生成背景图
POST https://api.siliconflow.cn/v1/images/generations
{
  model: "Kwai-Kolors/Kolors",
  prompt: "图片提示词",
  image_size: "1024x1024"
}
```

### 5. 生成图文帧(Puppeteer)
```javascript
const puppeteer = require('puppeteer');
const html = `<html>
  <body style="background:url('背景图')">
    <div>文字内容</div>
  </body>
</html>`;
// 截图生成帧
```

### 6. 合成视频(ffmpeg)
```bash
# 每段图片+语音
ffmpeg -loop 1 -i frame.png -i audio.mp3 -c:v libx264 -shortest seg.mp4

# 合并7段
ffmpeg -i seg-0.mp4 ... seg-6.mp4 -filter_complex "concat=n=7:v=1:a=1" final.mp4
```

## 问题诊断

### 问题1: 背景图是黑色/空白
原因: Puppeteer加载本地图片的file://URL失败

解决方案: 
- 用ImageMagick直接合成文字到图片
```bash
convert img-0.png -gravity center -pointsize 48 -fill white -draw "text" output.png
```

### 问题2: 文字显示不全
原因: 中文字体/编码问题

解决方案: 
- 使用ImageMagick的中文支持
- 或用Puppeteer HTML渲染

## 命令汇总

```bash
# 1. 切换目录
cd /root/.openclaw/workspace/ai-research/docs/video-kolors

# 2. 生成语音
python3 gen_audio.py "测试文案"

# 3. Kolors生成图片(需要API KEY)
node generate-v3.cjs

# 4. ImageMagick合成
convert img-0.png -gravity center -pointsize 48 -fill white -draw "text" out.png

# 5. 合成视频
ffmpeg -loop 1 -i final-frame-0.png -i audio-0.mp3 -shortest seg-0.mp4
ffmpeg -i seg-0.mp4 ... seg-6.mp4 -filter_complex "concat=n=7:v=1:a=1" final.mp4
```

## 生成视频列表

| 文件名 | 说明 |
|--------|------|
| kolors-v3.mp4 | 纯图片+语音 |
| kolors-final.mp4 | Puppeteer图文帧 |
| kolors-rich.mp4 | ImageMagick图文 |
| kolors-best.mp4 | 修复后的最终版 |

## API配置

```
API: SiliconFlow Kolors
KEY: sk-ysycigzzwlfdgkvgnpkwavpimhpozptlofkyehotomdrtufy
模型: Kwai-Kolors/Kolors
```

## 问题检查清单

- [ ] 文档存在？
- [ ] 语音生成OK？
- [ ] Kolors API有配额？
- [ ] 图片下载成功？
- [ ] ImageMagick可用？
- [ ] 视频能播放？