import { GameStageMessageTypes } from './MessageTypes'
import { StartHandler } from './handlers/StartHandler'
import { NewRoundHandler } from './handlers/NewRoundHandler'
import { PlayerGuessHandler } from './handlers/PlayerGuessHandler'
import { EndHandler } from './handlers/EndHandler'
import { CollateWordsHandler } from './handlers/CollateWordsHandler'
import { PlayerSubmitWordHandler } from './handlers/PlayerSubmitWordHandler'

const { GameStateMachine } = require('./GameStateMachine')

export const Game = handlerContext =>
    new GameStateMachine({
        steps: {
            StartHandler: new StartHandler(),
            NewRoundHandler: new NewRoundHandler(),
            PlayerSubmitWordHandler: new PlayerSubmitWordHandler(3000_000),
            CollateWordsHandler: new CollateWordsHandler(),
            PlayerGuessHandler: new PlayerGuessHandler(3000_000),
            EndHandler: new EndHandler()
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
            kind: GameStageMessageTypes.SUBMIT_WORD_RESPONSE,
            word
        })
    }

    async submitGuess(guess) {
        this.channel.sendMessage({
            kind: GameStageMessageTypes.PLAYER_GUESS_RESPONSE,
            guess
        })
    }
}
