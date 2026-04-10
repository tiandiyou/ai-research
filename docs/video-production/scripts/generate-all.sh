#!/bin/bash
# 批量生成11个视频

BASE_DIR="/root/.openclaw/workspace/ai-research/docs/video-production"
FRAMES_DIR="$BASE_DIR/frames"
OUTPUT_DIR="$BASE_DIR/out"
mkdir -p $OUTPUT_DIR

# 视频内容配置
declare -a TITLES=(
    "AI Agent 2026革命"
    "MCP协议革命"
    "AI编程真相"
    "2026年AI最大机会"
    "AI副业搞钱"
    "AI圈第6件大事"
    "AI圈第7件大事"
    "AI圈第8件大事"
    "AI圈第9件大事"
    "AI圈第10件大事"
    "AI圈第11件大事"
)

declare -a POINTS=(
    "大模型是工具，Agent是员工"
    "MCP就是AI的USB接口"
    "AI不会取代程序员"
    "普通人机会来了"
    "每天2小时，月入3万"
    "行业巨变，机会来了"
    "抓住这波红利"
    "现在入场还不晚"
    "月入翻倍不是梦"
    "改变命运的机会"
    "2026AI圈大事"
)

# 生成视频
for i in {0..10}; do
    idx=$((i+1))
    echo "生成视频 $idx: ${TITLES[$i]}"
    
    # 清空帧目录
    rm -f $FRAMES_DIR/*.png
    
    # 帧1: 标题
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#00D4FF" -pointsize 80 -gravity center -font Helvetica \
        -annotate +0+0 "${TITLES[$i]}" \
        $FRAMES_DIR/frame1.png
    
    # 帧2: 要点1
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#FFFFFF" -pointsize 50 -gravity center -font Helvetica \
        -annotate +0-50 "核心观点" \
        -fill "#FF6B6B" -pointsize 40 -gravity center -font Helvetica \
        -annotate +0+50 "${POINTS[$i]}" \
        $FRAMES_DIR/frame2.png
    
    # 帧3: 要点2
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#FFFFFF" -pointsize 50 -gravity center -font Helvetica \
        -annotate +0-50 "实操建议" \
        -fill "#00FF00" -pointsize 40 -gravity center -font Helvetica \
        -annotate +0+50 "立即行动，改变未来" \
        $FRAMES_DIR/frame3.png
    
    # 帧4: CTA
    convert -size 1080x1920 xc:"#0A0A1A" \
        -fill "#00D4FF" -pointsize 60 -gravity center -font Helvetica \
        -annotate +0-30 "👍点赞 📥收藏 👋关注" \
        -fill "#FF6B6B" -pointsize 35 -gravity center -font Helvetica \
        -annotate +0+50 "下期更精彩！" \
        $FRAMES_DIR/frame4.png
    
    # 合成视频 (5秒每帧 = 20秒)
    ffmpeg -y -framerate 1/5 -i $FRAMES_DIR/frame%d.png \
        -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" \
        -shortest $OUTPUT_DIR/video-$idx.mp4 2>/dev/null
    
    echo "  -> video-$idx.mp4 完成"
done

echo ""
echo "全部完成！"
ls -lh $OUTPUT_DIR/*.mp4
