import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function OAuthCallback() {
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    // Get token from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    console.log('🔄 OAuth Callback - Token:', token ? 'received' : 'missing', 'Error:', error || 'none');

    if (error) {
      console.error('❌ OAuth error:', error);
      // Redirect to sign-in with error message
      navigate('/signin?error=' + encodeURIComponent(error));
      return;
    }

    if (token) {
      // Process the token
      handleOAuthCallback(token);
      
      // Redirect to dashboard
      console.log('✅ OAuth successful, redirecting to dashboard');
      navigate('/dashboard');
    } else {
      console.error('❌ No token received from OAuth');
      navigate('/signin?error=No token received');
    }
  }, [navigate, handleOAuthCallback]);

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
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: '#4a5568', fontSize: '1.125rem' }}>
        Completing sign-in...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default OAuthCallback;

