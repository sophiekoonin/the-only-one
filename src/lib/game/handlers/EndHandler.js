import { GameStageMessageTypes } from '../MessageTypes'

export class EndHandler {
    async execute(state, context) {
        context.channel.sendMessage({
            kind: 'instruction',
            type: GameStageMessageTypes.SHOW_RESULT,
            guess: state.guess,
            word: state.words[state.words.length - 1]
        })
        return { complete: true }
    }
}
