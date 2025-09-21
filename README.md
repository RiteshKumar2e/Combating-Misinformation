# 🛡️ Misinformation Guard

An AI-powered fact-checking platform that analyzes content for credibility, bias detection, and misinformation indicators. Built with React frontend and Flask backend.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Python](https://img.shields.io/badge/Python-3.8+-green.svg)
![Flask](https://img.shields.io/badge/Flask-2.x-red.svg)

## 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **AI-Powered Analysis**: Advanced NLP algorithms for content credibility assessment
- **Real-time Processing**: Instant analysis of text, headlines, and URLs
- **Credibility Scoring**: Comprehensive scoring system (0-100%) with detailed breakdowns
- **Bias Detection**: Identifies potential bias indicators and language patterns
- **Multi-mode Analysis**: Basic and advanced analysis modes
- **Modern UI/UX**: Professional, responsive interface with dark/light theme support
- **RESTful API**: Well-documented API for integration with other applications
- **Cross-platform**: Works on desktop, tablet, and mobile devices

## 🎯 Demo

### Analysis Features
- **Content Analysis**: Paste any text content for credibility assessment
- **URL Verification**: Analyze web articles by providing URLs
- **Bias Detection**: Identify potential bias in language and phrasing
- **Source Credibility**: Evaluate source reliability and trustworthiness
- **Recommendation Engine**: Get actionable recommendations for content verification

### Key Metrics Analyzed
- Overall credibility score (0-100%)
- Bias score and confidence level
- Suspicious vs. credible phrase detection
- Source domain analysis
- Language pattern recognition

## 🛠️ Technology Stack

### Frontend
- **React 18.x** - Modern React with hooks
- **CSS3** - Custom styling with CSS variables and animations
- **Responsive Design** - Mobile-first approach
- **Theme System** - Dark/light mode support

### Backend
- **Python 3.8+** - Core backend language
- **Flask 2.x** - Lightweight web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Natural Language Processing** - Custom text analysis algorithms

### Key Libraries
- **React Hooks** - useState, useEffect for state management
- **Fetch API** - HTTP client for API communication
- **CSS Grid/Flexbox** - Modern layout systems
- **Flask JSONify** - JSON response handling

## 🚀 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Python 3.8+
- pip (Python package manager)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/misinformation-guard.git
cd misinformation-guard
```

2. **Set up Python virtual environment**
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. **Install Python dependencies**
```bash
pip install flask flask-cors
```

4. **Run the Flask backend**
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory** (if separate) or create React app
```bash
# If you need to create the React app
npx create-react-app misinformation-guard-frontend
cd misinformation-guard-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Replace App.js and App.css with the provided files**

4. **Start the development server**
```bash
npm start
# or
yarn start
```

The frontend will start on `http://localhost:3000`

## 📖 Usage

### Quick Start

1. **Start both servers** (backend on :5000, frontend on :3000)

2. **Access the application** at `http://localhost:3000`

3. **Configure backend connection** (if needed):
   - Click the settings icon in the navigation
   - Enter backend URL (default: `http://localhost:5000`)
   - Save configuration

### Analyzing Content

1. **Navigate to Analysis page**
2. **Choose analysis mode**: Basic or Advanced
3. **Input content**:
   - Enter headline (optional)
   - Paste main content text
   - Add source URL (optional)
4. **Click "Analyze Content"**
5. **Review results**:
   - Overall credibility score
   - Detailed analysis breakdown
   - Recommendations for verification

### Example Analysis

```javascript
// Example API request
const analyzeContent = async () => {
  const response = await fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: "Your content here...",
      headline: "Optional headline",
      url: "https://example.com/source",
      mode: "advanced"
    })
  });
  
  const result = await response.json();
  console.log(result);
};
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### POST /api/analyze
Analyze content for misinformation and credibility.

**Request Body:**
```json
{
  "text": "Content to analyze (required)",
  "headline": "Optional headline",
  "url": "Optional source URL", 
  "mode": "basic|advanced"
}
```

**Response:**
```json
{
  "credibility_score": 0.85,
  "analysis": {
    "bias_score": 0.2,
    "confidence": 0.92,
    "summary": "Analysis summary",
    "recommendations": ["rec1", "rec2"],
    "credible_indicators": 3,
    "suspicious_indicators": 1
  },
  "metadata": {
    "analysis_time": "2024-01-01T12:00:00",
    "text_length": 500,
    "mode": "advanced",
    "version": "1.0.0"
  }
}
```

#### GET /api/status
Get API health status.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T12:00:00",
  "analyzer": "active"
}
```

#### GET /health
Basic health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

### Error Responses

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (missing or invalid data)
- `404` - Endpoint not found
- `500` - Internal server error

## 📁 Project Structure

```
misinformation-guard/
├── README.md
├── app.py                 # Flask backend
├── requirements.txt       # Python dependencies
├── frontend/             # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── App.css       # Styles
│   │   └── index.js      # React entry point
│   ├── package.json      # Node dependencies
│   └── build/           # Production build
├── docs/                # Additional documentation
└── .gitignore
```

### Key Files

- **`app.py`** - Flask backend with analysis engine
- **`App.js`** - React frontend with all components
- **`App.css`** - Complete styling system
- **`README.md`** - This documentation file

## 🔧 Development

### Running in Development Mode

1. **Backend development:**
```bash
# Enable debug mode
python app.py  # Debug is already enabled in the code
```

2. **Frontend development:**
```bash
npm start  # Runs with hot reload
```

### Code Structure

#### Backend (app.py)
- `MisinformationAnalyzer` class handles content analysis
- Flask routes handle HTTP requests
- CORS enabled for frontend communication
- Error handling and logging included

#### Frontend (App.js)
- Single-page application with multiple views
- State management with React hooks
- Professional navigation system
- Responsive design implementation

### Adding New Features

1. **Backend**: Extend `MisinformationAnalyzer` class
2. **Frontend**: Add new components or modify existing ones
3. **API**: Add new routes in Flask app
4. **Styling**: Update CSS variables and classes

### Environment Variables

Create a `.env` file for configuration:
```env
FLASK_ENV=development
FLASK_DEBUG=True
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add new feature'`
5. **Push to the branch**: `git push origin feature/new-feature`
6. **Submit a pull request**

### Development Guidelines

- Follow existing code style and conventions
- Add comments for complex logic
- Test all new features thoroughly
- Update documentation as needed
- Ensure responsive design compatibility

### Code Style

- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use modern ES6+ syntax
- **CSS**: Use CSS custom properties and modern features
- **React**: Use functional components with hooks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React community for excellent documentation
- Flask community for lightweight web framework
- Contributors and testers
- Open source community

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/misinformation-guard/issues)
- **Email**: support@misinformationguard.com
- **Documentation**: [Project Wiki](https://github.com/yourusername/misinformation-guard/wiki)

---

**Built with ❤️ for a more informed digital world**
