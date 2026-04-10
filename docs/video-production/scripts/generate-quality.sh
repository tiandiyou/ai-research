#!/bin/bash
# 高质量视频生成 - 把PRD文案内容嵌入视频

BASE_DIR="/root/.openclaw/workspace/ai-research/docs/video-production"
FRAMES_DIR="$BASE_DIR/frames"
OUTPUT_DIR="$BASE_DIR/out"
mkdir -p $OUTPUT_DIR

# 从PRD读取内容生成高质量视频
# 视频时长控制在15-20秒，每秒一帧文字

declare -a VIDEOS=(
    "1|AI Agent 2026革命|90%%的人都在用AI聊天，只有1%%的人在用AI Agent！|大模型是工具，Agent是员工！这就是本质区别！|2026年，不懂Agent等于错过下一个风口！|记住：AI不会取代人，但会用AI的人会取代不会用AI的人！|月入3万真的难吗？学会Agent，兼职收入翻倍！|👍点赞 📥收藏 👋关注，下期讲如何用Agent搞钱！"
    
    "2|MCP协议革命|微软谷歌阿里腾讯全在抢的东西！|MCP就是AI的USB接口！记住这句话你就懂了！|未来不会MCP，就像20年前不会用电脑！|微软Copilot全面接入，这意味着什么？生态统一已成定局！|月入5万不是梦，MCP开发者正在被疯抢！|👍点赞 📥收藏 👋关注，下期手把手教你写MCP！"
    
    "3|AI编程真相|80%%程序员慌了！AI编程爆火3个月！|AI不会取代程序员，但会取代不会用AI的程序员！|记住：未来属于会提问的人，不会提问就等于不会用AI！|月入5万的程序员，都在用AI！你在干什么？|打造个人AI工作流，让效率翻10倍！|👍点赞 📥收藏 👋关注，下期教你打造AI工作流！"
    
    "4|2026年AI最大机会|2026年AI圈最大机会，不是大模型，不是Agent！|而是这个！你绝对想不到！|记住：看懂趋势才能抓住红利！|90%%的人还没意识到这个机会！|现在入场，你就能超过90%%的人！|👍点赞 📥收藏 👋关注，下期告诉你答案！"
    
    "5|AI副业搞钱|80%%上班族慌了！每天2小时用AI做副业！|月入3万块！这就是AI副业的真相！|AI不会让你失业，但会AI的人会让你失业！|零成本启动，时间灵活，市场需求大！|现在行动，就能超过80%%的人！|👍点赞 📥收藏 👋关注，下期手把手教你做AI副业！"
    
    "6|Claude 4震撼发布 Claude 4发布，编程能力超越人类！|AI圈彻底炸锅了！这意味着什么？|Claude 4 vs GPT-4，谁更强？|AI编程进入新时代！|学会用AI，年薪百万不是梦！|👍点赞 📥收藏 👋关注，锁死我的频道！"
    
    "7|AI Agent入门指南|手把手教你用AI Agent！|学会这3点，效率提升10倍！|第一步：选择合适的Agent工具|第二步：构建自己的工作流|第三步：持续优化和迭代|👍点赞 📥收藏 👋关注，立即行动！"
    
    "8|RAG实战教程|RAG是什么？怎么做？|5分钟学会企业级RAG实战！|向量数据库选择|Embedding优化|效果评估方法|👍点赞 📥收藏 👋关注，收藏起来慢慢学！"
    
    "9|AI创业新风口|AI创业新风口来了！|这几个赛道普通人也能入！|AI应用开发|AI智能硬件|AI内容创作|AI教育服务|月入10万不是梦！|👍点赞 📥收藏 👋关注，创业路上一起！"
    
    "10|2026AI趋势预测|2026年AI圈10大预测！|Agent全面爆发|MCP生态统一|AI编程普及|多模态进化|这些趋势你必须知道！|错过再等10年！|👍点赞 📥收藏 👋关注，趋势决定命运！"
    
    "11|AI圈年度大事件|2026年AI圈发生大事！|ChatGPT发布4.0|Anthropic发布Claude 4|Microsoft发布Copilot|开源模型爆发|这一年AI圈发生了什么？|未来会怎样？|👍点赞 📥收藏 👋关注，持续关注不迷路！"
)

for video_info in "${VIDEOS[@]}"; do
    IFS='|' read -r idx title text1 text2 text3 text4 text5 cta <<< "$video_info"
    
    echo "生成视频 $idx: $title"
    
    rm -rf $FRAMES_DIR/* && mkdir -p $FRAMES_DIR
    
    # 每帧显示一句文案，2秒切换
    frames=("$text1" "$text2" "$text3" "$text4" "$text5" "$cta")
    frame_num=0
    
    for content in "${frames[@]}"; do
        if [ -n "$content" ]; then
            # 文字换行处理
            line1=$(echo "$content" | cut -d'|' -f1)
            line2=$(echo "$content" | cut -d'|' -f2)
            line3=$(echo "$content" | cut -d'|' -f3)
            
            # 生成文字图片
            if [ -n "$line3" ]; then
                convert -size 1080x1920 xc:"#0A0A1A" \
                    -fill "#00D4FF" -pointsize 70 -gravity center -font Helvetica-Bold \
                    -annotate +0-300 "$line1" \
                    -fill "#FFFFFF" -pointsize 40 -gravity center -font Helvetica \
                    -annotate +0-50 "$line2" \
                    -fill "#FF6B6B" -pointsize 35 -gravity center -font Helvetica \
                    -annotate +0+100 "$line3" \
                    $FRAMES_DIR/f${frame_num}.png
            elif [ -n "$line2" ]; then
                convert -size 1080x1920 xc:"#0A0A1A" \
                    -fill "#00D4FF" -pointsize 70 -gravity center -font Helvetica-Bold \
                    -annotate +0-150 "$line1" \
                    -fill "#FFFFFF" -pointsize 40 -gravity center -font Helvetica \
                    -annotate +0+100 "$line2" \
                    $FRAMES_DIR/f${frame_num}.png
            else
                convert -size 1080x1920 xc:"#0A0A1A" \
                    -fill "#00D4FF" -pointsize 60 -gravity center -font Helvetica-Bold \
                    -annotate +0+0 "$line1" \
                    $FRAMES_DIR/f${frame_num}.png
            fi
            ((frame_num++))
        fi
    done
    
    # 合成视频 (2秒/帧，共12秒)
    if [ $frame_num -gt 0 ]; then
        ffmpeg -y -framerate 0.5 -i $FRAMES_DIR/f%d.png \
            -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" \
            -shortest $OUTPUT_DIR/video-$idx.mp4 2>/dev/null
        echo "  -> video-$idx.mp4 ($(ls -lh $OUTPUT_DIR/video-$idx.mp4 | awk '{print $5}'))"
    fi
done

echo ""
echo "========== 全部完成 =========="
ls -lh $OUTPUT_DIR/video-*.mp4
