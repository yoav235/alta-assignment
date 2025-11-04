import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail } from '../utils/helpers';
import './SignUpPage.css';

function SignUpPage() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
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
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value)) {
          error = 'Password must contain uppercase, lowercase, and number';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
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
    const nameValid = validateField('name', formData.name);
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    const confirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);
    
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    return nameValid && emailValid && passwordValid && confirmPasswordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

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
      setGeneralError('Failed to process Google sign-up. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setGeneralError('Google sign-up was cancelled or failed. Please try again.');
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1>Create Your Account</h1>
            <p>Join us to manage your meetings efficiently</p>
          </div>

          {generalError && (
            <div className="error-banner">
              <strong>⚠️</strong> {generalError}
            </div>
          )}

          {/* Google Sign Up Button */}
          <div className="google-signup-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signup_with"
              width="100%"
            />
          </div>

          <div className="divider">
            <span>or sign up with email</span>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.name && errors.name ? 'error' : ''}
                placeholder="John Doe"
                disabled={isSubmitting}
                autoComplete="name"
              />
              {touched.name && errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

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
                placeholder="Create a strong password"
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              {touched.password && errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.confirmPassword && errors.confirmPassword ? 'error' : ''}
                placeholder="Re-enter your password"
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="terms-agreement">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="button-spinner"></span>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="signin-link">
            Already have an account? <Link to="/signin">Sign in</Link>
          </div>
        </div>

        <div className="signup-benefits">
          <h2>Why Join Us?</h2>
          <ul>
            <li>
              <span className="benefit-icon">🚀</span>
              <div>
                <strong>Boost Productivity</strong>
                <p>Automate meeting scheduling and focus on closing deals</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">🔄</span>
              <div>
                <strong>Fair Distribution</strong>
                <p>Round-robin system ensures balanced workload</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">📈</span>
              <div>
                <strong>Performance Tracking</strong>
                <p>Monitor your conversion rates and optimize</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">🔔</span>
              <div>
                <strong>Real-time Notifications</strong>
                <p>Never miss a meeting with instant alerts</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">🌐</span>
              <div>
                <strong>Multi-channel Support</strong>
                <p>Accept bookings via web, phone, or voice agent</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">🔒</span>
              <div>
                <strong>Enterprise Security</strong>
                <p>Your data is protected with industry-standard encryption</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;


