import { getRandomWord } from '../words'

export class StartHandler {
    async execute(state) {
        state.clues = []
        state.words.push(getRandomWord(state.words))
        return { transitionTo: 'PlayerSubmitWordHandler' }
    }
}
