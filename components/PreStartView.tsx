import { useContext, useState, useEffect } from 'react'
import { P2PContext } from '../p2p-utils/P2PContext'

type Props = { gameId: string }

export default function PreStartView({ gameId }) {
  const [name, setName] = useState('')

  const p2pContext = useContext(P2PContext)
  const { join, p2pServer, players, playerName } = p2pContext

  const [playerReady, setPlayerReady] = useState(false)

  useEffect(() => {
    if (playerName != null && playerName !== '') {
      setPlayerReady(true)
    }
  }, [playerName])

  async function joinGame(e: React.FormEvent) {
    e.preventDefault()
    join(gameId, name)
    setPlayerReady(true)
  }
  const isHost = p2pServer != null

  return (
    <>
      {isHost && (
        <button type="button" onClick={() => p2pServer.startGame()}>
          Start game
        </button>
      )}
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
      {players != null && (
        <>
          <h2>Active players: {players.length}</h2>
          <ul>
            {players.map((user) => (
              <li key={user.friendlyName}>
                <span>{user.friendlyName}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
