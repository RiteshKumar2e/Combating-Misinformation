# backend/config.py
import os
from dotenv import load_dotenv
load_dotenv()

# Flask / server config
FLASK_ENV = os.getenv("FLASK_ENV", "development")
FLASK_RUN_PORT = int(os.getenv("FLASK_RUN_PORT", 5000))
FLASK_SECRET = os.getenv("FLASK_SECRET", "please_change_me")

# API keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
NEWSAPI_KEY = os.getenv("NEWSAPI_KEY")

# SocketIO message queue (optional; default None)
SOCKETIO_MESSAGE_QUEUE = os.getenv("SOCKETIO_MESSAGE_QUEUE", None)
