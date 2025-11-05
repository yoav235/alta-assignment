import './ErrorModal.css';

function ErrorModal({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="error-modal-overlay" onClick={onClose}>
      <div className="error-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="error-modal-header">
          <div className="error-icon">⚠️</div>
          <h3>Sign In Failed</h3>
        </div>
        <div className="error-modal-body">
          <p>{message || 'An error occurred during sign in. Please try again.'}</p>
        </div>
        <div className="error-modal-footer">
          <button className="error-modal-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;

