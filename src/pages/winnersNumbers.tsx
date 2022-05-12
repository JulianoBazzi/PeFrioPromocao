import { Box, CircularProgress, ImageList, ImageListItem, Stack, Typography } from '@mui/material';
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
    <Layout hideHeader>
      {isLoading ? (
        <div style={{ margin: 0, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <Stack direction="row" justifyContent="space-between" sx={{ p: 1 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img src="logo.png" alt="Mercurius" width="150" />
            </Box>

            <Typography component="h1" variant="h5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Ganhadores
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img src="app-logo.webp" alt="Mercurius" width="150" />
            </Box>
          </Stack>
          <ImageList component="main" sx={{ p: 2 }} cols={4}>
            <ImageListItem key={1}>
              <Stack direction="column">
                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <img src="yamahaFactor.jpg" alt="Yamaha Factor" width="100" />
                </Box>

                <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 175, p: 6, border: '0.3px solid black', borderRadius: 100 }}>
                  <Typography variant="h2" color="text.primary" sx={{ backgroundColor: 'transparent' }}>
                    {winners?.winner1.toString().padStart(3, '0')}
                  </Typography>
                </Box>
              </Stack>
            </ImageListItem>
            <ImageListItem key={2}>
              <Stack direction="column">
                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <img src="yamahaFactor.jpg" alt="Yamaha Factor" width="100" />
                </Box>

                <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 175, p: 6, border: '0.3px solid black', borderRadius: 100, ml: 2 }}>
                  <Typography variant="h2" color="text.primary" sx={{ backgroundColor: 'transparent' }}>
                    {winners?.winner2.toString().padStart(3, '0')}
                  </Typography>
                </Box>
              </Stack>
            </ImageListItem>
            <ImageListItem key={3}>
              <Stack direction="column">
                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <img src="yamahaFactor.jpg" alt="Yamaha Factor" width="100" />
                </Box>

                <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 175, p: 6, border: '0.3px solid black', borderRadius: 100, ml: 2 }}>
                  <Typography variant="h2" color="text.primary" sx={{ backgroundColor: 'transparent' }}>
                    {winners?.winner3.toString().padStart(3, '0')}
                  </Typography>
                </Box>
              </Stack>
            </ImageListItem>
            <ImageListItem key={4}>
              <Stack direction="column">
                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <img src="kwid.jpg" alt="Yamaha Factor" width="190" />
                </Box>

                <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 175, p: 6, border: '0.3px solid black', borderRadius: 100, ml: 2 }}>
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
