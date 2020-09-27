import { useContext } from 'react'
import { P2PContext } from '../../lib/p2p/P2PContext'
import { WordSubmission } from '../../lib/p2p/P2PServer'

export default function CompareWordsStage() {
  const p2pContext = useContext(P2PContext)
  const { join, p2pServer, players, playerName, words } = p2pContext

  return (
    <>
      <h2>Here's what you said...</h2>
      <ul>
        {words.map((word: WordSubmission) => (
          <li key={word.clientId}>
            {word.word} - {word.playerName}
          </li>
        ))}
      </ul>
    </>
  )
}
