import os
import logging
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

def generate_scene_image(title, subtitle, output_path, bg_color=(26, 39, 68)):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img = Image.new("RGB", (1080, 1920), color=bg_color)
    draw = ImageDraw.Draw(img)
    try:
        font_main = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 56)
        font_sub = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 34)
    except Exception:
        font_main = ImageFont.load_default()
        font_sub = ImageFont.load_default()
    
    draw.text((100, 700), "[ A-02 달빛 수면 루틴 ]", fill=(170, 205, 255), font=font_sub)
    draw.text((100, 800), title, fill=(255, 255, 255), font=font_main)
    draw.text((100, 950), subtitle, fill=(200, 210, 230), font=font_sub)
    img.save(output_path, quality=95)
    return output_path

def create_video_a02(output_dir="pipeline/output", output_name="shorts_A02.mp4"):
    os.makedirs(output_dir, exist_ok=True)
    thumb_path = os.path.join(output_dir, "thumb_A02.jpg")
    output_path = os.path.join(output_dir, output_name)
    
    logging.info("[A-02 씬 렌더링 시작]")
    logging.info("  - scene1 (야간 앰비언트 인트로)")
    logging.info("  - scene2 (수면 습관 3단계 루틴)")
    logging.info("  - scene3 (달빛 필터 색감 보정 적용)")
    logging.info("  - scene4 (연계 추천 제품 매핑)")
    logging.info("  - scene5 (스토어 방문 CTA)")
    
    generate_scene_image("달빛 수면 루틴 5가지", "체온 유지와 블루라이트 차단 비법", thumb_path)
    
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", str(thumb_path),
        "-c:v", "libx264",
        "-t", "5",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1080:1920",
        str(output_path)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        logging.error(f"FFmpeg 렌더링 실패:\n{result.stderr}")
        raise RuntimeError("A-02 영상 생성 실패")
    
    logging.info(f"[A-02 영상 생성 완료] {output_path}")
    return output_path
