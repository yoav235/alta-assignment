import { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import './Calendar.css';

// Mock available time slots for demo
const generateMockSlots = () => {
  const slots = [];
  const today = new Date();
  
  // Generate slots for next 14 days
  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const date = addDays(today, dayOffset);
    
    // Skip weekends for demo
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // Generate time slots (9 AM - 5 PM, excluding 12-1 PM lunch)
    const times = [
      '09:00', '10:00', '11:00', 
      '13:00', '14:00', '15:00', '16:00'
    ];
    
    times.forEach(time => {
      const [hours, minutes] = time.split(':');
      const slotDate = new Date(date);
      slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      slots.push({
        start: slotDate.toISOString(),
        end: new Date(slotDate.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
      });
    });
  }
  
  return slots;
};

function Calendar({ onSelectSlot, selectedSlot }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [availableSlots] = useState(generateMockSlots());
  
  // Generate week days (Mon-Fri)
  const weekDays = [];
  for (let i = 0; i < 5; i++) {
    weekDays.push(addDays(currentWeekStart, i));
  }
  
  // Time slots to display (9 AM - 5 PM)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00'
  ];
  
  const goToPreviousWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };
  
  const goToNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };
  
  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };
  
  // Check if a slot is available
  const isSlotAvailable = (day, time) => {
    // Skip lunch hour (12:00)
    if (time === '12:00') return false;
    
    const [hours, minutes] = time.split(':');
    const slotDate = new Date(day);
    slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    return availableSlots.some(slot => {
      const slotStart = new Date(slot.start);
      return slotStart.getTime() === slotDate.getTime();
    });
  };
  
  // Check if a slot is selected
  const isSlotSelected = (day, time) => {
    if (!selectedSlot) return false;
    
    const [hours, minutes] = time.split(':');
    const slotDate = new Date(day);
    slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const selectedStart = new Date(selectedSlot.start);
    return selectedStart.getTime() === slotDate.getTime();
  };
  
  // Handle slot click
  const handleSlotClick = (day, time) => {
    if (!isSlotAvailable(day, time)) return;
    
    const [hours, minutes] = time.split(':');
    const slotDate = new Date(day);
    slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Check if this slot is already selected
    if (isSlotSelected(day, time)) {
      // Deselect by passing null
      onSelectSlot(null);
      return;
    }
    
    const slot = availableSlots.find(s => {
      const slotStart = new Date(s.start);
      return slotStart.getTime() === slotDate.getTime();
    });
    
    if (slot) {
      onSelectSlot(slot);
    }
  };
  
  const isToday = (date) => isSameDay(date, new Date());
  const isPast = (date) => date < new Date() && !isToday(date);
  
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h3>Select a Time Slot</h3>
        <div className="calendar-navigation">
          <button onClick={goToPreviousWeek} className="nav-btn">
            ← Previous Week
          </button>
          <button onClick={goToCurrentWeek} className="nav-btn current">
            Today
          </button>
          <button onClick={goToNextWeek} className="nav-btn">
            Next Week →
          </button>
        </div>
      </div>
      
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot selected"></span>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot unavailable"></span>
          <span>Unavailable</span>
        </div>
      </div>
      
      <div className="calendar-grid">
        {/* Time column */}
        <div className="time-column">
          <div className="day-header"></div>
          {timeSlots.map(time => (
            <div key={time} className="time-label">
              {time}
            </div>
          ))}
        </div>
        
        {/* Day columns */}
        {weekDays.map(day => (
          <div key={day.toISOString()} className="day-column">
            <div className={`day-header ${isToday(day) ? 'today' : ''} ${isPast(day) ? 'past' : ''}`}>
              <div className="day-name">{format(day, 'EEE')}</div>
              <div className="day-date">{format(day, 'd')}</div>
              <div className="day-month">{format(day, 'MMM')}</div>
            </div>
            {timeSlots.map(time => {
              const available = isSlotAvailable(day, time);
              const selected = isSlotSelected(day, time);
              const past = isPast(day);
              const lunch = time === '12:00';
              
              return (
                <div
                  key={`${day}-${time}`}
                  className={`time-slot ${available ? 'available' : 'unavailable'} ${selected ? 'selected' : ''} ${past ? 'past' : ''} ${lunch ? 'lunch' : ''}`}
                  onClick={() => handleSlotClick(day, time)}
                  title={lunch ? 'Lunch Break' : selected ? 'Click to deselect' : available ? 'Click to select' : 'Not available'}
                >
                  {lunch && <span className="lunch-label">🍽️ Lunch</span>}
                  {selected && !lunch && <span className="checkmark">✓</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="calendar-note">
        <p>📌 <strong>Note:</strong> This is demo data. Time slots will be fetched from the backend once it's ready.</p>
      </div>
    </div>
  );
}

export default Calendar;

