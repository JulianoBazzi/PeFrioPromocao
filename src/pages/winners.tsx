import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import NumberFormat from 'react-number-format';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { CircularProgress, Hidden, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { supabase } from '~/services/supabase';
import Layout from '~/layout/Layout';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export default function Winners() {
  const [id, setId] = React.useState(0);
  const [winner1, setWinner1] = React.useState(0);
  const [winner2, setWinner2] = React.useState(0);
  const [winner3, setWinner3] = React.useState(0);
  const [winner4, setWinner4] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [isFetch, setIsFetch] = React.useState(false);

  React.useEffect(() => {
    if (!supabase.auth.session()) {
      window.location.href = '/login';
    }

    getData();
  }, []);

  const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
    props: CustomProps,
    ref
  ) {
    const { onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator={false}
        isNumericString
        decimalScale={0}
        prefix=""
      />
    );
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (winner1 === undefined || isNaN(winner1) || (winner1 < 1 || winner1 > 6000)) {
      enqueueSnackbar('Por favor informe um número válido', {
        variant: 'warning',
      });

      return;
    }

    if (winner2 === undefined || isNaN(winner2) || (winner2 < 1 || winner2 > 6000)) {
      enqueueSnackbar('Por favor informe um número válido', {
        variant: 'warning',
      });

      return;
    }

    if (winner3 === undefined || isNaN(winner3) || (winner3 < 1 || winner3 > 6000)) {
      enqueueSnackbar('Por favor informe um número válido', {
        variant: 'warning',
      });

      return;
    }

    if (winner4 === undefined || isNaN(winner4) || (winner4 < 1 || winner4 > 6000)) {
      enqueueSnackbar('Por favor informe um número válido', {
        variant: 'warning',
      });

      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('winners')
        .upsert({ id: id, winner1: winner1, winner2: winner2, winner3: winner3, winner4: winner4 })

      if (error) {
        enqueueSnackbar(error.message, {
          variant: 'warning',
        });
      }
    }
    finally {
      setLoading(false);
    }
  }

  async function getData() {
    setIsFetch(true);
    try {
      const { error, data } = await supabase
        .from('winners')
        .select('id, winner1, winner2, winner3, winner4')
        .single();

      if (error) {
        enqueueSnackbar(error.message, {
          variant: 'warning',
        })
      }

      if (data) {
        setId(data.id);
        setWinner1(data.winner1);
        setWinner2(data.winner2);
        setWinner3(data.winner3);
        setWinner4(data.winner4);
      }
    } finally {
      setIsFetch(false);
    }
  }

  return (
    <Layout>
      <CssBaseline />
      <Box
        sx={{
          my: 8,
          mx: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Informar Ganhadores
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Stack direction="row">
            <TextField
              margin="normal"
              required
              fullWidth
              id="winner1"
              label="1º Moto"
              name="winner1"
              autoComplete="off"
              value={winner1}
              onChange={(e) => setWinner1(parseInt(e.target.value))}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
              }}
              disabled={loading}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="winner2"
              label="2º Moto"
              name="winner2"
              sx={{ ml: 2 }}
              autoComplete="off"
              value={winner2}
              onChange={(e) => setWinner2(parseInt(e.target.value))}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
              }}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="winner3"
              label="3º Moto"
              name="winner3"
              sx={{ ml: 2 }}
              autoComplete="off"
              value={winner3}
              onChange={(e) => setWinner3(parseInt(e.target.value))}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
              }}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="winner4"
              label="Carro"
              name="winner4"
              sx={{ ml: 2 }}
              autoComplete="off"
              value={winner4}
              onChange={(e) => setWinner4(parseInt(e.target.value))}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
              }}
              disabled={loading}
            />
          </Stack>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, textTransform: 'none' }}
            disabled={loading}
          >
            Enviar
          </Button>
          {loading && <Stack alignItems="center"><CircularProgress color="success" /></Stack>}
        </Box>
      </Box>

      <Hidden mdDown smDown>
        <Grid container sx={{ mt: 5 }}>
          <Grid item md={6}>
            <Box
              sx={{
                mt: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img src="logo.png" alt="Mercurius" width="400" />
            </Box>
          </Grid>
          <Grid item md={6}>
            <Box
              sx={{
                mt: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img src="app-logo.webp" alt="Mercurius" width="400" />
            </Box>
          </Grid>
        </Grid>
      </Hidden>
    </Layout >
  );
}
