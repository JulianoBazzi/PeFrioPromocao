import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import NextLink from 'next/link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from '@mui/material';

function Footer() {
  const isDisplayed = false

  return (
    <footer>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: '#fff',
          display: isDisplayed ? 'none' : 'flex',
          p: 1
        }}
      >
        <Container>
          <Grid container>
            <Grid item xs={12}>
              <NextLink href="/" passHref>
                <Link color="#fff" title="Retornar para página principal" underline="none">
                  <Typography align='center' variant='body2'>
                    Apoio: Mercurius Plataforma de Delivery (@mercurius.delivery)
                  </Typography>
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </footer>
  )
}

export default Footer
