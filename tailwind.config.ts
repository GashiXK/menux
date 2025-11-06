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
          // Pantone 300 - Primary Blue
          DEFAULT: '#0066CC',
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CBFF',
          300: '#66B1FF',
          400: '#3397FF',
          500: '#0066CC', // Pantone 300
          600: '#0052A3',
          700: '#003D7A',
          800: '#002952',
          900: '#001429',
          950: '#000A14'
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
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'), 
    require('@tailwindcss/typography')
  ]
}

