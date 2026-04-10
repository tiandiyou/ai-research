#!/usr/bin/env python3
"""
硅基流动图片生成器 - Kolors模型
"""
import requests
import sys
import os

API_KEY = "sk-ysycigzzwlfdgkvgnpkwavpimhpozptlofkyehotomdrtufy"
API_URL = "https://api.siliconflow.cn/v1/images/generations"

def generate_image(prompt, model="Kwai-Kolors/Kolors", size="1024x1024"):
    """生成图片"""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
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
    
    response = requests.post(API_URL, headers=headers, json=data)
    result = response.json()
    
    if "images" in result and len(result["images"]) > 0:
        return result["images"][0]["url"]
    else:
        print(f"Error: {result}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python3 kolors.py <prompt>")
        sys.exit(1)
    
    prompt = sys.argv[1]
    url = generate_image(prompt)
    if url:
        print(url)
