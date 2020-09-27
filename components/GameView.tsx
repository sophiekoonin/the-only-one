import { useContext } from 'react'
import { P2PContext } from '../p2p-utils/P2PContext'

type Props = { gameId: string }
export default function GameView({ gameId }) {
  const p2pContext = useContext(P2PContext)
  const { join, p2pServer, players, clientId, currentTurnIndex } = p2pContext

  const currentPlayer = players[currentTurnIndex]

  return currentPlayer.clientId === clientId ? (
    <>
      <h2> It's your turn!</h2>
      <p>Sit tight...</p>
    </>
  ) : (
    <>
      <h2>It's {currentPlayer.friendlyName}'s turn!</h2>
      <p>Their word is [WORD].</p>
    </>
  )
}
