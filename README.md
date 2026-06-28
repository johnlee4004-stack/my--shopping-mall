# 설교 노트 앱

Flutter + Python 백엔드로 구성된 설교 녹음·정리 앱입니다.

## 기능

| 기능 | 설명 |
|------|------|
| 🎙 녹음 시작/⏹ 녹음 종료 | 앱 내 마이크 녹음 (M4A) |
| 🎤 음성 → 텍스트 (STT) | faster-whisper 한국어 변환 |
| 🤖 AI 설교 정리 | Claude API로 서론/본론/결론 구조화 |
| 📄 DOCX 생성 | python-docx |
| 📕 PDF 생성 | reportlab (한국어 CID 폰트) |
| 💾 날짜_제목 형식 저장 | `20241225_성탄절설교.docx` |
| 📚 설교 목록 | 날짜순 정렬 |
| 🔍 제목·날짜 검색 | 실시간 필터 |

## 아키텍처

```
Flutter App (Android/iOS)
    │  HTTP (JSON / multipart)
    ▼
Python FastAPI 서버 (localhost:8000)
    ├─ POST /transcribe   ← faster-whisper STT
    ├─ POST /organize     ← Claude AI 정리
    ├─ POST /save         ← DOCX + PDF 생성
    └─ GET  /download/:f  ← 파일 다운로드
```

## 사전 요구사항

- **Flutter** 3.x 이상 (<https://flutter.dev>)
- **Python** 3.10 이상
- **ffmpeg** (Whisper 오디오 변환용)
  - macOS: `brew install ffmpeg`
  - Ubuntu: `sudo apt-get install ffmpeg`
- **Anthropic API Key** (<https://console.anthropic.com>)

## 설치 및 실행

### 1단계 – 프로젝트 초기화 (최초 1회)

```bash
git clone <repo-url>
cd my--shopping-mall
./setup.sh
```

`setup.sh`가 자동으로:
- `flutter create`로 android/ ios/ 생성
- AndroidManifest.xml에 마이크·인터넷 권한 추가
- iOS Info.plist에 NSMicrophoneUsageDescription 추가
- `flutter pub get` 실행

### 2단계 – 백엔드 API 키 설정

```bash
# backend/.env 파일을 열어 키 입력
nano backend/.env
```

```env
ANTHROPIC_API_KEY=sk-ant-...
```

### 3단계 – 백엔드 서버 시작

```bash
cd backend
./run.sh
```

서버: <http://localhost:8000>  
API 문서: <http://localhost:8000/docs>

### 4단계 – Flutter 앱 실행

```bash
# 프로젝트 루트에서
flutter run
```

### 실기기 연결 시 서버 주소 설정

앱 우측 상단 ⚙️ 아이콘 → PC의 로컬 IP 주소 입력

```
http://192.168.1.xxx:8000
```

> Android 에뮬레이터: `http://10.0.2.2:8000` (기본값)  
> iOS 시뮬레이터: `http://localhost:8000`

## 프로젝트 구조

```
├── lib/
│   ├── main.dart
│   ├── models/sermon.dart           # 데이터 모델
│   ├── providers/sermon_provider.dart  # SharedPreferences 상태
│   ├── screens/
│   │   ├── home_screen.dart         # 홈
│   │   ├── record_screen.dart       # 녹음 → STT → AI → 저장
│   │   ├── sermon_list_screen.dart  # 목록 · 검색
│   │   └── sermon_detail_screen.dart # 상세 · 파일 공유
│   ├── services/api_service.dart    # HTTP 클라이언트
│   └── widgets/sermon_card.dart     # 목록 카드
├── backend/
│   ├── main.py          # FastAPI 서버
│   ├── requirements.txt
│   ├── .env.example
│   └── run.sh
├── pubspec.yaml
└── setup.sh             # 초기화 스크립트
```

## 파일 저장 형식

생성된 파일명: `YYYYMMDD_설교제목.docx` / `.pdf`

예: `20241225_성탄절_하나님의사랑.docx`

DOCX/PDF는 앱의 Documents 디렉터리에 저장되며,
상세 화면에서 시스템 공유 시트를 통해 다른 앱으로 전달할 수 있습니다.
