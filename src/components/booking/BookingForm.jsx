import { useState } from 'react';
import { validateEmail, validatePhone, formatPhoneNumber } from '../../utils/helpers';
import './BookingForm.css';

function BookingForm({ onSubmit, selectedSlot, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
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
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!validatePhone(value)) {
          error = 'Please enter a valid phone number';
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
    const phoneValid = validateField('phone', formData.phone);
    
    setTouched({
      name: true,
      email: true,
      phone: true,
    });

    return nameValid && emailValid && phoneValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }

    onSubmit({
      ...formData,
      phone: formatPhoneNumber(formData.phone),
    });
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h3>Your Information</h3>
      
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
          placeholder="john@example.com"
          disabled={isSubmitting}
        />
        {touched.email && errors.email && (
          <span className="error-message">{errors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="phone">
          Phone Number <span className="required">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.phone && errors.phone ? 'error' : ''}
          placeholder="(555) 123-4567"
          disabled={isSubmitting}
        />
        {touched.phone && errors.phone && (
          <span className="error-message">{errors.phone}</span>
        )}
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={isSubmitting || !selectedSlot}
      >
        {isSubmitting ? (
          <>
            <span className="button-spinner"></span>
            Booking...
          </>
        ) : (
          'Confirm Booking'
        )}
      </button>

      {!selectedSlot && (
        <p className="info-message">
          ℹ️ Please select a time slot above to continue
        </p>
      )}
    </form>
  );
}

export default BookingForm;

