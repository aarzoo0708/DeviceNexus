// Return an error message, or an empty string when the value is valid.
export function validateText(value, label, min = 1, max = 2000) {
  const text = value.trim();
  if (!text) return `${label} is required.`;
  if (text.length < min || text.length > max) {
    return `${label} must be ${min}-${max} characters.`;
  }
  return "";
}

export function validateName(value) {
  const error = validateText(value, "Name", 2, 60);
  if (error) return error;
  // Unicode letters support names in Indian languages too.
  const namePattern = /^[\p{L}\p{M} .\u2019'-]+$/u;
  if (!namePattern.test(value.trim()) || !/\p{L}/u.test(value)) {
    return "Name can contain letters, spaces, dots, apostrophes and hyphens.";
  }
  return "";
}

export function validateEmail(value) {
  const error = validateText(value, "Email", 1, 254);
  if (error) return error;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value.trim()) ? "" : "Enter a valid email address.";
}

export function validatePhone(value) {
  // Allow normal formatting and an optional international country code.
  const phone = value.trim().replace(/[\s()-]/g, "");
  return /^\+?\d{7,15}$/.test(phone)
    ? ""
    : "Enter 7-15 digits, with an optional + country code.";
}

export function validateTime(value) {
  const timePattern = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;
  return timePattern.test(value.trim()) ? "" : "Use a valid time, e.g. 03:30 PM.";
}
