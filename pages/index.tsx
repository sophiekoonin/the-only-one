import Head from 'next/head'
import { useRouter } from 'next/router'

import React from 'react'
import { P2PContext } from '../p2p-utils/P2PContext'
import styles from '../styles/Home.module.css'
import { generateRandomGameId } from '../utils/randomizer'

export default function Home() {
  const [name, setName] = React.useState('')
  const [error, setError] = React.useState(null)
  const p2pContext = React.useContext(P2PContext)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (name === '') {
      setError('Please enter a name!')
      return
    }
    const gameId = generateRandomGameId()
    await p2pContext.host(name, gameId)
    router.push('/[gameId]', `/${gameId}`, { shallow: true })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>⭐ only one ⭐</h1>
        <form onSubmit={onSubmit}>
          <label htmlFor="name">Enter your name</label>
          {error != null && <span>{error}</span>}
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Let's go!</button>
        </form>
      </main>
    </div>
  )
}
