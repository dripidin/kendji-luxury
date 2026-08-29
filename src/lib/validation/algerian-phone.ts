/**
 * Algerian Phone Number Validation & Normalization
 * 
 * Validates mobile operators in Algeria:
 * - Ooredoo: 05 XX XX XX XX
 * - Mobilis: 06 XX XX XX XX
 * - Djezzy:  07 XX XX XX XX
 */

export interface PhoneValidationResult {
  isValid: boolean;
  normalized?: string;
  formatted?: string;
  error?: string;
}

export function validateAndNormalizeAlgerianPhone(input: string): PhoneValidationResult {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: "Le numéro de téléphone est requis." };
  }

  // Remove all non-digit characters except leading +
  const cleaned = input.trim().replace(/[^\d+]/g, '');

  let nationalNumber = '';

  if (cleaned.startsWith('+213')) {
    nationalNumber = cleaned.slice(4);
  } else if (cleaned.startsWith('00213')) {
    nationalNumber = cleaned.slice(5);
  } else if (cleaned.startsWith('213')) {
    nationalNumber = cleaned.slice(3);
  } else if (cleaned.startsWith('0')) {
    nationalNumber = cleaned.slice(1);
  } else {
    nationalNumber = cleaned;
  }

  // Must be exactly 9 digits starting with 5, 6, or 7
  const algerianMobileRegex = /^[567]\d{8}$/;

  if (!algerianMobileRegex.test(nationalNumber)) {
    return {
      isValid: false,
      error: "Veuillez saisir un numéro de mobile algérien valide (ex: 0550 12 34 56, 0661..., 0770...)."
    };
  }

  const normalized = `0${nationalNumber}`;
  const formatted = `0${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3, 5)} ${nationalNumber.slice(5, 7)} ${nationalNumber.slice(7, 9)}`;

  return {
    isValid: true,
    normalized,
    formatted
  };
}
