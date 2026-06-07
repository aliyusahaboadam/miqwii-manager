// utils/formatters.js
export const formatPosition = (position) => {
  if (position <= 0) return String(position);
  
  const lastDigit = position % 10;
  const lastTwoDigits = position % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return position + 'th';
  }
  
  switch (lastDigit) {
    case 1: return position + 'st';
    case 2: return position + 'nd';
    case 3: return position + 'rd';
    default: return position + 'th';
  }
};