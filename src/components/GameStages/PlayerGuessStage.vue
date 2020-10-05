<script>
export default {
    name: 'PlayerGuessStage',
    props: ['state', 'client', 'isCluePlayer', 'transmittedServerState'],

    data: function() {
        return {
            countdownTimer: null,
            guess: ''
        }
    },
    methods: {
        submitGuess: async function() {
            this.submitted = true
            await this.client.submitGuess(this.guess)
        }
    },
    created: function() {
        this.hasCountdown = !isNaN(this.state?.lastInstruction?.timeout)
        if (!this.hasCountdown) {
            return
        }

        this.countdownTimer = setInterval(() => {},
        this.state?.lastInstruction?.timeout)
    },

    unmounted: function() {
        clearInterval(this.countdownTimer)
    }
}
</script>
<template>
    <section
        v-if="
            state.lastInstruction != null &&
                state.lastInstruction.type === 'player-guess-request'
        "
    >
        <div>
            <h3>
                Time to guess!
            </h3>
            <ul
                v-if="state != null && state.lastInstruction.clues != null"
                class="clues"
            >
                <li
                    class="clue"
                    v-bind:key="clue.clientId"
                    v-for="clue in state.lastInstruction.clues"
                >
                    <span>{{ clue.word }} from {{ clue.authorName }}</span>
                </li>
            </ul>
            <label>What do you think the word is?</label>
            <input type="text" name="guess-input" v-model="guess" />
            <button type="submit" v-on:click="submitGuess">Submit</button>
        </div>
    </section>
</template>
