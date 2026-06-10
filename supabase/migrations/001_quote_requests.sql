-- Dox-Hayx: 견적 요청 테이블
-- Supabase 대시보드 > SQL Editor 에서 실행하거나
-- `npm run db:push` 로 자동 적용됩니다.

CREATE TYPE "Status" AS ENUM (
  'PENDING',
  'CONTACTED',
  'SCHEDULED',
  'COMPLETED',
  'CANCELLED'
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id          TEXT PRIMARY KEY DEFAULT concat('c', replace(gen_random_uuid()::text, '-', '')),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  service     TEXT NOT NULL,
  "preferDate" TEXT,
  detail      TEXT,
  "imageUrls" TEXT[] NOT NULL DEFAULT '{}',
  status      "Status" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updatedAt on row changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
