import edge_tts, asyncio, sys

text = sys.argv[1] if len(sys.argv) > 1 else "测试语音"

async def main():
    # 正常语速 (+10% 稍快)
    c = edge_tts.Communicate(text, "zh-CN-XiaoxiaoNeural", rate="+10%")
    await c.save("temp-audio.mp3")
    print("OK")

asyncio.run(main())
