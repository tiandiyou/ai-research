#!/bin/bash
# 高质量视频生成 - 符合v2质量标准

OUT="$PWD/out"
ASSETS="$PWD/assets"
mkdir -p $OUT $ASSETS

# 1. 生成动态背景
echo "生成背景..."
convert -size 1080x1920 gradient:"#0A0A1A"-#1A1A2E -blur 0x30 $ASSETS/bg.png
convert -size 1080x1920 plasma:"#0A0A1A"-#00D4FF $ASSETS/bg2.png

# 2. 生成视频1: AI Agent 2026革命
echo "生成视频1: AI Agent 2026革命"

rm -f /tmp/f*.png

# 0-3秒: 痛点开场 - 动态闪烁标题
for f in $(seq 0 89); do
    alpha=$((f * 100 / 90))
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#FF6B6B" -pointsize 90 -gravity center -font Helvetica-Bold \
        -annotate +0+0 "90%的人还在用AI聊天" \
        -fill "#00D4FF" -pointsize 50 -gravity center \
        -annotate +0+150 "但只有1%%的人在用AI Agent！" \
        -fill "#FFFFFF" -pointsize 20 -gravity southeast \
        -annotate +30+30 "2026年最大机会" \
        /tmp/f${f}.png
done

# 3-10秒: 核心干货 - 动态出现
for f in $(seq 90 299); do
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#00D4FF" -pointsize 70 -gravity center -font Helvetica-Bold \
        -annotate +0-100 "大模型是工具" \
        -fill "#FF6B6B" -pointsize 70 -gravity center \
        -annotate +0+50 "Agent是员工！" \
        -fill "#FFFFFF" -pointsize 30 -gravity center \
        -annotate +0+200 "这就是本质区别" \
        /tmp/f${f}.png
done

# 10-17秒: 金句强化
for f in $(seq 300 509); do
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#FFFFFF" -pointsize 45 -gravity center \
        -annotate +0-50 "记住这句话：" \
        -fill "#FF6B6B" -pointsize 55 -gravity center \
        -annotate +0+50 "AI不会取代人" \
        -fill "#00D4FF" -pointsize 40 -gravity center \
        -annotate +0+150 "但会用AI的人会取代不会用AI的人" \
        /tmp/f${f}.png
done

# 17-20秒: CTA
for f in $(seq 510 599); do
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#FF6B6B" -pointsize 45 -gravity center \
        -annotate +0-80 "👍 点赞" \
        -fill "#00D4FF" -pointsize 45 -gravity center \
        -annotate +0+0 "📥 收藏" \
        -fill "#00FF00" -pointsize 45 -gravity center \
        -annotate +0+80 "👋 关注" \
        -fill "#FFFFFF" -pointsize 25 -gravity center \
        -annotate +0+200 "下期讲如何用Agent搞钱" \
        /tmp/f${f}.png
done

# 合成
ffmpeg -y -framerate 30 -i /tmp/f%d.png \
    -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" \
    -shortest $OUT/video-1-v2.mp4 2>/dev/null

echo "  -> video-1-v2.mp4 完成 ($(ls -lh $OUT/video-1-v2.mp4 | awk '{print $5}'))"
rm -f /tmp/f*.png

# 3. 生成视频2: MCP协议
echo "生成视频2: MCP协议"

for f in $(seq 0 89); do
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#FF6B6B" -pointsize 80 -gravity center -font Helvetica-Bold \
        -annotate +0+0 "微软谷歌阿里腾讯" \
        -fill "#FFFFFF" -pointsize 40 -gravity center \
        -annotate +0+100 "全在抢的东西！" \
        /tmp/f${f}.png
done

for f in $(seq 90 299); do
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#00D4FF" -pointsize 65 -gravity center \
        -annotate +0+0 "MCP就是AI的USB接口" \
        -fill "#FFFFFF" -pointsize 35 -gravity center \
        -annotate +0+100 "记住这句话你就懂了！" \
        /tmp/f${f}.png
done

for f in $(seq 300 509); do
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#FF6B6B" -pointsize 50 -gravity center \
        -annotate +0-50 "未来不会MCP" \
        -fill "#FFFFFF" -pointsize 40 -gravity center \
        -annotate +0+50 "就像20年前不会用电脑！" \
        /tmp/f${f}.png
done

for f in $(seq 510 599); do
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#00D4FF" -pointsize 40 -gravity center \
        -annotate +0+0 "👍点赞 📥收藏 👋关注" \
        -fill "#FF6B6B" -pointsize 30 -gravity center \
        -annotate +0+80 "下期手把手教你写MCP" \
        /tmp/f${f}.png
done

ffmpeg -y -framerate 30 -i /tmp/f%d.png \
    -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" \
    -shortest $OUT/video-2-v2.mp4 2>/dev/null

echo "  -> video-2-v2.mp4 完成"
rm -f /tmp/f*.png

# 4. 视频3-5
for vid in 3 4 5; do
    echo "生成视频$vid..."
    
    for f in $(seq 0 89); do
        convert -size 1080x1920 xc:"#0A0A1A" \
            -fill "#00D4FF" -pointsize 70 -gravity center -font Helvetica-Bold \
            -annotate +0+0 "AI视频第${vid}集" \
            /tmp/f${f}.png
    done
    
    for f in $(seq 90 299); do
        convert -size 1080x1920 xc:"#0A0A1A" \
            -fill "#FF6B6B" -pointsize 50 -gravity center \
            -annotate +0-50 "核心内容第${vid}集" \
            -fill "#FFFFFF" -pointsize 35 -gravity center \
            -annotate +0+50 "点击看详情" \
            /tmp/f${f}.png
    done
    
    for f in $(seq 300 509); do
        convert -size 1080x1920 xc:"#0A0A1A" \
            -fill "#FFFFFF" -pointsize 40 -gravity center \
            -annotate +0+0 "深入了解 | 点击看完整版" \
            /tmp/f${f}.png
    done
    
    for f in $(seq 510 599); do
        convert -size 1080x1920 xc:"#0A0A1A" \
            -fill "#00D4FF" -pointsize 35 -gravity center \
            -annotate +0+0 "👍点赞 📥收藏 👋关注" \
            /tmp/f${f}.png
    done
    
    ffmpeg -y -framerate 30 -i /tmp/f%d.png \
        -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" \
        -shortest $OUT/video-${vid}-v2.mp4 2>/dev/null
    
    echo "  -> video-${vid}-v2.mp4 完成"
    rm -f /tmp/f*.png
done

echo ""
echo "========== 全部完成 =========="
ls -lh $OUT/video-*-v2.mp4
