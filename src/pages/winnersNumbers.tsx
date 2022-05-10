import { Box, CircularProgress, Grid, ImageList, ImageListItem, Stack, Typography } from '@mui/material';
import type { NextPage } from 'next';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { supabase } from '~/services/supabase';
import { useSnackbar } from 'notistack';
import IWinners from '~/models/IWinners';
import Layout from '~/layout/Layout';

const WinnersNumbers: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [winners, setWinners] = useState<IWinners>();
  const { enqueueSnackbar } = useSnackbar();

  async function getData() {
    setIsLoading(true);
    try {
      const { error, data } = await supabase
        .from('winners')
        .select('winner1, winner2, winner3, winner4')
        .single();

      if (error) {
        enqueueSnackbar(error.message, {
          variant: 'warning',
        })
      }

      if (data) {
        setWinners(data);
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

    const mySubscription = supabase
      .from('winners')
      .on('UPDATE', payload => {
        const win = payload.new;

        setWinners(win);
      }).subscribe();

    return () => { supabase.removeAllSubscriptions(); };
  }, []);

  return (
    <Layout hideHeader hideFooter>
      {isLoading ? (
        <div style={{ margin: 0, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <Grid container sx={{ mt: 3 }}>
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
                Ganhadores
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
          <ImageList component="main" sx={{ p: 3, ml: 2 }} cols={4}>
            <ImageListItem key={winners?.winner1}>
              <Stack direction="column">
                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    ml: 7,
                  }}
                >
                  <img src="yamahaFactor.jpg" alt="Yamaha Factor" width="150" />
                </Box>

                <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 250, p: 11, border: '0.3px solid black', borderRadius: 400, ml: 7 }}>
                  <Typography variant="h2" color="text.primary" sx={{ backgroundColor: 'transparent' }}>
                    {winners?.winner1.toString().padStart(3, '0')}
                  </Typography>
                </Box>
              </Stack>
            </ImageListItem>
            <ImageListItem key={winners?.winner2}>
              <Stack direction="column">
                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    ml: 7,
                  }}
                >
                  <img src="yamahaFactor.jpg" alt="Yamaha Factor" width="150" />
                </Box>

                <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 250, p: 11, border: '0.3px solid black', borderRadius: 400, ml: 7 }}>
                  <Typography variant="h2" color="text.primary" sx={{ backgroundColor: 'transparent' }}>
                    {winners?.winner2.toString().padStart(3, '0')}
                  </Typography>
                </Box>
              </Stack>
            </ImageListItem>
            <ImageListItem key={winners?.winner3}>
              <Stack direction="column">
                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    ml: 7,
                  }}
                >
                  <img src="yamahaFactor.jpg" alt="Yamaha Factor" width="150" />
                </Box>

                <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 250, p: 11, border: '0.3px solid black', borderRadius: 400, ml: 7 }}>
                  <Typography variant="h2" color="text.primary" sx={{ backgroundColor: 'transparent' }}>
                    {winners?.winner3.toString().padStart(3, '0')}
                  </Typography>
                </Box>
              </Stack>
            </ImageListItem>
            <ImageListItem key={winners?.winner4}>
              <Stack direction="column">
                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    ml: 7,
                  }}
                >
                  <img src="kwid.jpg" alt="Yamaha Factor" width="295" />
                </Box>

                <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 250, p: 11, border: '0.3px solid black', borderRadius: 400, ml: 7 }}>
                  <Typography variant="h2" color="text.primary" sx={{ backgroundColor: 'transparent' }}>
                    {winners?.winner4.toString().padStart(3, '0')}
                  </Typography>
                </Box>
              </Stack>
            </ImageListItem>
          </ImageList>
        </>
      )}
    </Layout>
  )
}

export default WinnersNumbers;
