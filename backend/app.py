from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from datetime import datetime
import logging

from analyzer import MisinformationAnalyzer
from ai_services import ai_analysis_openai, ai_analysis_gemini
from config import FLASK_RUN_PORT, OPENAI_API_KEY, GEMINI_API_KEY

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

analyzer = MisinformationAnalyzer()

@app.route('/api/analyze', methods=['POST'])
def analyze_content():
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        headline = data.get('headline', '')
        url = data.get('url', '')
        mode = data.get('mode', 'basic')

        if not text:
            return jsonify({'error': 'No text content provided'}), 400

        time.sleep(1)  # simulate delay

        if mode == "basic":
            results = analyzer.analyze_text(text, headline, url, mode)
        elif mode == "openai":
            results = ai_analysis_openai(text, headline, url)
        elif mode == "gemini":
            results = ai_analysis_gemini(text, headline, url)
        else:
            results = {"error": "Invalid analysis mode"}

        results['metadata'] = {
            'analysis_time': datetime.now().isoformat(),
            'text_length': len(text),
            'mode': mode,
            'version': '2.0.0'
        }
        return jsonify(results)

    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({'error': 'Internal analysis error'}), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        'status': 'healthy',
        'version': '2.0.0',
        'timestamp': datetime.now().isoformat(),
        'openai_enabled': bool(OPENAI_API_KEY),
        'gemini_enabled': bool(GEMINI_API_KEY)
    })

@app.route('/')
def root():
    return jsonify({
        'name': 'Misinformation Guard API',
        'version': '2.0.0',
        'modes': ['basic', 'openai', 'gemini']
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=FLASK_RUN_PORT, debug=True)