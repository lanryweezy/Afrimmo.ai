// Validation utilities for the application

// Sanitizes user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remove script tags and other potentially dangerous content
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

// Validates email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validates phone number format (for African numbers)
export const validatePhoneNumber = (phone: string): boolean => {
  // Allow various African phone number formats
  const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  return phoneRegex.test(phone);
};

// Validates property price format
export const validatePrice = (price: string): boolean => {
  // Allow various price formats (e.g., ₦450,000,000, $500,000, etc.)
  const priceRegex = /^[₦$€£¥₹]?\s?\d{1,3}(,\d{3})*(\.\d{2})?$/;
  return priceRegex.test(price);
};

// Validates property address
export const validateAddress = (address: string): boolean => {
  // Basic validation: not empty and not just whitespace
  return address.trim().length > 0;
};

// Validates property size (in sqm or sqft)
export const validateSize = (size: string): boolean => {
  const sizeNum = parseFloat(size);
  return !isNaN(sizeNum) && sizeNum > 0;
};

// Validates property dimensions (beds/baths)
export const validateDimension = (dimension: string): boolean => {
  const dimNum = parseInt(dimension, 10);
  return !isNaN(dimNum) && dimNum >= 0;
};

// Validates URL format
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validates property amenities (array of strings)
export const validateAmenities = (amenities: string[]): boolean => {
  return Array.isArray(amenities) && amenities.every(amenity => 
    typeof amenity === 'string' && amenity.trim().length > 0
  );
};

// Validates lead name
export const validateLeadName = (name: string): boolean => {
  // At least 2 characters, only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-'\.]{2,50}$/;
  return nameRegex.test(name.trim());
};

// Validates property status
export const validatePropertyStatus = (status: string): boolean => {
  const validStatuses = ['Available', 'Under Offer', 'Sold'];
  return validStatuses.includes(status);
};

// Validates lead status
export const validateLeadStatus = (status: string): boolean => {
  const validStatuses = ['New', 'Contacted', 'Viewing', 'Offer', 'Closed', 'Nurturing'];
  return validStatuses.includes(status);
};

// Validates lead source
export const validateLeadSource = (source: string): boolean => {
  const validSources = ['WhatsApp', 'Instagram', 'Manual'];
  return validSources.includes(source);
};

// Generic validator function
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateForm = (data: Record<string, any>, rules: Record<string, (value: any) => boolean>): ValidationResult => {
  const errors: string[] = [];
  
  for (const [field, validator] of Object.entries(rules)) {
    const value = data[field];
    
    if (!validator(value)) {
      errors.push(`${field} is invalid`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};