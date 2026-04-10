#!/bin/bash
# 用ffmpeg生成幻灯片视频

FRAMES_DIR="frames"
OUTPUT_DIR="out"
mkdir -p $OUTPUT_DIR

# 生成文字帧图片
echo "生成帧图片..."

# 帧1: 标题
convert -size 1080x1920 xc:"#0A0A1A" \
    -fill "#00D4FF" -pointsize 80 -gravity center \
    -annotate +0+0 "AI Agent 2026革命" \
    $FRAMES_DIR/frame1.png

# 帧2: 第一个要点
convert -size 1080x1920 xc:"#0A0A1A" \
    -fill "#FFFFFF" -pointsize 50 -gravity center \
    -annotate +0-100 "为什么Agent是未来？" \
    -fill "#FF6B6B" -pointsize 40 -gravity center \
    -annotate +0+50 "大模型是工具，Agent是员工" \
    $FRAMES_DIR/frame2.png

# 帧3: 第二个要点
convert -size 1080x1920 xc:"#0A0A1A" \
    -fill "#FFFFFF" -pointsize 50 -gravity center \
    -annotate +0-100 "普通人如何抓住红利" \
    -fill "#00FF00" -pointsize 40 -gravity center \
    -annotate +0+50 "学Agent开发月入3万" \
    $FRAMES_DIR/frame3.png

# 帧4: CTA
convert -size 1080x1920 xc:"#0A0A1A" \
    -fill "#00D4FF" -pointsize 60 -gravity center \
    -annotate +0-50 "点赞收藏关注" \
    -fill "#FF6B6B" -pointsize 40 -gravity center \
    -annotate +0+50 "下期讲如何用Agent搞钱" \
    $FRAMES_DIR/frame4.png

# 用ffmpeg合成视频 (5秒每帧 = 30fps * 5s = 150帧)
echo "合成视频..."
ffmpeg -y -framerate 1/5 -i $FRAMES_DIR/frame%d.png \
    -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" \
    $OUTPUT_DIR/video.mp4 2>&1 | tail -10

echo "完成！视频保存在: $OUTPUT_DIR/video.mp4"
ls -lh $OUTPUT_DIR/video.mp4
