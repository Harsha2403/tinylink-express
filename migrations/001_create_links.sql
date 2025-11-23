CREATE TABLE IF NOT EXISTS links (
  code VARCHAR(8) PRIMARY KEY,
  url TEXT NOT NULL,
  clicks BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_clicked TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_links_last_clicked ON links(last_clicked);
