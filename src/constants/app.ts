/**
 * Central App Constants for "Little Sparks"
 */

export const APP_NAME = "Little Sparks";
export const APP_TAGLINE = "Play, Sing & Learn!";
export const MASCOT_NAME = "Sparky";

export const THEME_COLORS = {
  primaryYellow: "#FFC93C", // Golden Yellow
  warmOrange: "#FF9F1C",    // Warm Orange
  skyBlue: "#4DA3E8",       // Sky Blue
  softCream: "#FEF3C7",     // Soft Cream Background
  pageBg: "#FFFBEB",        // Page Warm Background
  cardBorder: "#FDE68A",    // Soft Card Border
  textDark: "#451A03",      // Deep Rich Brown Text
  emeraldGreen: "#10B981",  // Success Green
  bubblegumPink: "#F43F5E", // Cheerful Pink
  grapePurple: "#8B5CF6",   // Shape Purple
};

/**
 * Converts any number (1 to 1000+) into clear, unambiguous spoken English words
 * to guarantee that Speech Synthesis reads "sixty-seven" as one full word and never cuts off digits!
 */
export function numberToWords(num: number): string {
  if (num === 0) return 'zero';
  if (num === 100) return 'one hundred';
  if (num === 200) return 'two hundred';
  if (num === 500) return 'five hundred';
  if (num === 1000) return 'one thousand';

  const ones = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen'
  ];

  const tens = [
    '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
  ];

  if (num < 20) {
    return ones[num];
  }

  if (num < 100) {
    const tensDigit = Math.floor(num / 10);
    const onesDigit = num % 10;
    return onesDigit === 0 ? tens[tensDigit] : `${tens[tensDigit]}-${ones[onesDigit]}`;
  }

  if (num < 1000) {
    const hundredDigit = Math.floor(num / 100);
    const remainder = num % 100;
    const hundredPrefix = `${ones[hundredDigit]} hundred`;
    return remainder === 0 ? hundredPrefix : `${hundredPrefix} and ${numberToWords(remainder)}`;
  }

  return num.toString();
}
