import os
import psycopg2
from psycopg2.extras import RealDictCursor
from urllib.parse import urlparse, urlunparse

DATABASE_URL = os.getenv("DATABASE_URL", "")

SUPABASE_REGION = "ap-northeast-1"


def _to_pooler_url(url: str) -> str:
    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    if "supabase.co" not in hostname:
        return url

    project_ref = hostname.replace("db.", "").replace(".supabase.co", "")
    pooler_host = f"aws-0-{SUPABASE_REGION}.pooler.supabase.com"
    pooler_username = f"postgres.{project_ref}"

    pooler_netloc = f"{pooler_username}:{parsed.password}@{pooler_host}:6543"
    return urlunparse(parsed._replace(netloc=pooler_netloc))


def get_connection():
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL environment variable is not set")

    pooler_url = _to_pooler_url(DATABASE_URL)

    for url in [pooler_url, DATABASE_URL]:
        try:
            conn = psycopg2.connect(url, cursor_factory=RealDictCursor, connect_timeout=10)
            return conn
        except Exception:
            continue

    raise RuntimeError("Could not connect to database via pooler or direct connection")
