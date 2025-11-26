'use client';

import { ReactNode } from 'react';
import { ThemeProvider, type ThemeProviderProps } from '@material-tailwind/react';
import theme from '@material-tailwind/react/theme';

theme.rating.defaultProps.ratedIcon = null;
theme.rating.defaultProps.unratedIcon = null;

const adwizTheme: ThemeProviderProps['value'] = {
  colors: {
    primary: {
      light: '#6EE7B7',
      DEFAULT: '#10B981',
      dark: '#059669',
    },
    secondary: {
      light: '#7DD3FC',
      DEFAULT: '#38BDF8',
      dark: '#0EA5E9',
    },
    slate: {
      50: '#F8FAFC',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
      950: '#020617',
    },
    emerald: {
      50: '#ECFDF5',
      200: '#A7F3D0',
      400: '#34D399',
      500: '#10B981',
      600: '#059669',
    },
    sky: {
      400: '#38BDF8',
      500: '#0EA5E9',
    },
    purple: {
      400: '#A78BFA',
      600: '#7C3AED',
    },
  },

  // ======= COMPONENT-SPECIFIC OVERRIDES =======

  // Fix known recursion issue with Rating default icons
  rating: {
    defaultProps: {
      ratedIcon: null,
      unratedIcon: null,
    },
  },

  button: {
    defaultProps: {
      color: 'teal',
      size: 'md',
      variant: 'filled',
      fullWidth: false,
      ripple: true,
    },
    styles: {
      base: {
        initial: {
          className: 'font-medium normal-case rounded-lg focus:outline-none focus:ring-0 p-2',
        },
      },
    },
  },

  card: {
    defaultProps: {
      color: 'transparent',
      shadow: false,
      floated: false,
      className:
        'border border-slate-800/70 bg-slate-950/60 backdrop-blur-xl shadow-xl shadow-black/30 p-4',
    },
  },

  navbar: {
    defaultProps: {
      blurred: true,
      color: 'transparent',
      fullWidth: true,
      shadow: false,
      className: 'border-b border-slate-800/70 bg-slate-950/60 backdrop-blur-xl text-slate-50',
    },
  },

  input: {
    defaultProps: {
      color: 'teal',
      variant: 'outlined',
      size: 'md',
      crossOrigin: undefined,
      className: 'text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 p-2',
    },
  },

  tabs: {
    defaultProps: {
      className: '',
    },
    styles: {
      base: {
        header: {
          className: 'bg-slate-800/80 border border-slate-700 rounded-full p-1',
        },
        tab: {
          className:
            'text-[11px] text-slate-200 rounded-full data-[active=true]:bg-emerald-500 data-[active=true]:text-slate-950',
        },
      },
    },
  },

  typography: {
    styles: {
      variants: {
        h1: {
          className: 'text-3xl md:text-4xl font-semibold text-slate-50',
        },
        h2: {
          className: 'text-2xl md:text-3xl font-semibold text-slate-50',
        },
        h3: {
          className: 'text-xl md:text-2xl font-semibold text-slate-50',
        },
        h4: {
          className: 'text-lg md:text-xl font-semibold text-slate-50',
        },
        h5: {
          className: 'text-base font-semibold text-slate-50',
        },
        small: {
          className: 'text-xs text-slate-400',
        },
        paragraph: {
          className: 'text-sm text-slate-300',
        },
      },
    },
  },
};

export function MaterialThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeProvider value={adwizTheme}>{children}</ThemeProvider>;
}
