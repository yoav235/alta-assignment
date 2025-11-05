import { useState, useEffect, useMemo } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO, isWithinInterval, startOfMonth, endOfMonth, addMonths, subMonths, startOfDay, endOfDay, addDays as addDaysFunc, subDays } from 'date-fns';
import { getMeetings } from '../../services/api';
import { formatTime, getErrorMessage } from '../../utils/helpers';
import './WeeklyCalendar.css';

function WeeklyCalendar() {
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  const [previousView, setPreviousView] = useState('month'); // Track previous view for return navigation
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allMeetings, setAllMeetings] = useState([]); // Store all meetings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null); // For meeting details modal

  useEffect(() => {
    // Fetch all meetings once on mount
    fetchMeetings();
  }, []); // Empty dependency array - fetch only once

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📅 Fetching all meetings from backend...');
      
      const data = await getMeetings();
      console.log('✅ Meetings received:', data);
      
      // Backend returns data.data.meetings
      const meetings = data.data?.meetings || [];
      console.log('📊 Total number of meetings:', meetings.length);
      
      if (meetings.length > 0) {
        console.log('🔍 First meeting details:', {
          start: meetings[0].start,
          parsed: parseISO(meetings[0].start),
          leadName: meetings[0].leadName,
          leadEmail: meetings[0].leadEmail,
          leadPhone: meetings[0].leadPhone
        });
      }
      
      setAllMeetings(meetings);
    } catch (err) {
      console.error('❌ Failed to fetch meetings:', err);
      setError(getErrorMessage(err));
      setAllMeetings([]); // Empty array - NO MOCK DATA
    } finally {
      setLoading(false);
    }
  };

  // Calculate date range based on view
  const { startDate, endDate, displayDates } = useMemo(() => {
    let start, end, dates = [];
    
    switch (view) {
      case 'day':
        start = startOfDay(currentDate);
        end = endOfDay(currentDate);
        dates = [currentDate];
        break;
      case 'week':
        start = startOfWeek(currentDate, { weekStartsOn: 0 });
        end = addDays(start, 6);
        for (let i = 0; i < 7; i++) {
          dates.push(addDays(start, i));
        }
        break;
      case 'month':
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
        
        // Get the day of week for the first day (0 = Sunday)
        const firstDayOfWeek = start.getDay();
        
        // Add empty cells for days before the month starts
        for (let i = 0; i < firstDayOfWeek; i++) {
          dates.push(null); // null represents empty cell
        }
        
        // Add all days in the month
        let day = start;
        while (day <= end) {
          dates.push(day);
          day = addDays(day, 1);
        }
        break;
      default:
        start = startOfWeek(currentDate, { weekStartsOn: 0 });
        end = addDays(start, 6);
        for (let i = 0; i < 7; i++) {
          dates.push(addDays(start, i));
        }
    }
    
    return { startDate: start, endDate: end, displayDates: dates };
  }, [currentDate, view]);

  // Filter meetings based on current view's date range
  const visibleMeetings = useMemo(() => {
    const filtered = allMeetings.filter(meeting => {
      if (!meeting.start) return false;
      
      try {
        const meetingDate = parseISO(meeting.start);
        
        // Create UTC dates for comparison
        const meetingDay = new Date(Date.UTC(
          meetingDate.getUTCFullYear(),
          meetingDate.getUTCMonth(),
          meetingDate.getUTCDate()
        ));
        
        const rangeStartUTC = new Date(Date.UTC(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        ));
        
        const rangeEndUTC = new Date(Date.UTC(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          23, 59, 59
        ));
        
        const isInRange = isWithinInterval(meetingDay, {
          start: rangeStartUTC,
          end: rangeEndUTC
        });
        
        return isInRange;
      } catch (error) {
        console.error('❌ Error filtering meeting:', meeting.start, error);
        return false;
      }
    });
    
    console.log(`📆 ${view} view shown:`, {
      start: format(startDate, 'yyyy-MM-dd'),
      end: format(endDate, 'yyyy-MM-dd'),
      totalMeetings: allMeetings.length,
      visibleMeetings: filtered.length
    });
    
    return filtered;
  }, [allMeetings, startDate, endDate, view]);

  const goToPrevious = () => {
    setCurrentDate(prev => {
      switch (view) {
        case 'day': return subDays(prev, 1);
        case 'week': return subWeeks(prev, 1);
        case 'month': return subMonths(prev, 1);
        default: return subWeeks(prev, 1);
      }
    });
  };

  const goToNext = () => {
    setCurrentDate(prev => {
      switch (view) {
        case 'day': return addDaysFunc(prev, 1);
        case 'week': return addWeeks(prev, 1);
        case 'month': return addMonths(prev, 1);
        default: return addWeeks(prev, 1);
      }
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayDoubleClick = (day) => {
    console.log('📅 Double-clicked day:', format(day, 'yyyy-MM-dd'));
    setPreviousView(view); // Remember current view before switching
    setCurrentDate(day);
    setView('day');
  };

  const handleDayViewDoubleClick = () => {
    console.log('📅 Returning to previous view:', previousView);
    setView(previousView);
  };

  // Get the display label for current view
  const getViewLabel = () => {
    switch (view) {
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'week':
        return `${format(displayDates[0], 'MMM d')} - ${format(displayDates[displayDates.length - 1], 'MMM d, yyyy')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      default:
        return '';
    }
  };

  // Time slots (8 AM - 6 PM)
  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  // Get meetings for a specific day and time
  const getMeetingsForSlot = (day, time) => {
    const filtered = visibleMeetings.filter(meeting => {
      if (!meeting.start) return false;
      
      try {
        const meetingStart = parseISO(meeting.start);
        const [slotHour] = time.split(':').map(Number);
        
        // Use UTC methods to avoid timezone conversion issues
        const meetingDay = new Date(Date.UTC(
          meetingStart.getUTCFullYear(),
          meetingStart.getUTCMonth(),
          meetingStart.getUTCDate()
        ));
        
        const slotDay = new Date(Date.UTC(
          day.getFullYear(),
          day.getMonth(),
          day.getDate()
        ));
        
        const sameDay = meetingDay.getTime() === slotDay.getTime();
        const sameHour = meetingStart.getUTCHours() === slotHour; // Use UTC hours
        
        // Debug log for the first slot check
        if (visibleMeetings.indexOf(meeting) === 0 && time === '08:00' && day.getDay() === 0) {
          console.log('🔎 Checking first meeting:', {
            meetingDateUTC: format(meetingStart, 'yyyy-MM-dd') + ' ' + meetingStart.getUTCHours() + ':00 UTC',
            slotDate: format(day, 'yyyy-MM-dd'),
            slotHour,
            meetingHourUTC: meetingStart.getUTCHours(),
            sameDay,
            sameHour,
            match: sameDay && sameHour
          });
        }
        
        return sameDay && sameHour;
      } catch (error) {
        console.error('❌ Error parsing meeting date:', meeting.start, error);
        return false;
      }
    });
    
    return filtered;
  };

  const isToday = (date) => isSameDay(date, new Date());

  // Debug: Log meetings when component renders
  useEffect(() => {
    if (visibleMeetings.length > 0) {
      console.log(`📋 ${view} meetings:`, visibleMeetings.length, visibleMeetings);
    }
  }, [visibleMeetings, view]);

  if (loading) {
    return (
      <div className="weekly-calendar-loading">
        <div className="spinner"></div>
        <p>Loading your schedule...</p>
      </div>
    );
  }

  return (
    <div className="weekly-calendar">
      <div className="calendar-header">
        <div className="calendar-controls">
          <div className="view-toggle">
            <button 
              onClick={() => {
                if (view !== 'day') setPreviousView(view);
                setView('day');
              }} 
              className={`view-btn ${view === 'day' ? 'active' : ''}`}
            >
              Day
            </button>
            <button 
              onClick={() => {
                if (view !== 'week') setPreviousView(view);
                setView('week');
              }} 
              className={`view-btn ${view === 'week' ? 'active' : ''}`}
            >
              Week
            </button>
            <button 
              onClick={() => {
                if (view !== 'month') setPreviousView(view);
                setView('month');
              }} 
              className={`view-btn ${view === 'month' ? 'active' : ''}`}
            >
              Month
            </button>
          </div>
          
          <div className="calendar-navigation">
            <button onClick={goToPrevious} className="nav-btn">
              ← Previous
            </button>
            <button onClick={goToToday} className="nav-btn current">
              Today
            </button>
            <button onClick={goToNext} className="nav-btn">
              Next →
            </button>
          </div>
        </div>
        
        <div className="week-range">
          {getViewLabel()}
          {view === 'day' && (
            <div className="day-view-hint">
              <span className="hint-icon">💡</span> Double-click the day header to return to {previousView} view
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="calendar-notice error">
          <strong>⚠️ Unable to load meetings</strong>
          <p>{error}</p>
          <p className="help-text">
            Make sure your backend has a <code>GET /api/meetings/my-meetings</code> route that returns all meetings for the authenticated SAM.
          </p>
        </div>
      )}

      <div className="calendar-grid-container">
        {view === 'month' ? (
          <div className="month-view">
            <div className="month-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="month-day-header">{day}</div>
              ))}
              {displayDates.map((day, index) => {
                // Handle empty cells (days before month starts)
                if (day === null) {
                  return (
                    <div key={`empty-${index}`} className="month-day-cell empty">
                    </div>
                  );
                }
                
                const dayMeetings = visibleMeetings.filter(meeting => {
                  try {
                    const meetingDate = parseISO(meeting.start);
                    return isSameDay(meetingDate, day);
                  } catch {
                    return false;
                  }
                });
                
                return (
                  <div 
                    key={day.toISOString()} 
                    className={`month-day-cell ${isToday(day) ? 'today' : ''}`}
                    onDoubleClick={() => handleDayDoubleClick(day)}
                    title="Double-click to view day"
                  >
                    <div className="month-day-number">{format(day, 'd')}</div>
                    {dayMeetings.length > 0 && (
                      <div className="month-meetings-count">
                        {dayMeetings.length} {dayMeetings.length === 1 ? 'meeting' : 'meetings'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="calendar-grid" style={{
            gridTemplateColumns: `80px repeat(${displayDates.length}, 1fr)`
          }}>
            {/* Time column */}
            <div className="time-column">
              <div className="day-header-cell"></div>
              {timeSlots.map(time => (
                <div key={time} className="time-cell">
                  {time}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {displayDates.map((day, idx) => (
            <div key={day.toISOString()} className="day-column">
              <div 
                className={`day-header-cell ${isToday(day) ? 'today' : ''}`}
                onDoubleClick={() => {
                  if (view === 'week') {
                    handleDayDoubleClick(day);
                  } else if (view === 'day') {
                    handleDayViewDoubleClick();
                  }
                }}
                title={view === 'week' ? 'Double-click to view day' : view === 'day' ? `Double-click to return to ${previousView} view` : ''}
                style={{ cursor: view === 'day' || view === 'week' ? 'pointer' : 'default' }}
              >
                <div className="day-name">{format(day, 'EEE')}</div>
                <div className="day-date">{format(day, 'd')}</div>
              </div>
              
              {timeSlots.map(time => {
                const slotMeetings = getMeetingsForSlot(day, time);
                const hasMeetings = slotMeetings.length > 0;

                return (
                  <div
                    key={`${day}-${time}`}
                    className={`time-cell ${hasMeetings ? 'has-meeting' : ''}`}
                  >
                    {slotMeetings.map(meeting => {
                      // Calculate meeting duration in minutes
                      const startTime = parseISO(meeting.start);
                      const endTime = parseISO(meeting.end);
                      const durationMinutes = (endTime - startTime) / (1000 * 60);
                      
                      // Each hour slot is 80px on desktop, 60px on mobile (<768px)
                      const slotHeightPx = window.innerWidth < 768 ? 60 : 80;
                      const cardHeight = (durationMinutes / 60) * slotHeightPx;
                      
                      return (
                        <div 
                          key={meeting.id} 
                          className="meeting-card"
                          style={{ height: `${cardHeight}px` }}
                          onDoubleClick={() => setSelectedMeeting(meeting)}
                          title="Double-click to view details"
                        >
                          <div className="meeting-time">
                            {formatTime(meeting.start)} - {formatTime(meeting.end)}
                          </div>
                          <div className="meeting-lead">
                            <strong>{meeting.leadName || 'Unknown'}</strong>
                          </div>
                          <div className="meeting-contact">
                            📧 {meeting.leadEmail || 'N/A'}
                          </div>
                          {meeting.leadPhone && (
                            <div className="meeting-contact">
                              📱 {meeting.leadPhone}
                            </div>
                          )}
                          {meeting.notes && (
                            <div className="meeting-notes">
                              📝 {meeting.notes}
                            </div>
                          )}
                          <div className={`meeting-status status-${meeting.status || 'pending'}`}>
                            {meeting.status || 'pending'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              </div>
            ))}
          </div>
        )}
      </div>

      {!error && visibleMeetings.length === 0 && (
        <div className="calendar-notice info">
          <p>📭 No meetings scheduled {view === 'day' ? 'today' : view === 'week' ? 'this week' : 'this month'}</p>
          <p>Meetings booked by leads will appear here automatically.</p>
        </div>
      )}

      {!error && visibleMeetings.length > 0 && (
        <div className="calendar-summary">
          <div className="summary-stat">
            <span className="stat-number">{visibleMeetings.length}</span>
            <span className="stat-label">{view === 'day' ? 'Today' : view === 'week' ? 'This Week' : 'This Month'}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-number">{visibleMeetings.filter(m => m.status === 'confirmed').length}</span>
            <span className="stat-label">Confirmed</span>
          </div>
          <div className="summary-stat">
            <span className="stat-number">{allMeetings.filter(m => {
              try {
                return isSameDay(parseISO(m.start), new Date());
              } catch {
                return false;
              }
            }).length}</span>
            <span className="stat-label">Today</span>
          </div>
          <div className="summary-stat">
            <span className="stat-number">{allMeetings.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      )}

      {/* Meeting Details Modal */}
      {selectedMeeting && (
        <div className="meeting-modal-overlay" onClick={() => setSelectedMeeting(null)}>
          <div className="meeting-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Meeting Details</h2>
              <button className="modal-close" onClick={() => setSelectedMeeting(null)}>
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-section">
                <div className="modal-icon">👤</div>
                <div className="modal-info">
                  <div className="modal-label">Client Name</div>
                  <div className="modal-value">{selectedMeeting.leadName || 'Not provided'}</div>
                </div>
              </div>

              <div className="modal-section">
                <div className="modal-icon">📧</div>
                <div className="modal-info">
                  <div className="modal-label">Email</div>
                  <div className="modal-value">{selectedMeeting.leadEmail || 'Not provided'}</div>
                </div>
              </div>

              {selectedMeeting.leadPhone && (
                <div className="modal-section">
                  <div className="modal-icon">📱</div>
                  <div className="modal-info">
                    <div className="modal-label">Phone Number</div>
                    <div className="modal-value">{selectedMeeting.leadPhone}</div>
                  </div>
                </div>
              )}

              <div className="modal-section">
                <div className="modal-icon">📅</div>
                <div className="modal-info">
                  <div className="modal-label">Date</div>
                  <div className="modal-value">
                    {format(parseISO(selectedMeeting.start), 'EEEE, MMMM d, yyyy')}
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <div className="modal-icon">🕒</div>
                <div className="modal-info">
                  <div className="modal-label">Time</div>
                  <div className="modal-value">
                    {formatTime(selectedMeeting.start)} - {formatTime(selectedMeeting.end)}
                  </div>
                </div>
              </div>

              {selectedMeeting.notes && (
                <div className="modal-section">
                  <div className="modal-icon">📝</div>
                  <div className="modal-info">
                    <div className="modal-label">Notes</div>
                    <div className="modal-value">{selectedMeeting.notes}</div>
                  </div>
                </div>
              )}

              <div className="modal-section">
                <div className="modal-icon">📊</div>
                <div className="modal-info">
                  <div className="modal-label">Status</div>
                  <div className={`modal-status status-${selectedMeeting.status || 'pending'}`}>
                    {selectedMeeting.status || 'pending'}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-button" onClick={() => setSelectedMeeting(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeeklyCalendar;

