import { FC } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import NextLink from 'next/link';
import Logout from '@mui/icons-material/Logout';
import { supabase } from '~/services/supabase';
import { useSnackbar } from 'notistack';

import Footer from './Footer';
import { IconButton, Link, Tooltip, Typography } from '@mui/material';

interface Props {
  hideHeader?: boolean;
  hideFooter?: boolean;
  children: React.ReactNode;
}

const Layout: FC<Props> = ({ hideHeader, hideFooter, children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const logout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      enqueueSnackbar(error.message, {
        variant: 'warning',
      });

      return;
    }

    window.location.href = '/login';
  };

  return (
    <>
      <Head>
        <title>Promoção Pé Frio</title>
      </Head>
      <main>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {!hideHeader && (
              <Box sx={{ backgroundColor: 'primary.main' }} position="sticky">
                <Toolbar sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <NextLink href="/numbers" passHref>
                    <Link color="#fff" title="Números Sorteados" underline="none">
                      <Typography component="h3" variant="body1">
                        Números Sorteados
                      </Typography>
                    </Link>
                  </NextLink>
                  <NextLink href="/lastNumbers" passHref>
                    <Link sx={{ ml: 4 }} color="#fff" title="Últimos 20 Números Sorteados" underline="none">
                      <Typography component="h3" variant="body1">
                        Últimos 20 Números Sorteados
                      </Typography>
                    </Link>
                  </NextLink>
                  <NextLink href="/winners" passHref>
                    <Link sx={{ ml: 4 }} color="#fff" title="Informar Ganhadores" underline="none">
                      <Typography component="h3" variant="body1">
                        Informar Ganhadores
                      </Typography>
                    </Link>
                  </NextLink>
                  <NextLink href="/winnersNumbers" passHref>
                    <Link sx={{ ml: 4 }} color="#fff" title="Números Ganhadores" underline="none">
                      <Typography component="h3" variant="body1">
                        Números Ganhadores
                      </Typography>
                    </Link>
                  </NextLink>
                  <Tooltip sx={{ ml: 4 }} title="Sair" placement="top-end">
                    <IconButton
                      size="small"
                      aria-label="exit"
                      onClick={async () => await logout()}
                    >
                      <Logout sx={{ color: '#ffff' }} />
                    </IconButton>
                  </Tooltip>
                </Toolbar>
              </Box>
            )}
            <Box sx={{ flexGrow: 1 }}>
              <main>{children}</main>
            </Box>
            {!hideFooter && (
              <Footer />
            )}
          </Box>
        </Box>
      </main>
    </>
  )
}

export default Layout
