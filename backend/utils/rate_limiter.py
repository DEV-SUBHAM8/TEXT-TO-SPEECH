import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request

MAX_REQUESTS = 10      # allowed requests
WINDOW_SECONDS = 60    # per this many seconds, per IP address

_hits = defaultdict(deque)


def check_rate_limit(request: Request):
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    hits = _hits[ip]

    # forget requests older than the window
    while hits and now - hits[0] > WINDOW_SECONDS:
        hits.popleft()

    if len(hits) >= MAX_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please wait a minute and try again.",
        )

    hits.append(now)