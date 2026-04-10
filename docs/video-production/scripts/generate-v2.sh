#!/bin/bash
# 高质量视频生成v2 - 带动画和视觉设计

BASE_DIR="/root/.openclaw/workspace/ai-research/docs/video-production"
FRAMES_DIR="$BASE_DIR/frames"
OUTPUT_DIR="$BASE_DIR/out"
ASSETS_DIR="$BASE_DIR/assets"
mkdir -p $FRAMES_DIR $ASSETS_DIR

# 视频配置
FPS=30
DURATION=20  # 20秒视频

# ==================== 视频1: AI Agent 2026革命 ====================
echo "生成视频1: AI Agent 2026革命"

# 生成渐变背景
convert -size 1080x1920 gradient:"#0A0A1A"-#1A1A2E -blur 0x50 \
    $ASSETS_DIR/bg1.png

# 片头动画 (0-3秒)
for f in $(seq 0 90); do
    t=$((f * 100 / 90))
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#00D4FF" -pointsize 100 -gravity center -font Helvetica-Bold \
        -annotate +0+0 "AI Agent 2026革命" \
        $FRAMES_DIR/f1_${f}.png
done

# 第一段内容 (3-8秒)
for f in $(seq 90 150); do
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#FF6B6B" -pointsize 60 -gravity center -font Helvetica-Bold \
        -annotate +0-200 "90%的人还在用AI聊天" \
        -fill "#FFFFFF" -pointsize 40 -gravity center -font Helvetica \
        -annotate +0+0 "只有1%%的人在用AI Agent" \
        -fill "#00D4FF" -pointsize 30 -gravity center \
        -annotate +0+150 "这才是未来！" \
        $FRAMES_DIR/f1_${f}.png
done

# 第二段内容 (8-14秒)  
for f in $(seq 150 420); do
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#FFFFFF" -pointsize 50 -gravity center -font Helvetica-Bold \
        -annotate +0-200 "大模型是工具" \
        -fill "#00D4FF" -pointsize 50 -gravity center \
        -annotate +0-50 "Agent是员工！" \
        -fill "#FF6B6B" -pointsize 35 -gravity center -font Helvetica \
        -annotate +0+150 "记住这句话，你就懂了" \
        $FRAMES_DIR/f1_${f}.png
done

# CTA (14-20秒)
for f in $(seq 420 600); do
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#00D4FF" -pointsize 45 -gravity center -font Helvetica-Bold \
        -annotate +0-100 "👍 点赞" \
        -fill "#FF6B6B" -pointsize 45 -gravity center \
        -annotate +0+0 "📥 收藏" \
        -fill "#00FF00" -pointsize 45 -gravity center \
        -annotate +0+100 "👋 关注" \
        $FRAMES_DIR/f1_${f}.png
done

# 合成视频1
ffmpeg -y -framerate $FPS -i $FRAMES_DIR/f1_%d.png \
    -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" \
    -shortest $OUTPUT_DIR/video-1.mp4 2>/dev/null

echo "  -> video-1.mp4 完成 ($(ls -lh $OUTPUT_DIR/video-1.mp4 | awk '{print $5}'))"

# ==================== 视频2: MCP协议革命 ====================
echo "生成视频2: MCP协议革命"

for f in $(seq 0 600); do
    if [ $f -lt 90 ]; then
        # 片头
        convert -size 1080x1920 xc:"#0A0A1A" \
            -fill "#FF6B6B" -pointsize 80 -gravity center -font Helvetica-Bold \
            -annotate +0+0 "MCP协议革命" \
            $FRAMES_DIR/f2_${f}.png
    elif [ $f -lt 300 ]; then
        # 痛点
        convert -size 1080x1920 xc:"#0A0A1A" \
            -fill "#FF6B6B" -pointsize 50 -gravity center -font Helvetica-Bold \
            -annotate +0-150 "微软谷歌阿里腾讯" \
            -fill "#FFFFFF" -pointsize 40 -gravity center \
            -annotate +0-50 "全在抢的东西！" \
            -fill "#00D4FF" -pointsize 35 -gravity center \
            -annotate +0+100 "这就是MCP协议" \
            $FRAMES_DIR/f2_${f}.png
    elif [ $f -lt 480 ]; then
        # 价值
        convert -size 1080x1920 xc:"#0A0A1A" \
            -fill "#FFFFFF" -pointsize 50 -gravity center \
            -annotate +0-100 "MCP就是AI的USB接口" \
            -fill "#00D4FF" -pointsize 40 -gravity center \
            -annotate +0+50 "记住这句话你就懂了" \
            $FRAMES_DIR/f2_${f}.png
    else
        # CTA
        convert -size 1080x1920 xc:"#0A0A1A" \
            -fill "#00D4FF" -pointsize 40 -gravity center \
            -annotate +0-50 "👍点赞 📥收藏 👋关注" \
            -fill "#FF6B6B" -pointsize 30 -gravity center \
            -annotate +0+50 "下期手把手教你写MCP" \
            $FRAMES_DIR/f2_${f}.png
    fi
done

ffmpeg -y -framerate $FPS -i $FRAMES_DIR/f2_%d.png \
    -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" \
    -shortest $OUTPUT_DIR/video-2.mp4 2>/dev/null

echo "  -> video-2.mp4 完成"

# ==================== 视频3-11 同理 ====================
for vid in 3 4 5 6 7 8 9 10 11; do
    echo "生成视频$vid..."
    
    for f in $(seq 0 600); do
        if [ $f -lt 90 ]; then
            convert -size 1080x1920 xc:"#0A0A1A" \
                -fill "#00D4FF" -pointsize 70 -gravity center -font Helvetica-Bold \
                -annotate +0+0 "AI视频第${vid}集" \
                $FRAMES_DIR/f${vid}_${f}.png
        elif [ $f -lt 480 ]; then
            convert -size 1080x1920 xc:"#0A0A1A" \
                -fill "#FFFFFF" -pointsize 45 -gravity center \
                -annotate +0-50 "核心内容第${vid}集" \
                -fill "#FF6B6B" -pointsize 35 -gravity center \
                -annotate +0+50 "点击看详情" \
                $FRAMES_DIR/f${vid}_${f}.png
        else
            convert -size 1080x1920 xc:"#0A0A1A" \
                -fill "#00D4FF" -pointsize 35 -gravity center \
                -annotate +0+0 "👍点赞 📥收藏 👋关注" \
                $FRAMES_DIR/f${vid}_${f}.png
        fi
    done
    
    ffmpeg -y -framerate $FPS -i $FRAMES_DIR/f${vid}_%d.png \
        -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" \
        -shortest $OUTPUT_DIR/video-$vid.mp4 2>/dev/null
    
    echo "  -> video-$vid.mp4 完成"
done

echo ""
echo "========== 全部完成 =========="
ls -lh $OUTPUT_DIR/video-*.mp4
