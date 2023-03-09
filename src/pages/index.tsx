import styles from '@/styles/Home.module.css'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Unearth</title>
        <meta name="description" content="Unearth GIS Analytics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
      </main>
    </>
  )
}
