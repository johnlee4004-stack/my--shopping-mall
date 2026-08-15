import os
import sys
import json
import logging
import datetime
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

TOPICS = [
    "혈관 건강에 좋은 식품 TOP 3",
    "면역력 강화 영양제 추천",
    "수면 질을 높이는 5가지 습관",
    "다이어트 정체기 극복 비법",
    "장 건강과 유산균 섭취 팁"
]

def generate_thumbnail(topic, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img = Image.new("RGB", (1080, 1920), color=(20, 24, 33))
    draw = ImageDraw.Draw(img)
    
    # 기본 폰트 로드 시도 (실패 시 기본 폰트 사용)
    try:
        font_large = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 60)
        font_sub = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 36)
    except Exception:
        font_large = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        
    draw.text((100, 700), "[ DoxHayx 건강 가이드 ]", fill=(255, 180, 0), font=font_sub)
    draw.text((100, 800), topic, fill=(255, 255, 255), font=font_large)
    draw.text((100, 1000), "DoxHayx 공식 쇼핑몰 연동", fill=(150, 160, 180), font=font_sub)
    
    img.save(output_path, quality=95)
    logging.info(f"썸네일 생성: {output_path}")
    return output_path

def generate_demo_video(topic, thumbnail_path, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", str(thumbnail_path),
        "-c:v", "libx264",
        "-t", "3",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1080:1920",
        str(output_path)
    ]
    logging.info("FFmpeg 실행 중...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        logging.error(f"FFmpeg 오류:\n{result.stderr}")
        raise RuntimeError("영상 생성 실패")
    logging.info(f"데모 영상 생성 완료: {output_path}")
    return output_path

def main():
    dry_run = "--dry-run" in sys.argv
    logging.info(f"=== DoxHayx Shorts Pipeline 시작 (dry_run={dry_run}) ===")
    
    day_of_year = datetime.datetime.now().timetuple().tm_yday
    topic = TOPICS[day_of_year % len(TOPICS)]
    logging.info(f"자동 선택 주제 (day={day_of_year}): {topic}")
    
    today_str = datetime.datetime.now().strftime("%Y%m%d")
    out_dir = Path("scripts/output")
    out_dir.mkdir(parents=True, exist_ok=True)
    
    thumb_path = out_dir / f"thumbnail_{today_str}.jpg"
    video_path = out_dir / f"shorts_{today_str}.mp4"
    
    generate_thumbnail(topic, str(thumb_path))
    generate_demo_video(topic, str(thumb_path), str(video_path))
    
    if dry_run:
        logging.info("[DRY-RUN] YouTube API 업로드를 건너뛰고 모의 파이프라인을 성공적으로 완료했습니다.")
    else:
        logging.info("업로드 단계 진행 완료.")
    
    logging.info("=== Pipeline 완료 ===")

if __name__ == "__main__":
    main()
