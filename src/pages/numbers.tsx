import { Box, CircularProgress, ImageList, ImageListItem, Stack, Typography } from '@mui/material';
import type { NextPage } from 'next';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { supabase } from '~/services/supabase';
import { useSnackbar } from 'notistack';
import INumbers from '~/models/INumbers';
import Layout from '~/layout/Layout';

const Numbers: NextPage = () => {
  const pageCount = 239;
  const totalPage = 24;
  const [isLoading, setIsLoading] = useState(true);
  const [numbersGeral, setNumbersGeral] = useState<INumbers[]>([]);
  const [numbersSorted, setNumbersSorted] = useState<INumbers[]>([]);
  const [numbers, setNumbers] = useState<INumbers[]>([]);
  const [page, setPage] = useState(-1);
  const defaultNumbers = Array.from(Array(6000).keys());
  const { enqueueSnackbar } = useSnackbar();
  const minute_ms = 30000;

  const getNumbers = (numbersX: INumbers[]) => {
    const y: INumbers[] = [];
    defaultNumbers.forEach((x: number) => y.push({ number: x + 1, sorted: false }));

    numbersSorted.forEach(x => x.sorted = true);
    const sorted = numbersSorted.map(x => ({ ...x, sorted: true }));
    const merged = _.merge(_.keyBy(y, 'number'), _.keyBy(sorted, 'number'));
    const result = _.values(merged);

    setNumbersGeral(result);
  }

  async function getData() {
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
        const num = payload.new;
        num.sorted = true;
        setNumbers((numbersX) => {
          const updateTable = [...numbersX];
          const index = updateTable.findIndex(x => x.number === num.number);

          if (index > -1) {
            updateTable[index] = num;
          }

          setNumbersGeral((numbersY) => {
            if (index > -1) {
              const merged = _.merge(_.keyBy(numbersY, 'number'), _.keyBy(updateTable, 'number'));
              const result = _.values(merged);
              return result;
            }

            const updateTableY = [...numbersY];
            const indexY = updateTableY.findIndex(x => x.number === num.number);

            if (indexY > -1) {
              updateTableY[indexY] = num;
            }

            return updateTableY;
          });

          return updateTable;
        });
      })
      .on('DELETE', payload => {
        setNumbers((numbersX) => {
          const updateTable = [...numbersX];
          const index = updateTable.findIndex(x => x.id === payload.old.id);

          if (index > -1) {
            updateTable[index].sorted = false;
          }

          setNumbersGeral((numbersY) => {
            if (index > -1) {
              const merged = _.merge(_.keyBy(numbersY, 'number'), _.keyBy(updateTable, 'number'));
              const result = _.values(merged);
              return result;
            }

            const updateTableY = [...numbersY];
            const indexY = updateTableY.findIndex(x => x.id === payload.old.id);

            if (indexY > -1) {
              updateTableY[indexY].sorted = false;
            }

            return updateTableY;
          });

          return updateTable;
        });
      }).subscribe();

    const interval = setInterval(() => {
      setPage((page) => page > totalPage - 1 ? 0 : page + 1);
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
      const obj = numbersGeral.filter(x => x.number > indexInit && x.number <= indexInit + pageCount + 1);
      setNumbers(obj);

      if (isLoading) {
        setIsLoading(false);
      }
    }
  }, [page]);

  return (
    <Layout hideHeader>
      {isLoading ? (
        <div style={{ margin: 0, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <ImageList component="main" sx={{ mt: 0.4, p: 0.1 }} cols={16}>
            {numbers.map((item) => (
              <ImageListItem key={item.number}>
                <Box component="span" sx={{ border: '2px solid black', backgroundColor: item.sorted ? '#d0f8b9' : '#FFFFFF', textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="text.primary" fontWeight="bold">
                    {item.number}
                  </Typography>
                </Box>
              </ImageListItem>
            ))}
          </ImageList>

          {/* {page === totalPage && (
            <Stack direction="row" justifyContent="space-between" sx={{ p: 5 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img src="logo.png" alt="Mercurius" width="200" />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img src="app-logo.webp" alt="Mercurius" width="200" />
              </Box>
            </Stack>
          )} */}
        </>
      )}
    </Layout>
  )
}

export default Numbers
