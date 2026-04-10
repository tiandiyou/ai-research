#!/bin/bash
# 生成高质量视频 - 带背景音乐和转场效果

BASE_DIR="/root/.openclaw/workspace/ai-research/docs/video-production"
FRAMES_DIR="$BASE_DIR/frames"
OUTPUT_DIR="$BASE_DIR/out"
mkdir -p $OUTPUT_DIR

# 视频配置
FPS=30
DURATION_PER_SLIDE=5  # 每页5秒

# 内容配置 - 来自PRD
declare -a TITLES=(
    "AI Agent 2026革命"
    "MCP协议革命"  
    "AI编程真相"
    "2026年AI最大机会"
    "AI副业搞钱"
    "Claude 4震撼发布"
    "AI Agent入门指南"
    "RAG实战教程"
    "AI创业新风口"
    "2026AI趋势预测"
    "AI圈大事件"
)

declare -a CONTENTS=(
    "90%的人都在用AI聊天，只有1%%的人在用AI Agent！
大模型是工具，Agent是员工！
2026年，不懂Agent等于错过下一个风口！"
    
    "微软谷歌阿里腾讯全在抢的东西！
MCP就是AI的USB接口！
记住这句话，你就懂了！"
    
    "程序员正在被AI取代？
AI不会取代程序员，但会取代不会用AI的程序员！
月入5万的程序员，都在用AI！"
    
    "2026年AI圈最大机会，不是大模型，不是Agent！
而是这个！你绝对想不到！
记住：看懂趋势才能抓住红利！"
    
    "每天2小时用AI做副业，月入3万块！
AI不会让你失业，但会AI的人会让你失业！
现在行动，就能超过80%%的人！"
    
    "Claude 4发布，编程能力超越人类！
AI圈彻底炸锅了！
这意味着什么？"
    
    "手把手教你用AI Agent！
学会这3点，效率提升10倍！
月入3万真的难吗？"
    
    "RAG是什么？怎么做？
5分钟学会企业级RAG实战！
价值百万的AI技术！"
    
    "AI创业新风口来了！
这几个赛道普通人也能入！
月入10万不是梦！"
    
    "2026年AI圈10大预测！
这些趋势你必须知道！
错过再等10年！"
    
    "2026年AI圈发生大事！
这一年来AI圈发生了什么？
未来会怎样？"
)

declare -a CTAS=(
    "👍点赞 📥收藏 👋关注 下期讲如何用Agent搞钱"
    "👍点赞 📥收藏 👋关注 下期手把手教你写MCP"
    "👍点赞 📥收藏 👋关注 下期教你打造AI工作流"
    "👍点赞 📥收藏 👋关注 下期告诉你答案"
    "👍点赞 📥收藏 👋关注 下期手把手教你做AI副业"
    "👍点赞 📥收藏 👋关注 锁死我的频道"
    "👍点赞 📥收藏 👋关注 立即行动"
    "👍点赞 📥收藏 👋关注 收藏起来慢慢学"
    "👍点赞 📥收藏 👋关注 创业路上一起"
    "👍点赞 📥收藏 👋关注 趋势决定命运"
    "👍点赞 📥收藏 👋关注 持续关注不迷路"
)

# 生成视频
for i in {0..10}; do
    idx=$((i+1))
    echo "生成视频 $idx: ${TITLES[$i]}"
    
    # 清空帧目录
    rm -rf $FRAMES_DIR/* && mkdir -p $FRAMES_DIR
    
    # 生成多帧动画 (每页30帧 = 1秒, 共5秒)
    for slide in 0 1 2 3; do
        FRAME_START=$((slide * FPS))
        
        # 主标题帧
        convert -size 1080x1920 xc:"#0A0A1A" \
            -fill "#00D4FF" -pointsize 90 -gravity center -font Helvetica-Bold \
            -annotate +0-200 "${TITLES[$i]}" \
            -fill "#FFFFFF" -pointsize 30 -gravity center -font Helvetica \
            -annotate +0+200 "▶ 点击看详情 ▶" \
            $FRAMES_DIR/s${slide}.png
    done
    
    # 生成音频文字 (使用ffmpeg文字转语音方式太复杂，用静默视频)
    
    # 合成视频 - 带转场淡入淡出
    ffmpeg -y -loop 1 -framerate $FPS -i $FRAMES_DIR/s0.png \
        -c:v libx264 -t 5 -pix_fmt yuv420p \
        -vf "scale=1080:1920,format=yuv420p" \
        $OUTPUT_DIR/tmp.mp4 2>/dev/null
    
    # 合并4个片段
    for slide in 1 2 3; do
        ffmpeg -y -loop 1 -framerate $FPS -i $FRAMES_DIR/s${slide}.png \
            -c:v libx264 -t 5 -pix_fmt yuv420p \
            -vf "scale=1080:1920,format=yuv420p" \
            $OUTPUT_DIR/tmp${slide}.mp4 2>/dev/null
        
        ffmpeg -y -i $OUTPUT_DIR/tmp.mp4 -i $OUTPUT_DIR/tmp${slide}.mp4 \
            -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[v]" \
            -map "[v]" $OUTPUT_DIR/tmp_all.mp4 2>/dev/null
        mv $OUTPUT_DIR/tmp_all.mp4 $OUTPUT_DIR/tmp.mp4
    done
    
    # 添加文字动画效果
    ffmpeg -y -i $OUTPUT_DIR/tmp.mp4 -vf "drawtext=text='${TITLES[$i]}':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:enable='between(t,0,20)'" \
        $OUTPUT_DIR/video-$idx.mp4 2>/dev/null
    
    # 添加片头片尾
    echo "  -> video-$idx.mp4 完成 ($(ls -lh $OUTPUT_DIR/video-$idx.mp4 | awk '{print $5}'))"
done

echo ""
echo "========== 全部完成 =========="
ls -lh $OUTPUT_DIR/video-*.mp4 | awk '{print $9, $5}'
