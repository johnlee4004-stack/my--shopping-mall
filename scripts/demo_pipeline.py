#!/usr/bin/env python3
"""
DoxHayx 365-Day Shorts Auto Pipeline
매일 건강기능식품 관련 YouTube Shorts를 자동으로 제작하고 업로드합니다.

환경변수 (GitHub Secrets에 등록):
  YT_CLIENT_ID      — Google OAuth 2.0 클라이언트 ID
  YT_CLIENT_SECRET  — Google OAuth 2.0 클라이언트 시크릿
  YT_REFRESH_TOKEN  — 오프라인 액세스 리프레시 토큰
  YT_CHANNEL_ID     — 업로드 대상 채널 ID
  TOPIC_OVERRIDE    — (선택) 수동 실행 시 주제 지정
  DRY_RUN           — "true" 이면 실제 업로드 없이 로그만 출력
"""

import json
import logging
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# ── 설정 ──────────────────────────────────────────────────────
OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

LOG_FILE = Path(__file__).parent / "pipeline.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger(__name__)

# ── 365일 주제 풀 ─────────────────────────────────────────────
TOPIC_POOL = [
    {"title": "아침 루틴 5분 면역력 부스팅", "tag": "면역력", "category": "루틴"},
    {"title": "다이어트 클린즈 BEFORE & AFTER", "tag": "다이어트", "category": "리뷰"},
    {"title": "숙면을 위한 마그네슘 복용법", "tag": "수면개선", "category": "가이드"},
    {"title": "콜라겐 먹는 최적의 시간은?", "tag": "콜라겐", "category": "팩트"},
    {"title": "장 건강 지키는 아침 한 잔", "tag": "장건강", "category": "루틴"},
    {"title": "오메가3, 언제 먹어야 효과적일까?", "tag": "오메가3", "category": "팩트"},
    {"title": "체중 감량 중 꼭 챙겨야 할 영양소", "tag": "체중관리", "category": "가이드"},
    {"title": "혈관 건강에 좋은 식품 TOP 3", "tag": "혈관", "category": "정보"},
    {"title": "피부 탄력을 위한 비타민C 루틴", "tag": "피부", "category": "루틴"},
    {"title": "프로바이오틱스 VS 프리바이오틱스 차이", "tag": "장건강", "category": "팩트"},
]

# ── YouTube OAuth ─────────────────────────────────────────────

def build_youtube_client():
    """리프레시 토큰으로 YouTube API 클라이언트 생성."""
    client_id = os.environ["YT_CLIENT_ID"]
    client_secret = os.environ["YT_CLIENT_SECRET"]
    refresh_token = os.environ["YT_REFRESH_TOKEN"]

    creds = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
        scopes=["https://www.googleapis.com/auth/youtube.upload"],
    )
    return build("youtube", "v3", credentials=creds, cache_discovery=False)


# ── 주제 선택 ─────────────────────────────────────────────────

def pick_topic():
    """오늘 날짜 또는 TOPIC_OVERRIDE 환경변수로 주제 결정."""
    override = os.environ.get("TOPIC_OVERRIDE", "").strip()
    if override:
        log.info("수동 주제 지정: %s", override)
        return {"title": override, "tag": "건강", "category": "기타"}

    day_of_year = datetime.now(timezone.utc).timetuple().tm_yday
    topic = TOPIC_POOL[day_of_year % len(TOPIC_POOL)]
    log.info("자동 선택 주제 (day=%d): %s", day_of_year, topic["title"])
    return topic


# ── 썸네일 생성 (Pillow fallback) ─────────────────────────────

def generate_thumbnail(topic, out_path):
    """간단한 텍스트 썸네일 이미지 생성 (1080×1920 Shorts 규격)."""
    try:
        from PIL import Image, ImageDraw

        img = Image.new("RGB", (1080, 1920), color=(18, 18, 18))
        draw = ImageDraw.Draw(img)

        # 배경 그라디언트 효과 (수동)
        for y in range(1920):
            r = int(18 + (y / 1920) * 20)
            draw.line([(0, y), (1080, y)], fill=(r, 18, 18))

        # 태그 배지
        draw.rectangle([60, 200, 300, 260], fill=(220, 50, 50))
        draw.text((80, 210), topic["tag"], fill="white")

        # 제목 (긴 텍스트 줄바꿈)
        title = topic["title"]
        lines = [title[i : i + 14] for i in range(0, len(title), 14)]
        for i, line in enumerate(lines[:4]):
            draw.text((60, 340 + i * 100), line, fill="white")

        # 채널명
        draw.text((60, 1700), "DoxHayx 건강채널", fill=(150, 150, 150))

        img.save(out_path, "JPEG", quality=95)
        log.info("썸네일 생성: %s", out_path)
        return out_path

    except Exception as e:
        log.warning("썸네일 생성 실패 (건너뜀): %s", e)
        return None


# ── 데모 영상 생성 (FFmpeg) ───────────────────────────────────

def generate_demo_video(topic, thumbnail_path, out_path):
    """
    FFmpeg로 정지 이미지 + 텍스트 오버레이 Shorts 데모 영상 생성.
    실제 프로덕션에서는 이 단계를 영상 편집 API / 렌더링 서비스로 교체하세요.
    """
    safe_title = topic["title"].replace("'", "\\'").replace(":", "\\:")

    if thumbnail_path and Path(thumbnail_path).exists():
        video_filter = (
            f"[0:v]scale=1080:1920:force_original_aspect_ratio=increase,"
            f"crop=1080:1920,setsar=1[bg];"
            f"[bg]drawtext=text='{safe_title}':fontsize=56:fontcolor=white"
            f":x=(w-text_w)/2:y=h/2-100:line_spacing=20[v]"
        )
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", str(thumbnail_path),
            "-t", "30",
            "-filter_complex", video_filter,
            "-map", "[v]",
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            "-r", "30",
            str(out_path),
        ]
    else:
        cmd = [
            "ffmpeg", "-y",
            "-f", "lavfi",
            "-i", "color=c=121212:size=1080x1920:rate=30",
            "-t", "30",
            "-vf", (
                f"drawtext=text='{safe_title}':fontsize=56:fontcolor=white"
                f":x=(w-text_w)/2:y=h/2"
            ),
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            str(out_path),
        ]

    log.info("FFmpeg 실행 중...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        log.error("FFmpeg 오류:\n%s", result.stderr[-2000:])
        raise RuntimeError("영상 생성 실패")

    size_mb = Path(out_path).stat().st_size / 1_048_576
    log.info("영상 생성 완료: %s (%.1f MB)", out_path, size_mb)
    return out_path


# ── YouTube 업로드 ────────────────────────────────────────────

def upload_to_youtube(youtube, topic, video_path, thumbnail_path):
    """YouTube Shorts로 업로드 후 video_id 반환."""
    today = datetime.now(timezone.utc).strftime("%Y년 %m월 %d일")
    description = (
        f"{topic['title']}\n\n"
        f"#{topic['tag']} #{topic['category']} #DoxHayx #건강 #Shorts\n\n"
        f"📦 영상에서 소개한 제품 → https://doxhayx.com/products\n"
        f"📅 {today}"
    )

    body = {
        "snippet": {
            "title": f"{topic['title']} #Shorts",
            "description": description,
            "tags": [topic["tag"], topic["category"], "DoxHayx", "건강", "Shorts", "건강기능식품"],
            "categoryId": "26",
            "defaultLanguage": "ko",
        },
        "status": {
            "privacyStatus": "public",
            "selfDeclaredMadeForKids": False,
        },
    }

    media = MediaFileUpload(
        str(video_path), mimetype="video/mp4", resumable=True, chunksize=5 * 1024 * 1024
    )
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            log.info("업로드 진행: %.0f%%", status.progress() * 100)

    video_id = response["id"]
    log.info("업로드 완료: https://youtu.be/%s", video_id)

    if thumbnail_path and Path(thumbnail_path).exists():
        try:
            youtube.thumbnails().set(
                videoId=video_id,
                media_body=MediaFileUpload(str(thumbnail_path), mimetype="image/jpeg"),
            ).execute()
            log.info("썸네일 설정 완료")
        except Exception as e:
            log.warning("썸네일 설정 실패 (건너뜀): %s", e)

    return video_id


# ── 결과 저장 ─────────────────────────────────────────────────

def save_result(topic, video_id, dry_run):
    result = {
        "date": datetime.now(timezone.utc).isoformat(),
        "topic": topic,
        "video_id": video_id,
        "url": f"https://youtu.be/{video_id}" if video_id else None,
        "dry_run": dry_run,
    }
    date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
    result_path = OUTPUT_DIR / f"result_{date_str}.json"
    result_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    log.info("결과 저장: %s", result_path)


# ── 메인 ─────────────────────────────────────────────────────

def main():
    dry_run = os.environ.get("DRY_RUN", "false").lower() == "true"
    log.info("=== DoxHayx Shorts Pipeline 시작 (dry_run=%s) ===", dry_run)

    topic = pick_topic()
    date_str = datetime.now(timezone.utc).strftime("%Y%m%d")

    thumbnail_path = OUTPUT_DIR / f"thumbnail_{date_str}.jpg"
    video_path = OUTPUT_DIR / f"shorts_{date_str}.mp4"

    # 1) 썸네일 생성
    thumbnail_path = generate_thumbnail(topic, thumbnail_path)

    # 2) 영상 생성
    generate_demo_video(topic, thumbnail_path, video_path)

    # 3) 업로드
    video_id = None
    if dry_run:
        log.info("[DRY RUN] 업로드 건너뜀 — 영상 경로: %s", video_path)
    else:
        required = ["YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN"]
        missing = [k for k in required if not os.environ.get(k)]
        if missing:
            log.error("필수 환경변수 누락: %s", missing)
            log.error("GitHub Settings → Secrets and variables → Actions 에서 등록하세요.")
            sys.exit(1)

        youtube = build_youtube_client()
        video_id = upload_to_youtube(youtube, topic, video_path, thumbnail_path)

    save_result(topic, video_id, dry_run)
    log.info("=== Pipeline 완료 ===")


if __name__ == "__main__":
    main()
