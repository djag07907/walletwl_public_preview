// Application Constants

// Common String Constants
export const emptyString = "";
export const spaceString = " ";

// Path Constants
export const PATHS = {
  IMAGES: "assets/images/",
  ICONS: "assets/icons/",
  FONTS: "assets/fonts/",
};

// Localization Constants
export const LOCALES = {
  ENGLISH: "en-US",
  SPANISH: "es-ES",
  FRENCH: "fr-FR",
  GERMAN: "de-DE",
};

export const LANGUAGE_LABELS = {
  EN: "EN",
  ES: "ES",
} as const;

// Application Configuration
export const APP_CONFIG = {
  NAME: "Angular Template",
  VERSION: "1.0.0",
  DEFAULT_LOCALE: LOCALES.ENGLISH,
  SESSION_TIMEOUT: 5 * 60 * 1000, // 5 minutes in milliseconds
  DEBOUNCE_TIME: 300, // Default debounce time for search inputs
  PAGINATION_SIZE: 10, // Default items per page
};

export const APP_NAME_PREFIX = "WalletWL v";
export const APP_VERSION = "0.1.0";

// Numeric Constants
export const NUMERIC = {
  ZERO: 0,
  ONE: 1,
  NEGATIVE_ONE: -1,
  MIN_DESKTOP_WIDTH: 768,
  MIN_TABLET_WIDTH: 576,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  MAX_USERNAME_LENGTH: 50,
  MIN_PASSWORD_LENGTH: 6,
};

// Validation Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  LETTERS_ONLY: /^[a-zA-Z]+$/,
  NUMBERS_ONLY: /^[0-9]+$/,
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  AUTH_TOKEN_TIMESTAMP: "auth_token_timestamp",
  USER_NAME: "user_name",
  USER_PREFERENCES: "user_preferences",
  THEME: "theme",
  LANGUAGE: "language",
};

// Theme Constants
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto",
};

// Common Symbols
export const SYMBOLS = {
  ASTERISK: "*",
  HASH: "#",
  AT: "@",
  DOLLAR: "$",
  PERCENT: "%",
  AMPERSAND: "&",
  PLUS: "+",
  MINUS: "-",
  EQUALS: "=",
  UNDERSCORE: "_",
} as const;
