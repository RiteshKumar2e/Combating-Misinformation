# backend/analyzer_basic.py
import os
from dotenv import load_dotenv
load_dotenv()

class MisinformationAnalyzer:
    def __init__(self):
        self.suspicious_phrases = [
            'scientists say', 'experts claim', 'studies show', 'research proves',
            'breaking news', 'shocking discovery', "they don't want you to know",
            "mainstream media won't tell you", 'secret', 'conspiracy',
            'miracle cure', 'instant results', 'guaranteed', '100% effective'
        ]
        self.credible_phrases = [
            'peer-reviewed', 'published in', 'university study', 'clinical trial',
            'scientific journal', 'according to data', 'research indicates',
            'evidence suggests', 'meta-analysis', 'systematic review'
        ]
        self.bias_indicators = [
            'always', 'never', 'all', 'none', 'every', 'completely',
            'totally', 'absolutely', 'definitely', 'obviously',
            'clearly', 'undoubtedly', 'certainly'
        ]
    
    def analyze_text(self, text, headline='', url='', mode='basic'):
        full_text = f"{headline} {text}".lower()
        credibility_score = 0.5
        
        credible_matches = sum(1 for phrase in self.credible_phrases if phrase in full_text)
        credibility_score += min(credible_matches * 0.15, 0.4)
        
        suspicious_matches = sum(1 for phrase in self.suspicious_phrases if phrase in full_text)
        credibility_score -= min(suspicious_matches * 0.1, 0.3)
        
        if url:
            credible_domains = ['.edu', '.gov', '.org']
            if any(domain in url for domain in credible_domains):
                credibility_score += 0.1
        
        bias_matches = sum(1 for indicator in self.bias_indicators if indicator in full_text)
        bias_score = min(bias_matches * 0.05, 0.8)
        
        credibility_score -= bias_score * 0.2
        credibility_score = max(0.0, min(1.0, credibility_score))
        
        confidence = min(0.9, 0.5 + len(text) / 2000)
        
        return {
            'credibility_score': round(credibility_score, 2),
            'analysis': {
                'bias_score': round(bias_score, 2),
                'confidence': round(confidence, 2),
                'summary': "Basic pattern-based analysis completed.",
                'recommendations': ["Verify with reliable sources", "Consider fact-check websites"],
                'credible_indicators': credible_matches,
                'suspicious_indicators': suspicious_matches
            },
            'metadata': {}
        }
