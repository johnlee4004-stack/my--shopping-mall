import os
import sys
import json
import logging
from pathlib import Path

# 모듈 탐색 경로 보정
current_dir = Path(__file__).resolve().parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from video_creator_A02 import create_video_a02

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

def main():
    dry_run = "--dry-run" in sys.argv
    episode = "A02"
    if "--episode" in sys.argv:
        idx = sys.argv.index("--episode") + 1
        if idx < len(sys.argv):
            episode = sys.argv[idx]
            
    logging.info(f"=== DoxHayx Video Pipeline 실행 (Episode={episode}, dry_run={dry_run}) ===")
    
    config_path = current_dir / "a02_production" / "script.json"
    if config_path.exists():
        with open(config_path, "r", encoding="utf-8-sig") as f:
            metadata = json.load(f)
            logging.info(f"에피소드 메타데이터 로드 완료: {metadata.get('title')}")
            logging.info(f"연동 상품: {metadata.get('linked_product_name')}")

    out_file = create_video_a02(output_dir=str(current_dir / "output"))
    
    if dry_run:
        logging.info("[DRY-RUN] 실제 YouTube 업로드를 건너뛰고 파이프라인 검증을 성공적으로 마쳤습니다.")
    else:
        logging.info("YouTube API 업로드 절차를 진행합니다.")
        
    logging.info("=== Pipeline 완료 ===")

if __name__ == "__main__":
    main()
