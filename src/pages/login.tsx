import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { supabase } from '~/services/supabase';
import CircularProgress from '@mui/material/CircularProgress';
import { NextPage } from 'next';
import { useSnackbar } from 'notistack';
import Head from 'next/head';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      ©{' '}
      {new Date().getFullYear()}
      {' '}- Desenvolvido por{' '}
      <Link color="inherit" href="mailto:contato@bazzi.solutions" underline="none">
        Bazzi Solutions
      </Link>
      .
    </Typography>
  );
}

const Login: NextPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    if (supabase.auth.session()) {
      window.location.href = '/';
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLoading(true);
      const { user, session, error } = await supabase.auth.signIn({
        email,
        password,
      });

      if (error) {
        enqueueSnackbar(error.message, {
          variant: 'warning',
        })
      }

      if (session) {
        window.location.href = '/';
      }
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Head>
        <title>Login - Promoção Pé Frio</title>
      </Head>
      <CssBaseline />
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src="logo.png" alt="Mercurius" width="300" />

        <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
          3ª Promoção - Pé Frio
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, textTransform: 'none' }}
            disabled={loading}
          >
            Entrar
          </Button>
          {loading && <Stack alignItems="center"><CircularProgress color="success" /></Stack>}
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
