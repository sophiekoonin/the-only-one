import { GameStageMessages } from '../MessageTypes'

export class CollateWordsHandler {
    async execute(state, context) {
        const [uniques, dupes] = filterDuplicateClues(state.clues)
        state.duplicates = dupes
        state.clues = uniques

        state.nonTurnPlayers.forEach(player =>
            context.channel.sendMessage(
                {
                    kind: 'instruction',
                    type: GameStageMessages.SHOW_DUPLICATE_WORDS,
                    dupes,
                    uniques
                },
                player.clientId
            )
        )
        // wait 10s
        await new Promise(resolve => {
            setTimeout(resolve, 10000)
        })

        return { transitionTo: 'PlayerGuessHandler' }
    }
}

function filterDuplicateClues(clues) {
    const dupes = []

    const allClues = clues.slice().sort((a, b) => a.word < b.word)
    for (let i = 0; i < allClues.length; i++) {
        if (allClues[i] === allClues[i + 1]) {
            dupes.push(i)
        }
    }

    // filter out any words which are in the dupes array
    const uniques = allClues.filter(
        clue => !dupes.some(dupe => dupe.word === clue.word)
    )
    return [uniques, dupes]
}
