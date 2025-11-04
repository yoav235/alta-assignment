import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail } from '../utils/helpers';
import './SignInPage.css';

function SignInPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));

    return !error;
  };

  const validateForm = () => {
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    
    setTouched({
      email: true,
      password: true,
    });

    return emailValid && passwordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');

    const result = await login(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setGeneralError(result.error);
    }

    setIsSubmitting(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Decode the JWT token to get user info
      const decoded = jwtDecode(credentialResponse.credential);
      
      const googleData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        credential: credentialResponse.credential,
      };

      const result = await loginWithGoogle(googleData);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setGeneralError(result.error);
      }
    } catch (error) {
      setGeneralError('Failed to process Google login. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setGeneralError('Google sign-in was cancelled or failed. Please try again.');
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="signin-card">
          <div className="signin-header">
            <h1>Welcome Back</h1>
            <p>Sign in to access your SAM dashboard</p>
          </div>

          {generalError && (
            <div className="error-banner">
              <strong>⚠️</strong> {generalError}
            </div>
          )}

          {/* Google Sign In Button */}
          <div className="google-signin-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              text="signin_with"
              width="100%"
            />
          </div>

          <div className="divider">
            <span>or sign in with email</span>
          </div>

          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.email && errors.email ? 'error' : ''}
                placeholder="sam@company.com"
                disabled={isSubmitting}
                autoComplete="email"
              />
              {touched.email && errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.password && errors.password ? 'error' : ''}
                placeholder="Enter your password"
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              {touched.password && errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-footer">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="button-spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="signup-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>

        <div className="signin-benefits">
          <h2>SAM Dashboard Features</h2>
          <ul>
            <li>
              <span className="benefit-icon">📅</span>
              <div>
                <strong>Google Calendar Sync</strong>
                <p>View all your meetings in one place</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">📊</span>
              <div>
                <strong>Analytics & Insights</strong>
                <p>Track your performance and conversions</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">👥</span>
              <div>
                <strong>Lead Management</strong>
                <p>Manage and follow up with leads</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">⚡</span>
              <div>
                <strong>Manual Booking</strong>
                <p>Book meetings on behalf of leads</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;


