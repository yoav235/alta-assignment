import { format, parse, parseISO } from 'date-fns';

// Date formatting helpers
export function formatDate(date, formatString = 'MMM dd, yyyy') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
}

export function formatTime(date, formatString = 'h:mm a') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  // Format using UTC time to match how we're displaying on calendar
  const utcHours = dateObj.getUTCHours();
  const utcMinutes = dateObj.getUTCMinutes();
  const isPM = utcHours >= 12;
  const displayHours = utcHours % 12 || 12;
  const minutesStr = utcMinutes.toString().padStart(2, '0');
  return `${displayHours}:${minutesStr} ${isPM ? 'PM' : 'AM'}`;
}

export function formatDateTime(date) {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy \'at\' h:mm a');
}

// Form validation helpers
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone) {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Check if it's a valid length (10 digits for US, can be adjusted)
  return cleaned.length >= 10;
}

export function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

// Grouping time slots by date
export function groupSlotsByDate(slots) {
  if (!slots || !Array.isArray(slots)) return {};
  
  return slots.reduce((groups, slot) => {
    const date = formatDate(slot.start);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(slot);
    return groups;
  }, {});
}

// Error message formatting
export function getErrorMessage(error) {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'An unexpected error occurred. Please try again.';
}

