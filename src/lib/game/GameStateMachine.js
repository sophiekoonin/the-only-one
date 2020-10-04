export class NullMessageChannel {
    constructor() {
        this.sentMessages = []
    }

    sendMessage(message, targetClientId) {
        this.sentMessages.push({ message, targetClientId })
    }
}

export class GameStateMachine {
    constructor(gameDefinition) {
        this.steps = gameDefinition.steps
        this.context = gameDefinition.context || {}

        if (!this.context.channel) {
            this.context.channel = new NullMessageChannel()
        }

        this.state = {
            words: [],
            clues: [],
            dupes: [],
            msInCurrentStep: 0,
            currentTurnIndex: -1,
            activePlayers: [],
            nonTurnPlayers: [],
            turnPlayer: null
        }

        this.startNewRound()
    }

    startNewRound() {
        this.currentStepKey = 'StartHandler'
        this.msTracker = null
    }

    currentStep() {
        return this.steps[this.currentStepKey]
    }

    async run() {
        console.log('Invoking run()', this.currentStepKey)

        this.trackMilliseconds()

        const currentStep = this.currentStep()
        const response = await currentStep.execute(this.state, this.context)

        if (
            this.currentStepKey == 'EndHandler' &&
            (response == null || response.complete)
        ) {
            return // State machine exit signal
        }

        if (response == null) {
            throw 'You must return a response from your execute functions so we know where to redirect to.'
        }

        this.currentStepKey = response.transitionTo
        this.run()
    }

    async handleInput(input) {
        const currentStep = this.currentStep()
        if (currentStep.handleInput) {
            currentStep.handleInput(this.state, this.context, input)
        } else {
            console.log('Input received while no handler was available.')
        }
    }

    trackMilliseconds() {
        clearTimeout(this.msTracker)
        this.state.msInCurrentStep = 0

        const interval = 5
        this.msTracker = setInterval(() => {
            this.state.msInCurrentStep += interval
        }, interval)
    }
}

export function waitUntil(condition, timeout) {
    return new Promise((res, rej) => {
        if (condition()) {
            res()
            return
        }

        let elapsed = 0
        const pollFrequency = 10
        let poll = setInterval(() => {
            if (condition()) {
                clearInterval(poll)
                res()
                return
            }

            elapsed += pollFrequency

            if (!timeout) {
                return
            }

            if (elapsed >= timeout) {
                clearInterval(poll)
                rej('Timed out')
            }
        }, pollFrequency)
    })
}

export function playerIsInActivePlayers(state, playerIdentity) {
    return (
        state.activePlayers.filter(
            ap => ap.clientId == playerIdentity?.clientId
        ).length > 0
    )
}

export function createId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}
