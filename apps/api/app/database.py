import os
import psycopg2
from psycopg2.extras import RealDictCursor
from urllib.parse import urlparse, parse_qs

DATABASE_URL = os.getenv("DATABASE_URL", "")


def get_connection():
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL environment variable is not set")

    parsed = urlparse(DATABASE_URL)
    params = parse_qs(parsed.query)

    sslmode = params.get("sslmode", [None])[0]
    connect_kwargs = {
        "host": parsed.hostname,
        "port": parsed.port or 5432,
        "dbname": parsed.path.lstrip("/"),
        "user": parsed.username,
        "password": parsed.password,
        "cursor_factory": RealDictCursor,
    }

    if sslmode:
        connect_kwargs["sslmode"] = sslmode
    elif "supabase" in (parsed.hostname or ""):
        connect_kwargs["sslmode"] = "require"

    return psycopg2.connect(**connect_kwargs)
