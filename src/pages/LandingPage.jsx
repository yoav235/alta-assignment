import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log('✅ User already authenticated, redirecting to dashboard...');
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e2e8f0',
          borderTopColor: '#667eea',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#718096', fontSize: '1.125rem' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Transform Your Sales Process with AI-Powered Scheduling
            </h1>
            <p className="hero-subtitle">
              Our intelligent meeting scheduler streamlines your sales team's workflow, 
              automatically managing availability, round-robin assignments, and meeting 
              coordination. Never miss an opportunity again.
            </p>
            <div className="hero-cta">
              <div className="phone-cta">
                <svg className="phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>Call our AI voice agent at <strong>+1 (917) 717-5443</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Intelligence</h3>
              <p>Smart algorithms handle complex scheduling logic, respecting working hours, buffers, and availability rules.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚖️</div>
              <h3>Round-Robin Distribution</h3>
              <p>Automatically balance meeting load across your sales team with weighted assignment based on performance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Google Calendar Sync</h3>
              <p>Seamless integration with Google Calendar ensures your team stays synchronized and organized.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics & Insights</h3>
              <p>Track booking conversions, no-show rates, and team performance with comprehensive dashboards.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Compliant</h3>
              <p>Full audit trails and secure token-based booking ensures data protection and compliance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Multi-Channel Booking</h3>
              <p>Accept bookings via web, voice agent, or phone - making it easy for leads to connect.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Booking Success Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">Zero</div>
            <div className="stat-label">Double Bookings</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">&lt;30s</div>
            <div className="stat-label">Average Time to Book</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Availability</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Optimize Your Meetings?</h2>
          <p>Call our AI voice agent at <strong>+1 (917) 717-5443</strong> to schedule your meeting today</p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;

