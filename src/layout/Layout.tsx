import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { FC } from 'react'

import Footer from './Footer'

interface Props {
  children: React.ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const isDisplayed = true

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Toolbar
          sx={{
            display: isDisplayed ? 'none' : 'flex'
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <main>{children}</main>
        </Box>
        <Footer />
      </Box>
    </Box>
  )
}

export default Layout
