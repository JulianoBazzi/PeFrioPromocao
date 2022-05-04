import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

function Footer() {
  const isDisplayed = false

  return (
    <footer>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: '#fff',
          display: isDisplayed ? 'none' : 'flex',
          p: 2
        }}
      >
        <Container>
          <Grid container>
            <Grid item xs={12}>
              <Typography align='center' variant='body2'>
                &copy; Copyright 2022, Desenvolvido por Bazzi Solutions
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </footer>
  )
}

export default Footer
