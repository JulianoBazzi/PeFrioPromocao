import { Box, CircularProgress, ImageList, ImageListItem, Stack, Typography } from '@mui/material';
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
              Últimos 20 números sorteados
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
          <Stack direction="row" justifyContent="center">
            <ImageList component="main" sx={{ p: 2, ml: 3 }} cols={5}>
              {numbers.map((item) => (
                <ImageListItem key={item.number}>
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 90, p: 3, border: '0.3px solid black', borderRadius: 100, mr: 3 }}>
                    <Typography variant="h5" color="text.primary" sx={{ backgroundColor: 'transparent' }}>
                      {item.number.toString().padStart(3, '0')}
                    </Typography>
                  </Box>
                </ImageListItem>
              ))}
            </ImageList>
          </Stack>
        </>
      )}
    </Layout>
  )
}

export default LastNumbers;
