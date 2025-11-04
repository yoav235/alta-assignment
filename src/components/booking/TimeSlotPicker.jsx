import { useState, useEffect } from 'react';
import { getAvailability } from '../../services/api';
import { groupSlotsByDate, formatTime, getErrorMessage } from '../../utils/helpers';
import './TimeSlotPicker.css';

function TimeSlotPicker({ onSelectSlot, selectedSlot }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch availability for the next 7 days
      const data = await getAvailability();
      
      setSlots(data.slots || []);
      
      // Auto-select first date if available
      if (data.slots && data.slots.length > 0) {
        const grouped = groupSlotsByDate(data.slots);
        const firstDate = Object.keys(grouped)[0];
        setSelectedDate(firstDate);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="time-slot-picker">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading available time slots...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="time-slot-picker">
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={fetchAvailability} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="time-slot-picker">
        <div className="no-slots-message">
          <p>😔 No available time slots at the moment.</p>
          <p>Please check back later or call us at <strong>1-800-SCHEDULE</strong></p>
        </div>
      </div>
    );
  }

  const groupedSlots = groupSlotsByDate(slots);
  const dates = Object.keys(groupedSlots);

  return (
    <div className="time-slot-picker">
      <h3>Select a Date & Time</h3>
      
      {/* Date Selector */}
      <div className="date-tabs">
        {dates.map((date) => (
          <button
            key={date}
            className={`date-tab ${selectedDate === date ? 'active' : ''}`}
            onClick={() => setSelectedDate(date)}
          >
            {date}
          </button>
        ))}
      </div>

      {/* Time Slots Grid */}
      {selectedDate && (
        <div className="time-slots-grid">
          {groupedSlots[selectedDate].map((slot) => {
            const isSelected = selectedSlot?.start === slot.start;
            return (
              <button
                key={slot.start}
                className={`time-slot ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectSlot(slot)}
              >
                {formatTime(slot.start)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TimeSlotPicker;

