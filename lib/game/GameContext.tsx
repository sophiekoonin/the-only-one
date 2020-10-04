import React, { useState } from 'react'
import { createContext } from 'react'

const defaultContext = {
  started: false,
  words: null,
  currentTurnIndex: 0,
  currentStage: null,
}

type Props = {
  children: React.ReactNode
}

export const GameContext = createContext(defaultContext)

export default function GameContextProvider({ children }: Props) {
  const [words, setWords] = useState([])
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0)
  const [currentStage, setCurrentStage] = useState(null)
  const [started, setStarted] = useState(false)
  return (
    <GameContext.Provider
      value={{
        started,
        words,
        currentTurnIndex,
        currentStage,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}
