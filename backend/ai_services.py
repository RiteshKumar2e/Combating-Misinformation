from config import OPENAI_API_KEY, GEMINI_API_KEY
from openai import OpenAI
import google.generativeai as genai

# Initialize OpenAI
openai_client = None
if OPENAI_API_KEY:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)

# Initialize Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def ai_analysis_openai(text, headline="", url=""):
    if not openai_client:
        return {"error": "OpenAI API key not configured"}
    
    prompt = f"""
    Analyze the following content for misinformation and credibility:

    Headline: {headline}
    URL: {url}
    Text: {text}

    Provide:
    - Credibility score (0-1)
    - Bias score (0-1)
    - Summary
    - Recommendations
    """

    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a misinformation detection expert."},
            {"role": "user", "content": prompt}
        ]
    )

    return {"ai_result": response.choices[0].message.content}

def ai_analysis_gemini(text, headline="", url=""):
    if not GEMINI_API_KEY:
        return {"error": "Gemini API key not configured"}
    
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"""
    Analyze this content for misinformation and credibility:
    Headline: {headline}
    URL: {url}
    Text: {text}
    Provide a credibility score, bias score, summary, and recommendations.
    """
    response = model.generate_content(prompt)
    return {"ai_result": response.text}