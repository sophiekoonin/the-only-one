import { GameStageIds, GameStages } from '../game/stages'
import { AblyClient } from './AblyClient'
import { Identity } from './Identity'

export type ServerState = {
  players: string[]
  currentTurnIndex: number
  started: boolean
  words: WordSubmission[]
  currentStage: string
}

export type WordSubmission = {
  clientId: string
  word: string
  playerName: string
}

export class P2PServer {
  identity: Identity
  ably: AblyClient
  uniqueId: string
  state: ServerState

  constructor(identity, uniqueId, ably) {
    this.identity = identity
    this.uniqueId = uniqueId
    this.ably = ably
    this.state = {
      players: [],
      currentTurnIndex: 0,
      currentStage: GameStageIds.JOIN,
      started: false,
      words: [],
    }
  }

  async startGame() {
    this.state.started = true
    this.ably.sendMessage({
      kind: 'game-start',
      turn: this.state.players[0],
      serverState: this.state,
    })
  }

  async advanceTurn() {
    const { currentTurnIndex } = this.state
    const newTurnIndex =
      currentTurnIndex < this.state.players.length - 1
        ? currentTurnIndex + 1
        : 0
    this.state.currentTurnIndex = newTurnIndex
    this.ably.sendMessage({
      kind: 'turn',
      turn: this.state.players[newTurnIndex],
      serverState: this.state,
    })
  }
  async advanceStage() {
    const { currentStage } = this.state
    this.state.currentStage = GameStages[currentStage].nextStage
    this.ably.sendMessage({
      kind: 'stage',
      stage: this.state.currentStage,
      serverState: this.state,
    })
  }
  onReceiveMessage(message) {
    console.log({ message })
    switch (message.kind) {
      case 'connected':
        this.onClientConnected(message)
        break
      case 'word':
        this.state.words.push({
          word: message.word,
          clientId: message.metadata.clientId,
          playerName: message.metadata.friendlyName,
        })
        break
      // // once everyone except current turn player has submitted words
      // // we move on to next stage
      // if (this.state.words.length === this.state.players.length - 1) {
      //   this.advanceTurn()
      // }
      default:
        break
    }
  }
  onClientConnected(message) {
    this.state.players.push(message.metadata)
    this.ably.sendMessage(
      { kind: 'connection-acknowledged', serverState: this.state },
      message.metadata.clientId
    )
    this.ably.sendMessage({ kind: 'peer-status', serverState: this.state })
  }
}
