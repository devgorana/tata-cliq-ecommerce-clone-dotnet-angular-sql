import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        navy:    '#1A1A6B',
        red:     '#E4002B',
        blue:    '#0071C2',
        bg:      '#F5F5F5',
        card:    '#FFFFFF',
        dark:    '#212121',
        muted:   '#757575',
        gold:    '#F9A825',
        success: '#2E7D32',
      },
      screens: {
        sm:  '480px',
        md:  '768px',
        lg:  '1024px',
        xl:  '1280px',
        '2xl': '1440px',
      },
      maxWidth: {
        layout: '1440px',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
