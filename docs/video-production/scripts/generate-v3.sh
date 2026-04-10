#!/bin/bash
# 高质量视频 - 20秒/个

OUT="$PWD/out"
mkdir -p $OUT

declare -a VIDEOS=(
    "1|AI Agent 2026革命|90%%的人还在用AI聊天|只有1%%的人在用AI Agent|大模型是工具，Agent是员工！|记住这句话，你就懂了！|👍点赞 📥收藏 👋关注"
    "2|MCP协议革命|微软谷歌阿里腾讯全在抢|MCP就是AI的USB接口！|记住这句话你就懂了！|未来不会MCP就像不会用电脑|👍点赞 📥收藏 👋关注"
    "3|AI编程真相|80%%程序员慌了！|AI不会取代程序员|但会取代不会用AI的程序员！|月入5万的都在用AI！|👍点赞 📥收藏 👋关注"
    "4|2026AI最大机会|不是大模型，不是Agent！|而是这个！你绝对想不到！|看懂趋势才能抓住红利！|现在入场超过90%%的人！|👍点赞 📥收藏 👋关注"
    "5|AI副业搞钱|每天2小时用AI做副业|月入3万块！|AI不会让你失业|但会AI的人会让你失业！|👍点赞 📥收藏 👋关注"
    "6|Claude 4震撼发布|Claude 4发布|编程能力超越人类！|AI圈彻底炸锅！|这就是新时代！|👍点赞 📥收藏 👋关注"
    "7|AI Agent入门指南|手把手教你用Agent|学会这3点效率提升10倍|第一步：选对工具|第二步：建工作流|👍点赞 📥收藏 👋关注"
    "8|RAG实战教程|RAG是什么？怎么做？|5分钟学会企业级RAG！|向量数据库选择|Embedding优化|👍点赞 📥收藏 👋关注"
    "9|AI创业新风口|AI创业新风口来了！|这几个赛道普通人也能入！|AI应用开发|AI内容创作|👍点赞 📥收藏 👋关注"
    "10|2026AI趋势预测|2026年AI圈10大预测！|Agent全面爆发|MCP生态统一|AI编程普及|👍点赞 📥收藏 👋关注"
    "11|AI圈年度大事件|2026年AI圈发生大事！|ChatGPT 4.0发布|Claude 4发布|开源模型爆发|👍点赞 📥收藏 👋关注"
)

for v in "${VIDEOS[@]}"; do
    IFS='|' read -r idx title t1 t2 t3 t4 cta <<< "$v"
    echo "生成 $idx: $title"
    
    rm -f /tmp/f*.png
    
    # 生成600帧 (20秒 @ 30fps)
    for f in $(seq 0 599); do
        if [ $f -lt 90 ]; then
            convert -size 1080x1920 xc:"#0A0A1A" \
                -fill "#00D4FF" -pointsize 80 -gravity center -font Helvetica-Bold \
                -annotate +0+0 "$title" \
                /tmp/f${f}.png
        elif [ $f -lt 300 ]; then
            convert -size 1080x1920 xc:"#0A0A1A" \
                -fill "#FF6B6B" -pointsize 50 -gravity center -font Helvetica-Bold \
                -annotate +0-100 "$t1" \
                -fill "#FFFFFF" -pointsize 40 -gravity center \
                -annotate +0+50 "$t2" \
                /tmp/f${f}.png
        elif [ $f -lt 480 ]; then
            convert -size 1080x1920 xc:"#0A0A1A" \
                -fill "#FFFFFF" -pointsize 50 -gravity center -font Helvetica \
                -annotate +0-80 "$t3" \
                -fill "#00D4FF" -pointsize 40 -gravity center \
                -annotate +0+50 "$t4" \
                /tmp/f${f}.png
        else
            convert -size 1080x1920 xc:"#0A0A1A" \
                -fill "#00D4FF" -pointsize 45 -gravity center \
                -annotate +0+0 "$cta" \
                /tmp/f${f}.png
        fi
    done
    
    ffmpeg -y -framerate 30 -i /tmp/f%d.png -c:v libx264 -pix_fmt yuv420p -vf "scale=1080:1920" -shortest $OUT/video-$idx.mp4 2>/dev/null
    echo "  -> video-$idx.mp4 ($(ls -lh $OUT/video-$idx.mp4 | awk '{print $5}'))"
    
    rm -f /tmp/f*.png
done

echo ""
echo "========== 全部完成 =========="
ls -lh $OUT/video-*.mp4
