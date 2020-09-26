import React from 'react'
import { useRouter } from 'next/router'
import { P2PContext } from '../p2p-utils/P2PContext'

// the player name is passed in as a query string
export default function GamePage() {
  const [gameId, setGameId] = React.useState('')
  const router = useRouter()
  const { query } = router

  const p2pContext = React.useContext(P2PContext)
  const { p2pServer, p2pClient } = p2pContext
  const isHost = p2pServer != null

  React.useEffect(() => {
    const { gameId } = query || {}
    setGameId(Array.isArray(gameId) ? gameId[0] : gameId)
  }, [query])

  return <div>Hello world!</div>
}
