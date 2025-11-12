import type { Config } from 'tailwindcss'
 
export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './app.vue',
    './node_modules/@nuxt/ui/**/*.{js,vue,ts}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#003D7A',
          50: '#E6EEF8',
          100: '#C1D4F0',
          200: '#94B7E2',
          300: '#669AD4',
          400: '#3F7EC6',
          500: '#1C62B4',
          600: '#0F4D99',
          700: '#003D7A',
          800: '#002F5C',
          900: '#002140',
          950: '#00142B'
        },
        // Black for text and graphics
        ink: {
          DEFAULT: '#000000',
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          900: '#1A1A1A',
          950: '#000000'
        }
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem'
      },
      keyframes: {
        'pulse-scale': {
          '0%, 100%': { transform: 'scale(0.95)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' }
        },
        'cutlery-sway': {
          '0%, 100%': { transform: 'rotate(-8deg)' },
          '50%': { transform: 'rotate(8deg)' }
        },
        'dot-bounce': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.5' },
          '50%': { transform: 'translateY(-0.4rem)', opacity: '1' }
        },
        'progress-bar': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(150%)' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(0.4rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        'pulse-scale': 'pulse-scale 1.4s ease-in-out infinite',
        'cutlery-sway': 'cutlery-sway 1.8s ease-in-out infinite',
        'dot-bounce': 'dot-bounce 1.2s ease-in-out infinite',
        'progress-bar': 'progress-bar 1.6s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out both',
        'fade-in': 'fade-in 0.3s ease-out both'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
 