/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./nuxt.config.{js,ts}"
    ],
    safelist: [
      'bg-primary',
      'bg-white',
      'bg-black',
      'bg-secondary',
      'bg-secondary-2',
      'bg-secondary-3',
      'bg-secondary-4',
      'text-primary',
      'text-secondary',
      'text-black',
      'text-white',
      'opacity-0',
      'opacity-10',
      'opacity-20',
      'opacity-30',
      'opacity-40',
      'opacity-50'
    ],
    theme: {
      extend: {
        screens: {
          xs: "400px",
          sm: "640px",
          md: "960px",
          lg: "1280px",
          xl: "1520px",
        },
        container: {
          className: 'container',
          screens: {
            sm: "1480px",
          },
          padding: {
            DEFAULT: "1rem",
          },
          center: true
        },
        colors: {
          'primary': 'rgb(var(--theme-color_primary))',
          'secondary': 'rgb(var(--theme-color_secondary))',
          'secondary-2': 'rgb(var(--theme-color_secondary_2))',
          'secondary-3': 'rgb(var(--theme-color_secondary_3))',
          'secondary-4': 'rgb(var(--theme-color_secondary_4))',
          'black': 'rgb(var(--theme-color_black))',
          'white': 'rgb(var(--theme-color_white))',
          'dark': '#1E1F22',
          'current': 'currentColor',
          'transparent': 'transparent',
        },
        fontSize: {
          xs: '0.562rem',
          sm: '0.750rem',
          base: '1rem',
          lg: '1.25rem',
          xl: '1.312rem',
          '2xl': '1.688rem',
          '2.5xl': '2.250rem',
          '3xl': '2.938rem',
          '4xl': '3.812rem',
          '5xl': '5rem',
        },
        lineHeight: {
          'headline': 'var(--theme-font_headlines_line_height)',
          'body': 'var(--theme-font_paragraph_line_height)',
        },
        fontFamily: {
          'headline': 'var(--theme-font_headlines_font_family)',
          'body': 'var(--theme-font_paragraph_font_family)'
        },
        fontWeight: {
          extraBold: 800,
          bold: 'var(--theme-font_bold_weight)',
          medium: 500,
          normal: 'var(--theme-font_regular_weight)',
          'headline-weight': 'var(--theme-font_headlines_font_weight)',
          'body-weight': 'var(--theme-font_paragraph_font_weight)',
        },
        padding: {
          '7.5': '1.875rem',
          '15': '3.75rem',
        },
        transitionProperty: {
          'transform-bg-color': 'transform, background-color',
        }
      }
    },
    plugins: [
    //   require('tailwindcss-animated'),
      function ({ addVariant }) {
        addVariant('child', '& > *');
      }
    ],
  }
  