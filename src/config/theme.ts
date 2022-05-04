import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// Create a theme instance.
const theme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5'
    },
    primary: {
      light: '#9cc9a7',
      main: '#2f5638',
      dark: '#1b3120'
    }
  }
})

export default theme
