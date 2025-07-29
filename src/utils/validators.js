// src/utils/validators.js
export const validateEmail = (email) => {
  const errors = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  const errors = [];
  
  if (!confirmPassword) {
    errors.push('Please confirm your password');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRequired = (value, fieldName) => {
  const errors = [];
  
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    errors.push(`${fieldName} is required`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateMinLength = (value, minLength, fieldName) => {
  const errors = [];
  
  if (value && value.length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} characters long`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateMaxLength = (value, maxLength, fieldName) => {
  const errors = [];
  
  if (value && value.length > maxLength) {
    errors.push(`${fieldName} must not exceed ${maxLength} characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};