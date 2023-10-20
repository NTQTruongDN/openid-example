import 'tailwindcss/tailwind.css'

import type { AppProps } from 'next/app'
import Head from 'next/head'
import Header from '../components/header'
import AuthProvider from "../providers/auth-provider";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Clone and deploy your own Next.js portfolio in minutes."
        />
        <title>My Sample Consumer app</title>
      </Head>

      <Header />

      <main className="py-14">
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  )
}
