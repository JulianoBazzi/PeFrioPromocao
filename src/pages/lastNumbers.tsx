import { Box, CircularProgress, Grid, ImageList, ImageListItem, Typography } from '@mui/material';
import type { NextPage } from 'next';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { supabase } from '~/services/supabase';
import { useSnackbar } from 'notistack';
import INumbers from '~/models/INumbers';
import Layout from '~/layout/Layout';

const LastNumbers: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [numbers, setNumbers] = useState<INumbers[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const minute_ms = 60000;

  async function getData() {
    setIsLoading(true);
    try {
      const { error, data } = await supabase
        .from('drawn_numbers')
        .select('id, number')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        enqueueSnackbar(error.message, {
          variant: 'warning',
        })
      }

      if (data) {
        setNumbers(data);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!supabase.auth.session()) {
      window.location.href = '/login';
    }

    getData();

    const interval = setInterval(() => {
      getData();
    }, minute_ms);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Layout hideHeader hideFooter>
      {isLoading ? (
        <div style={{ margin: 0, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <Grid container sx={{ mt: 1 }}>
            <Grid item md={2}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img src="logo.png" alt="Mercurius" width="150" />
              </Box>
            </Grid>
            <Grid item md={8}>
              <Typography component="h1" variant="h4" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Últimos 20 números sorteados
              </Typography>
            </Grid>
            <Grid item md={2}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img src="app-logo.webp" alt="Mercurius" width="150" />
              </Box>
            </Grid>
          </Grid>
          <ImageList component="main" sx={{ p: 3, ml: 10 }} cols={5} rowHeight={130}>
            {numbers.map((item) => (
              <ImageListItem key={item.number}>
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 130, p: 4, border: '0.3px solid black', borderRadius: 400, ml: 5 }}>
                  <Typography variant="h3" color="text.primary" sx={{ backgroundColor: 'transparent' }}>
                    {item.number.toString().padStart(3, '0')}
                  </Typography>
                </Box>
              </ImageListItem>
            ))}
          </ImageList>
        </>
      )}
    </Layout>
  )
}

export default LastNumbers;
