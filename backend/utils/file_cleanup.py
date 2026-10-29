import os
import time


def delete_old_files(directory: str, max_age_seconds: int = 3600):
    """Delete generated .mp3 files older than max_age_seconds (default 1 hour)."""
    now = time.time()
    for name in os.listdir(directory):
        if not name.endswith(".mp3"):
            continue
        path = os.path.join(directory, name)
        try:
            if now - os.path.getmtime(path) > max_age_seconds:
                os.remove(path)
        except OSError:
            pass