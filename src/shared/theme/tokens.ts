/**
 * Design System Tokens
 *
 * Centralized design tokens following UX Architect best practices.
 * These tokens should be used throughout the application for consistency.
 */

export const tokens = {
  // Color Palette
  colors: {
    primary: {
      main: 'hsl(238.7, 83.5%, 66.7%)',
      light: 'hsl(238.7, 83.5%, 76.7%)',
      dark: 'hsl(238.7, 83.5%, 56.7%)',
      foreground: 'hsl(210, 40%, 98%)',
    },
    secondary: {
      main: 'hsl(220, 14.3%, 95.9%)',
      light: 'hsl(220, 14.3%, 98%)',
      dark: 'hsl(220, 14.3%, 85%)',
      foreground: 'hsl(222.2, 47.4%, 11.2%)',
    },
    success: {
      main: 'hsl(142, 76%, 36%)',
      light: 'hsl(142, 76%, 46%)',
      dark: 'hsl(142, 76%, 26%)',
      foreground: 'hsl(210, 40%, 98%)',
    },
    warning: {
      main: 'hsl(38, 92%, 50%)',
      light: 'hsl(38, 92%, 60%)',
      dark: 'hsl(38, 92%, 40%)',
      foreground: 'hsl(222.2, 84%, 4.9%)',
    },
    danger: {
      main: 'hsl(0, 84.2%, 60.2%)',
      light: 'hsl(0, 84.2%, 70.2%)',
      dark: 'hsl(0, 84.2%, 50.2%)',
      foreground: 'hsl(210, 40%, 98%)',
    },
    gray: {
      50: 'hsl(210, 40%, 98%)',
      100: 'hsl(220, 14.3%, 95.9%)',
      200: 'hsl(214.3, 31.8%, 91.4%)',
      300: 'hsl(215, 20.2%, 65.1%)',
      400: 'hsl(215.4, 16.3%, 46.9%)',
      500: 'hsl(215, 19%, 35%)',
      600: 'hsl(215, 25%, 27%)',
      700: 'hsl(215, 28%, 17%)',
      800: 'hsl(217.2, 32.6%, 17.5%)',
      900: 'hsl(222.2, 47.4%, 11.2%)',
      950: 'hsl(222.2, 84%, 4.9%)',
    },
    background: {
      default: 'hsl(0, 0%, 100%)',
      paper: 'hsl(0, 0%, 100%)',
      muted: 'hsl(220, 14.3%, 95.9%)',
    },
    text: {
      primary: 'hsl(222.2, 84%, 4.9%)',
      secondary: 'hsl(215.4, 16.3%, 46.9%)',
      disabled: 'hsl(215, 20.2%, 65.1%)',
    },
    // Quadrant-specific colors
    quadrant: {
      urgentImportant: {
        border: 'hsl(0, 70%, 85%)',
        background: 'hsl(0, 70%, 97%)',
        header: 'hsl(0, 70%, 90%)',
        text: 'hsl(0, 70%, 20%)',
        accent: 'hsl(0, 84.2%, 60.2%)',
      },
      urgentNotImportant: {
        border: 'hsl(25, 95%, 85%)',
        background: 'hsl(25, 95%, 97%)',
        header: 'hsl(25, 95%, 90%)',
        text: 'hsl(25, 95%, 20%)',
        accent: 'hsl(38, 92%, 50%)',
      },
      notUrgentImportant: {
        border: 'hsl(217, 91%, 85%)',
        background: 'hsl(217, 91%, 97%)',
        header: 'hsl(217, 91%, 90%)',
        text: 'hsl(217, 91%, 20%)',
        accent: 'hsl(238.7, 83.5%, 66.7%)',
      },
      notUrgentNotImportant: {
        border: 'hsl(142, 76%, 85%)',
        background: 'hsl(142, 76%, 97%)',
        header: 'hsl(142, 76%, 90%)',
        text: 'hsl(142, 76%, 20%)',
        accent: 'hsl(142, 76%, 36%)',
      },
    },
  },

  // Typography Scale
  typography: {
    headingXL: {
      size: '2rem', // 32px
      weight: '700',
      lineHeight: '2.5rem',
    },
    headingL: {
      size: '1.5rem', // 24px
      weight: '700',
      lineHeight: '2rem',
    },
    headingM: {
      size: '1.25rem', // 20px
      weight: '600',
      lineHeight: '1.75rem',
    },
    headingS: {
      size: '1.125rem', // 18px
      weight: '600',
      lineHeight: '1.5rem',
    },
    body: {
      size: '1rem', // 16px
      weight: '400',
      lineHeight: '1.5rem',
    },
    bodySmall: {
      size: '0.875rem', // 14px
      weight: '400',
      lineHeight: '1.25rem',
    },
    caption: {
      size: '0.75rem', // 12px
      weight: '400',
      lineHeight: '1rem',
    },
    button: {
      size: '0.875rem', // 14px
      weight: '500',
      lineHeight: '1.25rem',
    },
  },

  // Spacing Scale (in pixels)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
    xxxxl: 64,
  },

  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    pill: 9999,
    circle: '50%',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    none: 'none',
  },

  // Z-Index Scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Breakpoints (for responsive design)
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type Tokens = typeof tokens;
