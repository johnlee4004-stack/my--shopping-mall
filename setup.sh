#!/bin/bash
# 설교 앱 Flutter 프로젝트 초기화 스크립트
set -e

echo "============================================"
echo "  설교 노트 앱 - 프로젝트 초기화"
echo "============================================"

# Flutter 확인
if ! command -v flutter &> /dev/null; then
  echo ""
  echo "❌ Flutter가 설치되지 않았습니다."
  echo "   https://flutter.dev/docs/get-started/install"
  exit 1
fi

echo "✅ Flutter: $(flutter --version | head -1)"
echo ""

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMP="$(mktemp -d)"

echo "📱 Flutter 플랫폼 파일 생성 중..."
flutter create --project-name sermon_app --org com.example \
  --platforms android,ios "$TEMP/sermon_app" --quiet

# android/ios 복사 (lib/ pubspec.yaml 은 이미 존재)
echo "📂 android/ ios/ 복사 중..."
cp -r "$TEMP/sermon_app/android" "$PROJECT_DIR/"
cp -r "$TEMP/sermon_app/ios" "$PROJECT_DIR/"
cp "$TEMP/sermon_app/analysis_options.yaml" "$PROJECT_DIR/" 2>/dev/null || true
cp "$TEMP/sermon_app/.gitignore" "$PROJECT_DIR/" 2>/dev/null || true

# AndroidManifest.xml 덮어쓰기 (권한 포함 버전)
echo "🔧 Android 권한 설정 적용 중..."
cp "$PROJECT_DIR/android/app/src/main/AndroidManifest.xml" \
   "$PROJECT_DIR/android/app/src/main/AndroidManifest.xml.bak" 2>/dev/null || true

cat > "$PROJECT_DIR/android/app/src/main/AndroidManifest.xml" << 'MANIFEST'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="32"/>
    <application
        android:label="설교 노트"
        android:name="${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
                android:name="io.flutter.embedding.android.NormalTheme"
                android:resource="@style/NormalTheme"/>
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data android:name="flutterEmbedding" android:value="2"/>
    </application>
</manifest>
MANIFEST

# iOS Info.plist 마이크 권한 추가
echo "🔧 iOS 마이크 권한 추가 중..."
PLIST="$PROJECT_DIR/ios/Runner/Info.plist"
if [ -f "$PLIST" ]; then
  python3 - "$PLIST" << 'PYTHON'
import sys, re

path = sys.argv[1]
text = open(path, encoding='utf-8').read()

mic_key = '''
\t<key>NSMicrophoneUsageDescription</key>
\t<string>설교 녹음을 위해 마이크 접근이 필요합니다</string>'''

if 'NSMicrophoneUsageDescription' not in text:
    text = text.replace('</dict>\n</plist>', mic_key + '\n</dict>\n</plist>')
    open(path, 'w', encoding='utf-8').write(text)
    print("  ✅ NSMicrophoneUsageDescription 추가됨")
else:
    print("  ℹ️  이미 마이크 권한이 설정되어 있습니다")
PYTHON
fi

rm -rf "$TEMP"

# Flutter 패키지 설치
echo ""
echo "📦 Flutter 패키지 설치 중..."
cd "$PROJECT_DIR" && flutter pub get

# 백엔드 .env 파일
if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
  cp "$PROJECT_DIR/backend/.env.example" "$PROJECT_DIR/backend/.env"
  echo ""
  echo "⚠️  backend/.env 파일을 생성했습니다."
  echo "   ANTHROPIC_API_KEY를 입력하세요:"
  echo "   nano backend/.env"
fi

echo ""
echo "============================================"
echo "  ✅ 초기화 완료!"
echo "============================================"
echo ""
echo "다음 순서로 실행하세요:"
echo ""
echo "  1) 백엔드 서버 시작:"
echo "     cd backend && ./run.sh"
echo ""
echo "  2) Flutter 앱 실행 (에뮬레이터/기기 연결 후):"
echo "     flutter run"
echo ""
echo "  3) 실기기 사용 시 앱 설정에서 서버 주소를 변경하세요:"
echo "     http://<PC의 IP>:8000"
echo ""
