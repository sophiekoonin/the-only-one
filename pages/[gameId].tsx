import React from 'react'
import { useRouter } from 'next/router'
import { P2PContext } from '../p2p-utils/P2PContext'

export default function GamePage() {
  const [name, setName] = React.useState('')
  const [playerReady, setPlayerReady] = React.useState(false)
  const router = useRouter()

  const { query } = router
  const p2pContext = React.useContext(P2PContext)
  const { join, p2pServer, p2pClient, playerName } = p2pContext
  const gameId = Array.isArray(query.gameId)
    ? query.gameId[0]
    : query.gameId || ''

  React.useEffect(() => {
    if (playerName != null && playerName !== '') {
      setPlayerReady(true)
    }
  }, [playerName])

  const isHost = p2pServer != null

  async function joinGame(e: React.FormEvent) {
    e.preventDefault()
    join(gameId, name)
    setPlayerReady(true)
  }

  return (
    <main>
      <h1>⭐ only one ⭐</h1>
      {isHost && <p>You're the host</p>}
      {!isHost && !playerReady && (
        <form onSubmit={joinGame}>
          <label htmlFor="name">Enter your name</label>
          <input
            value={name}
            id="name"
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Let's go!</button>
        </form>
      )}
      {p2pClient?.serverState?.players != null && (
        <>
          <h2>Active players: {p2pClient?.serverState?.players.length}</h2>
          <ul>
            {p2pClient?.serverState?.players.map((user) => (
              <li key={user.friendlyName}>
                <span>{user.friendlyName}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
