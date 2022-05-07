import * as React from 'react';
import Head from 'next/head'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import NumberFormat from 'react-number-format';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {
  DataGrid,
  GridColumns,
  GridActionsCellItem,
  ptBR,
} from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { CircularProgress, Container, Hidden, IconButton, Stack, Tooltip } from '@mui/material';
import { useSnackbar } from 'notistack';
import { supabase } from '~/services/supabase';
import INumbers from '~/models/INumbers';
import Layout from '~/layout/Layout';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export default function Number() {
  const [numberInfo, setNumberInfo] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [isFetch, setIsFetch] = React.useState(false);
  const [dataX, setDataX] = React.useState<INumbers[]>([]);

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
        thousandSeparator
        isNumericString
        decimalScale={0}
        prefix=""
      />
    );
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log(numberInfo);
    if (numberInfo === undefined || isNaN(numberInfo)) {
      enqueueSnackbar('Por favor informe um número válido', {
        variant: 'warning',
      });

      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('drawn_numbers')
        .insert({ number: numberInfo })

      if (error) {
        enqueueSnackbar(error.message, {
          variant: 'warning',
        });
      }

      if (data) {
        setNumberInfo(0);
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
        .from('drawn_numbers')
        .select('id, number')
        .order('number', { ascending: true });

      if (error) {
        enqueueSnackbar(error.message, {
          variant: 'warning',
        })
      }

      if (data) {
        setDataX(data);
      }
    } finally {
      setIsFetch(false);
    }
  }

  async function deleteData(id: number) {
    const { data, error, status } = await supabase
      .from('drawn_numbers')
      .delete()
      .match({ id: id })

    if (error) {
      enqueueSnackbar(error.message, {
        variant: 'warning',
      })
    } else {
      const updateTable = [...dataX];
      const index = updateTable.findIndex(x => x.id === id);
      updateTable.splice(index, 1);
      setDataX(updateTable);
    }
  }

  const columns: GridColumns = [
    { field: 'number', headerName: 'Número', flex: 1, editable: false, filterable: true },
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem icon={<DeleteIcon />} onClick={async () => await deleteData(params.id)} label="Excluir" />,
      ],
    },
  ]

  return (
    <Layout>
      <Head>
        <title>Promoção Pé Frio</title>
      </Head>
      <main>
        <Grid container component="main" sx={{ height: '94.5vh' }}>
          <CssBaseline />
          <Grid item xs={12} sm={8} md={7} component={Paper} elevation={6} square>
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
                Informar Número
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="number"
                  label="Número"
                  name="number"
                  autoComplete="off"
                  value={numberInfo}
                  onChange={(e) => setNumberInfo(parseInt(e.target.value))}
                  InputProps={{
                    inputComponent: NumberFormatCustom as any,
                  }}
                  disabled={loading}
                  autoFocus
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, textTransform: 'none' }}
                  disabled={loading}
                >
                  Cadastrar
                </Button>
                {loading && <Stack alignItems="center"><CircularProgress color="success" /></Stack>}
              </Box>
            </Box>

            <Hidden mdDown smDown>
              <Grid container sx={{ mt: 20 }}>
                <Grid item md={6}>
                  <Box
                    sx={{
                      mt: 6,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <img src="logo.png" alt="Mercurius" width="300" />
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
                    <img src="app-logo.webp" alt="Mercurius" width="300" />
                  </Box>
                </Grid>
              </Grid>
            </Hidden>
          </Grid>
          <Grid
            item
            xs={false}
            sm={4}
            md={5}
          >
            <Stack sx={{ p: 2 }}>
              <Stack direction="row" spacing={2}>
                <Typography component="h1" variant="h5">
                  Números Cadastrados
                </Typography>

                <Tooltip title="Atualizar" placement="top-end">
                  <IconButton
                    size="small"
                    aria-label="refresh data"
                    onClick={async () => await getData()}
                  >
                    <AutorenewIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

              <div style={{ height: 550, width: '100%' }}>
                <DataGrid
                  localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                  autoPageSize
                  disableSelectionOnClick
                  loading={isFetch}
                  rows={dataX}
                  columns={columns}
                />
              </div>
            </Stack>
          </Grid>
        </Grid>
      </main>
    </Layout >
  );
}
