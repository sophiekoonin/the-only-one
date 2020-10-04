import { GameStageMessages } from '../gameStages'
import {
    createId,
    playerIsInActivePlayers,
    waitUntil
} from '../GameStateMachine'

export class PlayerSubmitWordHandler {
    constructor(waitForUsersFor) {
        this.waitForUsersFor = waitForUsersFor
        this.userTimeoutPromptAt = waitForUsersFor - 3_000
        this.userTimeoutPromptAt =
            this.userTimeoutPromptAt < 0
                ? this.waitForUsersFor
                : this.userTimeoutPromptAt
    }

    async execute(state, context) {
        this.submitted = 0

        for (let player of state.guessingPlayers) {
            context.channel.sendMessage(
                {
                    kind: 'instruction',
                    type: 'submit-word-request',
                    value: state.currentWord,
                    timeout: this.userTimeoutPromptAt
                },
                player.clientId
            )
        }

        const result = { transitionTo: 'CollatePlayerWordsHandler' }

        try {
            await waitUntil(
                () => this.submitted == state.guessingPlayers,
                this.waitForUsersFor
            )
        } catch (exception) {
            result.error = true
        }

        return result
    }

    async handleInput(state, context, message) {
        if (!playerIsInActivePlayers(state, message.metadata)) {
            return
        }

        if (message.kind === GameStageMessages.SUBMIT_WORD_RESPONSE) {
            state.clues.push({
                id: createId(),
                word: message.metadata.word,
                author: message.metadata.clientId,
                authorName: message.metadata.friendlyName
            })
            context.channel.sendMessage(
                { kind: 'instruction', type: 'wait' },
                message.metadata.clientId
            )

            this.submitted++
        }
    }
}
