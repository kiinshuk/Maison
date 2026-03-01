/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: '#faf8f5',
        sand:  '#f2ede6',
        mink:  '#e8e0d5',
        taupe: '#c4b8a8',
        mocha:'#8c7b6b',
        espresso: '#3d2f25',
        charcoal: '#1a1a1a',
        gold: '#b8965a',
      },
      fontFamily: {
        sans: ['Jost', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.35em',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        fadeIn: 'fadeIn 0.4s ease forwards',
        slideInLeft: 'slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        scaleIn: 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 1.8s infinite linear',
      },
    },
  },
  plugins: [],
}
