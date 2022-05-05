import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react';
import { supabase } from '~/services/supabase';

const Home: NextPage = () => {
  useEffect(() => {
    if (!supabase.auth.session()) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Promoção Pé Frio</title>
      </Head>
      <main>
        <h1>Página Home</h1>
      </main>
    </div>
  )
}

export default Home
