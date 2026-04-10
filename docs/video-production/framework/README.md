# 🎬 AI爆款视频生成框架

> 自动生成AI知识类短视频，音视频同步 ✅

## 📋 功能介绍

- 自动生成语音 (Edge TTS)
- 自动生成视频帧 (Puppeteer)
- **音视频同步** (核心功能 ✅)
- 支持多种场景类型

## 🛠️ 依赖

```bash
npm install puppeteer
pip install edge-tts
```

## 🚀 使用方法

### 1. 运行生成器

```bash
cd /root/.openclaw/workspace/ai-research/docs/video-production/framework
node gen-sync-v7.cjs
```

### 2. 生成结果

- 输出目录: `out/`
- 视频文件: `out/ai-coding-sync-v7.mp4`

## 📊 质量检查

运行检查脚本:

```bash
node check-quality.cjs out/ai-coding-sync-v7.mp4
```

检查项:
- 文件大小 (建议3MB+)
- 视频时长 (建议3-5分钟)
- 音视频同步差值 (<0.5秒 ✅)

## 🔧 核心代码

### gen-sync-v7.cjs (最新同步版)

```javascript
// 核心流程:
// 1. 每段文字单独生成语音
// 2. 获取每段语音的实际时长
// 3. 根据实际时长分配帧数 (帧数 = 时长 × fps)
// 4. 合并语音
// 5. 合成视频 (使用语音时长作为总时长)
```

### gen_audio.py

```python
import edge_tts, asyncio, sys

text = sys.argv[1] if len(sys.argv) > 1 else "测试语音"

async def main():
    c = edge_tts.Communicate(text, "zh-CN-XiaoxiaoNeural", rate="+10%")
    await c.save("temp-audio.mp3")

asyncio.run(main())
```

## 📁 文件结构

```
framework/
├── gen-sync-v7.cjs    # 最新同步版生成器
├── gen_audio.py       # 语音生成
├── check-quality.cjs  # 质量检查
├── out/               # 输出目录
│   └── ai-coding-sync-v7.mp4
└── templates/         # HTML模板
```

## 🎯 版本历史

| 版本 | 时长 | 同步差值 | 说明 |
|------|------|----------|------|
| v1-v4 | 1-3分钟 | ❌ | 同步问题 |
| v5 | 3.4分钟 | ❌ | 加长文案 |
| v6 | 4.8分钟 | ❌ | 接近5分钟 |
| v7 | 4.8分钟 | ✅ 0.20秒 | 同步修复 |

## ⚠️ 注意事项

1. **同步问题根源**: 之前版本统一按固定时间分配帧，但语音实际时长不同
2. **解决方案**: 每段文字单独生成语音，获取实际时长后按比例分配帧数
3. **质量检查**: 生成后必须验证同步差值 < 0.5秒

## 📝  License

MIT
