import { useContext, useState } from 'react'
import { P2PContext } from '../../lib/p2p/P2PContext'

export default function SubmitWordStage() {
  const {
    currentStage,
    p2pServer,
    p2pClient,
    words,
    currentTurnIndex,
    players,
    clientId,
  } = useContext(P2PContext)
  const [word, setWord] = useState('')

  const currentPlayer = players[currentTurnIndex]
  const myTurn = currentPlayer.clientId === clientId
  const currentWord = words.length > 0 ? words[words.length - 1] : 'UNKNOWN'
  return myTurn ? (
    <p>It's your turn! Sit tight.</p>
  ) : (
    <>
      <h2>Word is {currentWord}</h2>
      <p>Submit a word</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          p2pClient.onSubmitWord(word)
        }}
      >
        <label>Your clue</label>
        <input value={word} onChange={(e) => setWord(e.target.value)} />
        <button>Submit</button>
      </form>
    </>
  )
}
