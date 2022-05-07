import { Box, Button, CircularProgress, Grid, ImageList, ImageListItem } from '@mui/material';
import type { NextPage } from 'next';
import _ from 'lodash';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { supabase } from '~/services/supabase';
import { useSnackbar } from 'notistack';
import INumbers from '~/models/INumbers';
import Layout from '~/layout/Layout';

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [numbersGeral, setNumbersGeral] = useState<INumbers[]>([]);
  const [numbersSorted, setNumbersSorted] = useState<INumbers[]>([]);
  const [numbers, setNumbers] = useState<INumbers[]>([]);
  const [page, setPage] = useState(-1);
  const defaultNumbers = Array.from(Array(6000).keys());
  const { enqueueSnackbar } = useSnackbar();
  const minute_ms = 30000;
  const pageCount = 265;

  const getNumbers = (numbersX: INumbers[]) => {
    console.log('getNumbers');
    const y: INumbers[] = [];
    defaultNumbers.forEach((x: number) => y.push({ number: x + 1, sorted: false }));

    numbersSorted.forEach(x => x.sorted = true);
    const sorted = numbersSorted.map(x => ({ ...x, sorted: true }));
    const merged = _.merge(_.keyBy(y, 'number'), _.keyBy(sorted, 'number'));
    const result = _.values(merged);

    setNumbersGeral(result);
  }

  async function getData() {
    console.log('getData');
    const { error, data } = await supabase
      .from('drawn_numbers')
      .select('id, number')
      .order('created_at', { ascending: false });

    if (error) {
      enqueueSnackbar(error.message, {
        variant: 'warning',
      })
    }

    if (data) {
      setNumbersSorted(data);
    }
  }

  useEffect(() => {
    if (!supabase.auth.session()) {
      window.location.href = '/login';
    }

    if (numbers.length === 0) {
      getData();
    }

    const mySubscription = supabase
      .from('drawn_numbers')
      .on('INSERT', payload => {
        console.log('numbers');
        console.log(numbers);
        const updateTable = [...numbers];

        console.log('updateTable');
        console.log(updateTable);

        console.log('id');
        console.log(payload.new.id);

        const index = updateTable.findIndex(x => x.number === payload.new.number);

        console.log('index');
        console.log(index);

        if (index > -1) {
          payload.new.sorted = true;
          updateTable[index] = payload.new;

          console.log('updateTable 2');
          console.log(updateTable);

          setNumbers(updateTable);

          console.log('Change received!', payload)
        }
      })
      .subscribe()

    const interval = setInterval(() => {
      setPage((page) => page > 21 ? 0 : page + 1);
    }, minute_ms);

    return () => {
      clearInterval(interval);
      supabase.removeAllSubscriptions();
    };
  }, []);

  useEffect(() => {
    getNumbers(numbersSorted);
  }, [numbersSorted]);

  useEffect(() => {
    if (page > -1) {
      const index = (page * pageCount);
      const indexInit = page === 0 ? index : index + page;
      const obj = numbersGeral.filter(x => x.number >= indexInit && x.number <= indexInit + pageCount);
      setNumbers(obj);

      if (isLoading) {
        setIsLoading(false);
      }
    }
  }, [page]);

  return (
    <Layout>
      <Head>
        <title>Promoção Pé Frio</title>
      </Head>
      <main>
        {isLoading ? (
          <div style={{ margin: 0, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <CircularProgress color="primary" />
          </div>
        ) : (
          <>
            <ImageList component="main" sx={{ mt: 0.5, p: 0.2 }} cols={19} rowHeight={40}>
              {numbers.map((item) => (
                <ImageListItem key={item.number}>
                  <Box component="span" sx={{ border: '0.3px solid black' }}>
                    <Button fullWidth sx={{ backgroundColor: item.sorted ? '#AAF27F' : '#FFFFFF' }}>{item.number}</Button>
                  </Box>
                </ImageListItem>
              ))}
            </ImageList>

            {page === 22 && (
              <Grid container>
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
            )}
          </>
        )}
      </main>
    </Layout>
  )
}

export default Home
