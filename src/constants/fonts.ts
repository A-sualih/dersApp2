/**
 * Custom font configurations for beautiful Amharic text
 * These fonts are optimized for Amharic characters
 */

export const AmharicFonts = {
  // Primary font for headings - Bold and elegant
  primary: {
    fontFamily: 'Nyala', // Built-in Amharic font on most devices
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  
  // Secondary font for body text - Clean and readable
  secondary: {
    fontFamily: 'Ebrima', // Another built-in Amharic font
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  
  // Display font for large titles
  display: {
    fontFamily: 'Nyala',
    fontWeight: '800' as const,
    letterSpacing: 1,
  },
  
  // Regular text font
  regular: {
    fontFamily: 'Ebrima',
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
};

// Font sizes for consistent typography
export const FontSizes = {
  title: 28,
  heading: 22,
  subheading: 18,
  body: 16,
  caption: 14,
  small: 12,
  tiny: 10,
};

// Text shadows for enhanced visibility
export const TextShadows = {
  soft: {
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  medium: {
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  strong: {
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
};
























































