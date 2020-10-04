import { GameStageMessages } from './gameStages'
import { StartHandler } from './handlers/StartHandler'
import { NewRoundHandler } from './handlers/NewRoundHandler'
import { PlayerSubmitWordHandler } from './handlers/PlayerSubmitWordHandler'

const { GameStateMachine } = require('./GameStateMachine')

export const Game = handlerContext =>
    new GameStateMachine({
        steps: {
            StartHandler,
            NewRoundHandler,
            PlayerSubmitWordHandler,
            EndHandler: {}
        },
        context: handlerContext
    })

export class GameClient {
    constructor(gameId, channel) {
        this.gameId = gameId
        this.channel = channel
    }

    async submitWord(word) {
        this.channel.sendMessage({
            kind: GameStageMessages.SUBMIT_WORD_RESPONSE,
            word
        })
    }

    async submitGuess(word) {
        this.channel.sendMessage({
            kind: GameStageMessages.SUBMIT_GUESS_RESPONSE,
            word
        })
    }
}
