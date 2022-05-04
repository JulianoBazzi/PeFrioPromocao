import type { NextPage } from 'next'
import Head from 'next/head'
import { FormEvent, useState } from 'react';
import { supabase } from '~/services/supabase';

const Home: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function LoginAsync(event: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const { user, session, error } = await supabase.auth.signIn({
      email,
      password,
    })

    console.log(user, session, error);
  }

  return (
    <div>
      <Head>
        <title>Promoção Pé Frio</title>
        <meta name="description" content="3ª Promoção Pé Frio da Paroquia São Domingos Sávio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <form onSubmit={LoginAsync}>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button type="submit">
            Efetuar Login
          </button>
        </form>
      </main>

      <footer>
        <a
          href="https://bazzi.solutions"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bazzi Solutions
        </a>
      </footer>
    </div>
  )
}

export default Home
