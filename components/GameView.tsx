import { useContext, useState } from 'react'
import { GameStages } from '../lib/game/stages'
import { P2PContext } from '../lib/p2p/P2PContext'

type Props = { gameId: string }
export default function GameView({ gameId }) {
  const [stage, setStage] = useState()
  const p2pContext = useContext(P2PContext)
  const {
    join,
    p2pServer,
    players,
    clientId,
    currentTurnIndex,
    currentStage,
  } = p2pContext

  const currentPlayer = players[currentTurnIndex]

  const CurrentStageRenderer = GameStages[currentStage].Renderer
  return <CurrentStageRenderer />
}
