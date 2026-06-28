#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 가상환경 생성 (처음 한 번만)
if [ ! -d ".venv" ]; then
  echo "📦 가상환경 생성 중..."
  python3 -m venv .venv
fi

source .venv/bin/activate

# 의존성 설치
echo "📦 패키지 설치 중..."
pip install -q -r requirements.txt

# .env 파일 확인
if [ ! -f ".env" ]; then
  echo "⚠️  .env 파일이 없습니다. .env.example을 복사해 ANTHROPIC_API_KEY를 설정하세요."
  cp .env.example .env
fi

# ffmpeg 확인 (Whisper가 오디오 변환에 사용)
if ! command -v ffmpeg &> /dev/null; then
  echo "⚠️  ffmpeg가 설치되지 않았습니다."
  echo "   macOS: brew install ffmpeg"
  echo "   Ubuntu: sudo apt-get install ffmpeg"
fi

echo ""
echo "🚀 서버 시작: http://0.0.0.0:8000"
echo "   문서: http://localhost:8000/docs"
echo ""

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
