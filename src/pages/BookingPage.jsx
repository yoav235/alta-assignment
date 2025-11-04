import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../components/booking/Calendar';
import BookingForm from '../components/booking/BookingForm';
// import { bookMeeting } from '../services/api'; // Will be used when backend is ready
import { formatDateTime } from '../utils/helpers';
import './BookingPage.css';

function BookingPage() {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setError(null);
  };

  const handleFormSubmit = async (formData) => {
    if (!selectedSlot) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Mock booking response - will be replaced with actual API call
      // const bookingPayload = {
      //   lead: {
      //     name: formData.name,
      //     email: formData.email,
      //     phone: formData.phone,
      //   },
      //   start: selectedSlot.start,
      //   end: selectedSlot.end,
      // };
      // const response = await bookMeeting(bookingPayload);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful response
      const mockResponse = {
        success: true,
        meeting: {
          id: 'mock-meeting-' + Date.now(),
          lead: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          start: selectedSlot.start,
          end: selectedSlot.end,
          samId: 'SAM-001',
          status: 'confirmed',
        },
        cancelToken: 'mock-token-' + Math.random().toString(36).substr(2, 9),
      };
      
      setBookingData(mockResponse);
      setBookingComplete(true);
    } catch (err) {
      setError('An error occurred while booking. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleBookAnother = () => {
    setBookingComplete(false);
    setBookingData(null);
    setSelectedSlot(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Confirmation Screen
  if (bookingComplete && bookingData) {
    return (
      <div className="booking-page">
        <div className="booking-container confirmation-container">
          <div className="confirmation-card">
            <div className="success-icon">✓</div>
            <h1>Meeting Confirmed! 🎉</h1>
            <p className="confirmation-subtitle">
              Your meeting has been successfully scheduled
            </p>

            <div className="meeting-details">
              <div className="detail-item">
                <span className="detail-label">📅 Date & Time:</span>
                <span className="detail-value">{formatDateTime(bookingData.meeting?.start)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">👤 Your Name:</span>
                <span className="detail-value">{bookingData.meeting?.lead?.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📧 Email:</span>
                <span className="detail-value">{bookingData.meeting?.lead?.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📱 Phone:</span>
                <span className="detail-value">{bookingData.meeting?.lead?.phone}</span>
              </div>
              {bookingData.meeting?.samId && (
                <div className="detail-item">
                  <span className="detail-label">🤝 Meeting With:</span>
                  <span className="detail-value">Sales Representative #{bookingData.meeting.samId}</span>
                </div>
              )}
            </div>

            <div className="confirmation-notice">
              <p><strong>📨 Check your email!</strong></p>
              <p>We've sent a confirmation email with calendar invite and meeting details.</p>
            </div>

            {bookingData.cancelToken && (
              <div className="cancel-info">
                <p className="cancel-title">Need to reschedule or cancel?</p>
                <p className="cancel-text">
                  Use this link: <br />
                  <a href={`/cancel/${bookingData.cancelToken}`} className="cancel-link">
                    {window.location.origin}/cancel/{bookingData.cancelToken}
                  </a>
                </p>
              </div>
            )}

            <div className="confirmation-actions">
              <button onClick={handleBookAnother} className="secondary-button">
                Book Another Meeting
              </button>
              <button onClick={handleBackToHome} className="primary-button">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Booking Form Screen
  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <button onClick={handleBackToHome} className="back-button">
            ← Back to Home
          </button>
          <h1>Schedule Your Meeting</h1>
          <p className="booking-subtitle">
            Choose a time that works best for you. We'll connect you with one of our sales representatives.
          </p>
        </div>

        {error && (
          <div className="error-banner">
            <strong>⚠️ Booking Error:</strong> {error}
          </div>
        )}

        <div className="booking-content">
          <Calendar
            onSelectSlot={handleSlotSelect}
            selectedSlot={selectedSlot}
          />
          
          {selectedSlot && (
            <div className="booking-form-section">
              <div className="selected-slot-info">
                <p>📅 Selected Time:</p>
                <p className="selected-time">{formatDateTime(selectedSlot.start)}</p>
              </div>
              
              <BookingForm
                onSubmit={handleFormSubmit}
                selectedSlot={selectedSlot}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;

