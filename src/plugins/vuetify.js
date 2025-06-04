import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          // Primary colors
          primary: '#3DA9FC',
          secondary: '#F48C8C',
          'on-primary': '#F8F8F8',
          'on-secondary': '#F8F8F8',
          
          // Text colors
          'text-primary': '#212121',
          'text-light': '#F8F8F8',
          
          // State colors
          success: '#4CB5AE',
          warning: '#F9C74F',
          info: '#3DA9FC',
          disabled: '#7A7A7A',
          
          // Background colors
          background: '#F8F8F8',
          'background-accent': '#EAF6FE',
          'background-coral': '#F48C8C',
          
          // Surface colors
          surface: '#F8F8F8',
          'surface-variant': '#EAF6FE',
        },
        variables: {
          // Border and outline colors
          'border-color': '#212121',
          'outline-width': '2px',
          
          // Button specific
          'button-text-transform': 'none',
          'button-font-weight': 500,
          'button-elevation': 0,
          'button-border-radius': '8px',
          
          // Card specific
          'card-border-radius': '12px',
          'card-elevation': 1,
        },
      }
    }
  }
}) 