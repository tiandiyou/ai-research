#!/usr/bin/env python3
"""
硅基流动API - 防限流管理器
"""
import time
import requests
from datetime import datetime, timedelta

class SiliconFlowAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.api_url = "https://api.siliconflow.cn"
        self.last_request_time = {}
        self.request_count = {}
        self.min_interval = 3  # 最小请求间隔（秒）
        self.max_per_minute = 15  # 每分钟最大请求数
    
    def wait_if_needed(self, endpoint):
        """检查是否需要等待"""
        now = datetime.now()
        minute_key = now.strftime("%Y-%m-%d %H:%M")
        
        # 初始化计数
        if minute_key not in self.request_count:
            self.request_count[minute_key] = 0
            # 清理旧的计数
            old_keys = [k for k in self.request_count.keys() 
                       if datetime.strptime(k, "%Y-%m-%d %H:%M") < now - timedelta(minutes=5)]
            for k in old_keys:
                del self.request_count[k]
        
        # 检查每分钟请求数
        if self.request_count.get(minute_key, 0) >= self.max_per_minute:
            wait_time = 60 - now.second
            print(f"⏳ 达到每分钟上限，等待 {wait_time}秒...")
            time.sleep(wait_time)
            self.request_count[minute_key] = 0
        
        # 检查最小间隔
        if endpoint in self.last_request_time:
            elapsed = (now - self.last_request_time[endpoint]).total_seconds()
            if elapsed < self.min_interval:
                wait = self.min_interval - elapsed
                print(f"⏳ 请求间隔等待 {wait:.1f}秒...")
                time.sleep(wait)
        
        self.last_request_time[endpoint] = now
        self.request_count[minute_key] = self.request_count.get(minute_key, 0) + 1
    
    def generate_image(self, prompt, model="Kwai-Kolors/Kolors", size="1024x1024"):
        """生成图片（带防限流）"""
        self.wait_if_needed("/v1/images/generations")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": model,
            "prompt": prompt,
            "image_size": size,
            "batch_size": 1,
            "num_inference_steps": 20,
            "guidance_scale": 7.5
        }
        
        response = requests.post(
            f"{self.api_url}/v1/images/generations",
            headers=headers,
            json=data,
            timeout=120
        )
        
        if response.status_code == 429:
            print("❌ 触发限流，等待更长时间...")
            time.sleep(30)
            return self.generate_image(prompt, model, size)  # 重试
        
        result = response.json()
        if "images" in result and len(result["images"]) > 0:
            return result["images"][0]["url"]
        else:
            raise Exception(result.get("error", {}).get("message", "Unknown error"))
    
    def check_balance(self):
        """检查余额"""
        self.wait_if_needed("/v1/user/info")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            f"{self.api_url}/v1/user/info",
            headers=headers
        )
        
        if response.status_code == 200:
            return response.json()
        return None


if __name__ == "__main__":
    import sys
    api = SiliconFlowAPI(sys.argv[1] if len(sys.argv) > 1 else "")
    
    # 测试生成图片
    test_prompts = [
        "a cute cat, adorable, fluffy, big eyes",
        "a beautiful sunset over ocean, orange and pink sky",
        "a futuristic city at night, neon lights, cyberpunk"
    ]
    
    print("=== 测试API稳定性 ===")
    for i, prompt in enumerate(test_prompts):
        print(f"\n[{i+1}/{len(test_prompts)}] 生成: {prompt[:30]}...")
        try:
            url = api.generate_image(prompt)
            print(f"  ✅ 成功: {url[:50]}...")
        except Exception as e:
            print(f"  ❌ 失败: {e}")
        time.sleep(2)
    
    print("\n=== 测试完成 ===")
