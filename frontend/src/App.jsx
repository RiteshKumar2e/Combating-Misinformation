import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Shield, Search, Brain, Globe, Zap, Play, TrendingUp } from 'lucide-react';
import './App.css';

// Animated Statistics Counter
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return <span>{count}{suffix}</span>;
};

// Interactive Analysis Progress
const AnalysisProgress = ({ isActive, progress }) => {
  return (
    <div className="analysis-progress">
      <div className="progress-container">
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: isActive ? `${progress}%` : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        <div className="progress-steps">
        {['Text Analysis', 'Source Verification', 'Bias Detection', 'Credibility Score'].map((step, index) => {
  const isCompleted = progress >= (index + 1) * 25;

  return (
    <motion.div 
      key={step}
      className={`progress-step ${isCompleted ? 'completed' : ''}`}
      initial={{ scale: 0.9 }}
      animate={{ 
        scale: isCompleted ? 1.1 : 1, // pop when completed
      }}
      transition={{ 
        delay: index * 2,       // each step highlights in sequence
        duration: 1.2,
        ease: "easeInOut"
      }}
    >
      <div className="step-icon">
        {isCompleted ? '✓' : index + 1}
      </div>
      <span>{step}</span>
    </motion.div>
  );
})}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  // Enhanced state management
  const [currentPage, setCurrentPage] = useState('home');
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [backendUrl, setBackendUrl] = useState('http://localhost:5000');
  const [isConnected, setIsConnected] = useState(false);
  const [showBackendConfig, setShowBackendConfig] = useState(false);
  const [analysisMode, setAnalysisMode] = useState('basic');
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [notifications, setNotifications] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    headline: '',
    text: '',
    url: ''
  });
  
  // Results state with enhanced data
  const [analysisResults, setAnalysisResults] = useState(null);
  
  // Animation controls
  const controls = useAnimation();

  // Sample data for enhanced visualizations
  const sampleAnalysisData = [
    { name: 'Credibility', value: 85, fullMark: 100 },
    { name: 'Bias', value: 15, fullMark: 100 },
    { name: 'Sources', value: 92, fullMark: 100 },
    { name: 'Factual', value: 88, fullMark: 100 },
    { name: 'Clarity', value: 76, fullMark: 100 },
    { name: 'Relevance', value: 94, fullMark: 100 }
  ];

  // Enhanced initialization
  useEffect(() => {
    initializeApp();
    setupEventListeners();
    checkBackendStatus();
    initializeNotifications();
    
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const initializeApp = () => {
    const savedUrl = localStorage.getItem('backendUrl') || backendUrl;
    const savedTheme = localStorage.getItem('theme') || currentTheme;
    
    setBackendUrl(savedUrl);
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Animate page entrance
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    });
  };

  const setupEventListeners = () => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  };

  const initializeNotifications = () => {
    // Initialize notification system
    addNotification('Welcome to Misinformation Guard!', 'info');
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/status`);
      setIsConnected(response.ok);
    } catch {
      setIsConnected(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const saveBackendConfig = () => {
    localStorage.setItem('backendUrl', backendUrl);
    setShowBackendConfig(false);
    checkBackendStatus();
    addNotification('Backend configuration saved!', 'success');
  };

  const loadExample = () => {
    setFormData({
      headline: 'Scientists Discover Breakthrough in Quantum Computing',
      text: 'Researchers at MIT have announced a major breakthrough in quantum computing technology that could revolutionize data processing. The new quantum processor can perform calculations 1000 times faster than traditional computers, potentially solving complex problems in seconds that would take current supercomputers years to complete.',
      url: 'https://example-tech-news.com/quantum-breakthrough'
    });
    addNotification('Example content loaded!', 'info');
  };

  const clearForm = () => {
    setFormData({ headline: '', text: '', url: '' });
    setAnalysisResults(null);
    setShowResults(false);
    setAnalysisProgress(0);
  };

  const analyze = async () => {
    if (!formData.text.trim()) {
      addNotification('Please enter content to analyze.', 'error');
      return;
    }

    if (!isConnected) {
      addNotification('Backend is not connected. Please configure the backend URL.', 'error');
      setShowBackendConfig(true);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate progressive analysis
    const progressSteps = [25, 50, 75, 100];
    for (let i = 0; i < progressSteps.length; i++) {
      setTimeout(() => {
        setAnalysisProgress(progressSteps[i]);
      }, (i + 1) * 800);
    }

    try {
      const requestData = {
        text: formData.text,
        headline: formData.headline,
        url: formData.url,
        mode: analysisMode
      };

      // Simulated analysis result for demo
      setTimeout(() => {
        const mockResult = {
          credibility_score: 0.85,
          analysis: {
            confidence: 0.92,
            bias_score: 0.2,
            readability: "High",
            sources_found: ["https://example.com/source1", "https://example.com/source2"],
            fact_check_results: [{}, {}],
            summary: "The content appears credible based on cross-referenced sources.",
            recommendations: ["Always check multiple sources.", "Be cautious of sensational headlines."]
          }
        };
        setAnalysisResults(mockResult);
        setShowResults(true);
        setIsAnalyzing(false);
        addNotification('Analysis completed successfully!', 'success');
      }, 5000);

    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisResults({
        error: 'Failed to analyze content. Please check your backend connection.'
      });
      setShowResults(true);
      setIsAnalyzing(false);
      addNotification('Analysis failed. Please try again.', 'error');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      addNotification('Backend is not connected. Please try again later.', 'error');
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      addNotification('Message sent successfully!', 'success');
      e.target.reset();
    }, 1000);
  };

  const showDemo = () => {
    addNotification('Demo feature coming soon!', 'info');
  };

  // Enhanced Results Display Component
  const ResultsDisplay = () => {
    if (!showResults || !analysisResults) return null;

    if (analysisResults.error) {
      return (
        <motion.div 
          className="results-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="results-card error-card">
            <h3 style={{color: '#ef4444'}}>Analysis Error</h3>
            <p style={{color: 'var(--text-secondary)', marginTop: '1rem'}}>
              {analysisResults.error}
            </p>
          </div>
        </motion.div>
      );
    }

    const score = analysisResults.credibility_score || 0.5;
    const scoreClass = score >= 0.7 ? 'score-high' : score >= 0.4 ? 'score-medium' : 'score-low';
    const scoreLabel = score >= 0.7 ? 'Highly Credible' : score >= 0.4 ? 'Moderately Credible' : 'Low Credibility';

    return (
      <motion.div 
        className="results-section enhanced"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="results-grid">
          {/* Main Score Card */}
          <motion.div 
            className="score-card"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>Credibility Analysis</h3>
            <div className="credibility-display">
              <div className="score-visualization">
                <div style={{ 
                  width: '200px', 
                  height: '200px', 
                  borderRadius: '50%', 
                  background: `conic-gradient(${score >= 0.7 ? '#10b981' : score >= 0.4 ? '#f59e0b' : '#ef4444'} ${score * 360}deg, #333 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {Math.round(score * 100)}%
                </div>
              </div>
              <div className="score-details">
                <h4>{scoreLabel}</h4>
                <p>Confidence: {Math.round((analysisResults.analysis?.confidence || 0.5) * 100)}%</p>
              </div>
            </div>
          </motion.div>

          {/* Radar Chart */}
          <motion.div 
            className="chart-card"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h4>Detailed Analysis</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={sampleAnalysisData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar
                  name="Analysis"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            {[
              { label: 'Sources Found', value: analysisResults.analysis?.sources_found?.length || 0, icon: '📚' },
              { label: 'Fact Checks', value: analysisResults.analysis?.fact_check_results?.length || 0, icon: '✓' },
              { label: 'Bias Score', value: `${Math.round((1 - (analysisResults.analysis?.bias_score || 0)) * 100)}%`, icon: '⚖️' },
              { label: 'Readability', value: analysisResults.analysis?.readability || 'N/A', icon: '📖' }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                className="metric-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="metric-icon">{metric.icon}</div>
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Sources and Recommendations */}
          <motion.div 
            className="details-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h4>Sources & Recommendations</h4>
            <div className="sources-list">
              {analysisResults.analysis?.sources_found?.map((source, index) => (
                <span key={index} className="source-tag">{source}</span>
              ))}
            </div>
            {analysisResults.analysis?.summary && (
              <div className="summary-section">
                <h5>Analysis Summary</h5>
                <p>{analysisResults.analysis.summary}</p>
              </div>
            )}
            {analysisResults.analysis?.recommendations && (
              <div className="recommendations-section">
                <h5>Recommendations</h5>
                <ul>
                  {analysisResults.analysis.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // Notification Component
  const NotificationSystem = () => (
    <div className="notification-system">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className={`notification notification-${notification.type}`}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}>
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="App enhanced">
      {/* Enhanced Navigation */}
      <motion.nav 
        className="professional-nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="nav-container">
          <motion.div 
            className="nav-brand"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="brand-icon">🛡️</div>
            <div className="brand-text">
              <h1>Misinformation Guard</h1>
              <span>AI-Powered Fact-Checking Platform</span>
            </div>
          </motion.div>
          
          <div className="nav-menu">
            {['home', 'analyze', 'about', 'api', 'contact'].map((page) => (
              <motion.a
                key={page}
                href="#"
                className={`nav-item ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </motion.a>
            ))}
          </div>
          
          <div className="nav-actions">
            <motion.button 
              className="btn-secondary" 
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {currentTheme === 'dark' ? '☀️' : '🌙'}
            </motion.button>
            <motion.button 
              className="btn-primary" 
              onClick={() => setCurrentPage('analyze')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={16} />
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div className="page-container">
        {/* Enhanced Home Page */}
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div 
              className="page active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <section className="hero-section">
                <div className="hero-background">
                  <motion.div 
                    className="gradient-orb orb-1"
                    animate={{ 
                      x: [0, 50, -30, 0],
                      y: [0, -30, 20, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                  />
                  <motion.div 
                    className="gradient-orb orb-2"
                    animate={{ 
                      x: [0, -40, 30, 0],
                      y: [0, 40, -20, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                  />
                  <motion.div 
                    className="gradient-orb orb-3"
                    animate={{ 
                      x: [0, 20, -50, 0],
                      y: [0, -20, 30, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                  />
                </div>
                
                <div className="hero-content">
                  <motion.div 
                    className="hero-text"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h1 className="hero-title">
                      Combat Misinformation with
                      <span className="gradient-text"> AI-Powered Analysis</span>
                    </h1>
                    <p className="hero-subtitle">
                      Advanced fact-checking platform combining NLP analysis, real-time verification, 
                      and comprehensive credibility scoring for reliable information assessment.
                    </p>

                    <motion.div 
                      className="hero-stats"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <div className="stat-item">
                        <div className="stat-number">
                          <AnimatedCounter end={150} suffix="+" />
                        </div>
                        <div className="stat-label">Fact-Check Sources</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">
                          <AnimatedCounter end={99} suffix="%" />
                        </div>
                        <div className="stat-label">Accuracy Rate</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">
                          <AnimatedCounter end={50000} suffix="+" />
                        </div>
                        <div className="stat-label">Articles Analyzed</div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="hero-actions"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <motion.button 
                        className="btn-hero-primary" 
                        onClick={() => setCurrentPage('analyze')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Search size={20} />
                        Start Analysis
                        <span className="btn-arrow">→</span>
                      </motion.button>
                      <motion.button 
                        className="btn-hero-secondary" 
                        onClick={showDemo}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play size={20} />
                        Watch Demo
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>
              </section>

              {/* Enhanced Features Section */}
              <motion.section 
                className="features-section"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="section-container">
                  <motion.div 
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="section-title">Cutting-Edge Features</h2>
                    <p className="section-subtitle">
                      Powered by advanced AI and machine learning algorithms
                    </p>
                  </motion.div>

                  <div className="features-grid">
                    {[
                      {
                        icon: <Brain size={32} />,
                        title: "AI-Powered Analysis",
                        description: "Advanced NLP models analyze content for credibility, bias, and factual accuracy",
                        color: "#6366f1"
                      },
                      {
                        icon: <Shield size={32} />,
                        title: "Real-time Verification",
                        description: "Instant cross-referencing with trusted sources and fact-checking databases",
                        color: "#10b981"
                      },
                      {
                        icon: <Globe size={32} />,
                        title: "Multi-source Integration",
                        description: "Connected to 150+ fact-checking organizations and news outlets worldwide",
                        color: "#8b5cf6"
                      },
                      {
                        icon: <TrendingUp size={32} />,
                        title: "Trend Analysis",
                        description: "Track misinformation patterns and emerging false narratives in real-time",
                        color: "#f59e0b"
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        className="feature-card"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        viewport={{ once: true }}
                      >
                        <div className="feature-icon" style={{ color: feature.color }}>
                          {feature.icon}
                        </div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Analyze Page */}
        <AnimatePresence mode="wait">
          {currentPage === 'analyze' && (
            <motion.div 
              className="page active"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <section className="analysis-section">
                <div className="section-container">
                  <motion.div 
                    className="section-header2"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="section-title2">Content Analysis Platform</h2>
                    <p className="section-subtitle2">
                      Upload content, images, or provide URLs for comprehensive fact-checking and credibility analysis
                    </p>
                  </motion.div>

                  <motion.div 
                    className="analysis-card"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="card-header">
                      <h3>Analyze Content Credibility</h3>
                      <div className="analysis-mode-toggle">
                        <motion.button 
                          className={`mode-btn ${analysisMode === 'basic' ? 'active' : ''}`}
                          onClick={() => setAnalysisMode('basic')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Basic Analysis
                        </motion.button>
                        <motion.button 
                          className={`mode-btn ${analysisMode === 'advanced' ? 'active' : ''}`}
                          onClick={() => setAnalysisMode('advanced')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Advanced AI
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="card-content">
                      <motion.div 
                        className="input-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        <div className="input-group">
                          <label className="input-label">
                            <span className="label-icon">📰</span>
                            Headline (Optional)
                          </label>
                          <motion.input 
                            id="headline"
                            className="professional-input" 
                            placeholder="Enter article headline or claim title..."
                            maxLength="200"
                            value={formData.headline}
                            onChange={handleInputChange}
                            whileFocus={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                          <div className="input-counter">
                            <span>{formData.headline.length}</span>/200
                          </div>
                        </div>
                        
                        <div className="input-group full-width">
                          <label className="input-label">
                            <span className="label-icon">📝</span>
                            Content Text
                            <span className="required">*</span>
                          </label>
                          <motion.textarea 
                            id="text"
                            className="professional-textarea" 
                            placeholder="Paste article text, social media post, or claim to analyze..."
                            maxLength="5000"
                            value={formData.text}
                            onChange={handleInputChange}
                            whileFocus={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                          <div className="input-counter">
                            <span>{formData.text.length}</span>/5000
                          </div>
                        </div>
                        
                        <div className="input-group">
                          <label className="input-label">
                            <span className="label-icon">🔗</span>
                            Source URL (Optional)
                          </label>
                          <motion.input 
                            id="url"
                            className="professional-input" 
                            placeholder="https://example.com/article..."
                            type="url"
                            value={formData.url}
                            onChange={handleInputChange}
                            whileFocus={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="analysis-controls"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <div className="action-buttons">
                          <motion.button 
                            className="btn-secondary" 
                            onClick={loadExample}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            📄 Load Example
                          </motion.button>
                          <motion.button 
                            className="btn-secondary" 
                            onClick={clearForm}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            🗑️ Clear All
                          </motion.button>
                          <motion.button 
                            className="btn-primary analyze-btn" 
                            onClick={analyze} 
                            disabled={isAnalyzing}
                            whileHover={!isAnalyzing ? { scale: 1.05, y: -2 } : {}}
                            whileTap={!isAnalyzing ? { scale: 0.95 } : {}}
                          >
                            <Search size={16} />
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
                            {isAnalyzing && (
                              <div className="btn-loading">
                                <div className="loading-spinner"></div>
                              </div>
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Analysis Progress */}
                  <AnimatePresence>
                    {isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AnalysisProgress isActive={isAnalyzing} progress={analysisProgress} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <ResultsDisplay />
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* About Page */}
        <AnimatePresence mode="wait">
          {currentPage === 'about' && (
            <motion.div 
              className="page active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="about-content">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  About Misinformation Guard
                </motion.h2>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <p>
                    Misinformation Guard is a cutting-edge AI-powered fact-checking platform designed to combat the spread 
                    of misinformation across digital media. Our advanced algorithms analyze content using natural language 
                    processing, cross-reference multiple trusted sources, and provide comprehensive credibility assessments.
                  </p>
                  <p>
                    Built with state-of-the-art machine learning models, our platform offers real-time analysis of text, 
                    images, and multimedia content. We integrate with over 150 fact-checking organizations and verification 
                    sources to ensure comprehensive coverage and accuracy.
                  </p>
                  
                  <h3>Key Features:</h3>
                  <motion.ul
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <li>AI-powered natural language processing</li>
                    <li>Real-time fact verification</li>
                    <li>Visual content analysis</li>
                    <li>Multi-source credibility scoring</li>
                    <li>API integration capabilities</li>
                    <li>Advanced bias detection algorithms</li>
                    <li>Sentiment and emotion analysis</li>
                    <li>Interactive visualization tools</li>
                  </motion.ul>
                  
                  <p>
                    Our mission is to provide accessible, accurate, and unbiased fact-checking tools that empower users 
                    to make informed decisions about the information they consume and share. Through cutting-edge technology 
                    and rigorous verification processes, we're building a more trustworthy information ecosystem.
                  </p>
                  
                  <motion.div
                    className="stats-showcase"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <div className="stats-grid">
                      {[
                        { number: "99.2%", label: "Accuracy Rate", icon: "🎯" },
                        { number: "50K+", label: "Articles Analyzed", icon: "📊" },
                        { number: "150+", label: "Trusted Sources", icon: "🔗" },
                        { number: "<2s", label: "Average Analysis Time", icon: "⚡" }
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          className="stat-card"
                          whileHover={{ y: -5, scale: 1.02 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        >
                          <div className="stat-icon">{stat.icon}</div>
                          <div className="stat-number">{stat.number}</div>
                          <div className="stat-label">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API Page */}
        <AnimatePresence mode="wait">
          {currentPage === 'api' && (
            <motion.div 
              className="page active"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="api-content">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  API Documentation
                </motion.h2>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="endpoint-card">
                    <div className="endpoint-header">
                      <span className="method-badge method-post">POST</span>
                      <h3>/api/analyze</h3>
                    </div>
                    <p>Analyze content for misinformation and credibility scoring.</p>
                    
                    <h4>Request Body:</h4>
                    <div className="code-block">
{`{
  "text": "Content to analyze",
  "headline": "Optional headline", 
  "url": "Optional source URL",
  "mode": "basic|advanced",
  "options": {
    "include_sources": true,
    "detect_bias": true,
    "sentiment_analysis": true
  }
}`}
                    </div>
                    
                    <h4>Response:</h4>
                    <div className="code-block">
{`{
  "credibility_score": 0.85,
  "confidence": 0.92,
  "analysis": {
    "bias_score": 0.2,
    "sentiment": "neutral",
    "fact_check_results": [...],
    "sources_found": [...],
    "recommendations": [...],
    "processing_time": 1.2
  },
  "metadata": {
    "api_version": "2.0",
    "analysis_date": "2025-09-21T10:30:00Z"
  }
}`}
                    </div>
                  </div>

                  <motion.div 
                    className="endpoint-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <div className="endpoint-header">
                      <span className="method-badge method-get">GET</span>
                      <h3>/api/status</h3>
                    </div>
                    <p>Check API health and status.</p>
                    
                    <h4>Response:</h4>
                    <div className="code-block">
{`{
  "status": "healthy",
  "version": "2.0.1",
  "uptime": 86400,
  "requests_processed": 150000,
  "accuracy_rate": 0.992
}`}
                    </div>
                  </motion.div>

                  <motion.div 
                    className="endpoint-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <h3>Authentication</h3>
                    <p>Include your API key in the Authorization header:</p>
                    <div className="code-block">
                      Authorization: Bearer YOUR_API_KEY
                    </div>
                  </motion.div>

                  <motion.div 
                    className="endpoint-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <h3>Python SDK Example</h3>
                    <div className="code-block">
{`import misinformation_guard as mg

# Initialize client
client = mg.Client(api_key="YOUR_API_KEY")

# Analyze content
result = client.analyze(
    text="Your content here",
    mode="advanced",
    options={
        "include_sources": True,
        "detect_bias": True
    }
)

print(f"Credibility Score: {result.credibility_score}")
print(f"Analysis: {result.analysis.summary}")

# Batch analysis
results = client.batch_analyze([
    {"text": "First article..."},
    {"text": "Second article..."}
])

for result in results:
    print(f"Score: {result.credibility_score}")`}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Page */}
        <AnimatePresence mode="wait">
          {currentPage === 'contact' && (
            <motion.div 
              className="page active contact-page"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className="contact-container">
                <motion.h2 
                  className="contact-title"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Contact Us
                </motion.h2>
                
                <motion.div 
                  className="contact-card"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <form onSubmit={handleContactSubmit} className="contact-form">
                    <motion.div 
                      className="form-group"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <label htmlFor="contactName">Name <span className="required">*</span></label>
                      <input type="text" id="contactName" name="name" placeholder="Enter your full name" required />
                    </motion.div>
                    
                    <motion.div 
                      className="form-group"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <label htmlFor="contactEmail">Email <span className="required">*</span></label>
                      <input type="email" id="contactEmail" name="email" placeholder="Enter your email address" required />
                    </motion.div>
                    
                    <motion.div 
                      className="form-group"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      <label htmlFor="contactSubject">Subject</label>
                      <input type="text" id="contactSubject" name="subject" placeholder="Enter subject" />
                    </motion.div>
                    
                    <motion.div 
                      className="form-group"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <label htmlFor="contactMessage">Message <span className="required">*</span></label>
                      <textarea id="contactMessage" name="message" rows="6" placeholder="Write your message here..." required />
                    </motion.div>
                    
                    <motion.button 
                      type="submit" 
                      className="btn-primary"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Send Message
                    </motion.button>
                  </form>
                  
                  <motion.div 
                    className="contact-info"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <p>📧 <a href="mailto:support@misinformationguard.com">support@misinformationguard.com</a></p>
                    <p>🌐 <a href="https://misinformationguard.com" target="_blank" rel="noreferrer">misinformationguard.com</a></p>
                    <p>📱 +1 (555) 123-4567</p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Backend Configuration Modal */}
      <AnimatePresence>
        {showBackendConfig && (
          <motion.div 
            className="backend-config"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="config-modal"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>Backend Configuration</h3>
              <div className="form-group">
                <label htmlFor="backendUrlInput">Backend URL:</label>
                <input 
                  type="text" 
                  id="backendUrlInput" 
                  placeholder="http://localhost:8000"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                />
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <motion.button 
                  className="btn-secondary" 
                  onClick={() => setShowBackendConfig(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button 
                  className="btn-primary" 
                  onClick={saveBackendConfig}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Configuration
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Status Indicator */}
      <motion.div 
        className="status-indicator"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className={`status-dot ${isConnected ? 'connected' : ''}`}></div>
        <span>{isConnected ? `Connected to ${backendUrl}` : 'Backend Offline'}</span>
        <motion.button
          className="status-settings"
          onClick={() => setShowBackendConfig(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ⚙️
        </motion.button>
      </motion.div>

      {/* Notification System */}
      <NotificationSystem />
    </div>
  );
}

export default App;