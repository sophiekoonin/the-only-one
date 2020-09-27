import React from 'react'
import { useRouter } from 'next/router'
import { P2PContext } from '../lib/p2p/P2PContext'
import PreStartView from '../components/JoinStage/JoinStage'
import GameView from '../components/GameView'

export default function GamePage() {
  const router = useRouter()

  const { query } = router
  const p2pContext = React.useContext(P2PContext)
  const { started } = p2pContext
  const gameId = Array.isArray(query.gameId)
    ? query.gameId[0]
    : query.gameId || ''

  return (
    <main>
      <h1>⭐ only one ⭐</h1>
      {!started ? (
        <PreStartView gameId={gameId} />
      ) : (
        <GameView gameId={gameId} />
      )}
    </main>
  )
}
