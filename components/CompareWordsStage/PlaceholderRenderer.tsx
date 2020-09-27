import { useContext } from 'react'
import { P2PContext } from '../../lib/p2p/P2PContext'

export default function PlaceholderRenderer() {
  const { currentStage, p2pServer } = useContext(P2PContext)
  return (
    <>
      <h2>{currentStage}</h2>
      {p2pServer != null && (
        <button onClick={() => p2pServer.advanceStage()}>Next stage</button>
      )}
    </>
  )
}
