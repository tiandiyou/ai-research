#!/bin/bash
# Ralph Loop Script for AI-Research
# 基于PRD规格驱动的自动化迭代框架

set -e

# 配置
MAX_ITERATIONS=${1:-10}
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

echo "========================================"
echo "📚 AI-Research Ralph Loop"
echo "========================================"

# 检查PRD文件
if [ ! -f "prd.json" ]; then
    echo "❌ 未找到 prd.json"
    echo "请先创建功能规格文档"
    exit 1
fi

# 初始化
echo "初始化进度文件..."
echo "# Ralph Progress - $(date)" >> progress.txt

# 主循环
ITERATION=1
while [ $ITERATION -le $MAX_ITERATIONS ]; do
    echo ""
    echo "🔄 迭代 $ITERATION/$MAX_ITERATIONS"
    
    # 获取当前任务
    CURRENT_TASK=$(jq -r '.userStories[] | select(.passes == false) | .id' prd.json | head -1)
    
    if [ "$CURRENT_TASK" = "null" ] || [ -z "$CURRENT_TASK" ]; then
        echo "✅ 所有任务已完成！"
        echo "<promise>COMPLETE</promise>" >> progress.txt
        break
    fi
    
    echo "📋 当前任务: $CURRENT_TASK"
    
    # 执行任务（调用AI）
    # 这里应该调用实际的AI工具
    
    # 更新进度
    echo "[迭代 $ITERATION] 完成 $CURRENT_TASK - $(date)" >> progress.txt
    
    # 标记完成
    jq ".userStories[] | select(.id == \"$CURRENT_TASK\") | .passes = true" prd.json > tmp.json && mv tmp.json prd.json
    
    ITERATION=$((ITERATION + 1))
done

echo ""
echo "🏁 Ralph Loop 完成"
echo "查看进度: cat progress.txt"