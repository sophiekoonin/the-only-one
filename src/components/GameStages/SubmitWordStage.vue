<script>
export default {
    name: 'SubmitWordStage',
    props: ['state', 'client', 'isCluePlayer', 'transmittedServerState'],

    data: function() {
        return {
            countdownTimer: null,
            submitted: false,
            clue: ''
        }
    },
    methods: {
        submitWord: async function() {
            this.submitted = true
            await this.client.submitWord(this.clue)
        }
    },
    created: function() {
        this.hasCountdown = !isNaN(this.state?.lastInstruction?.timeout)
        if (!this.hasCountdown) {
            return
        }

        this.countdownTimer = setInterval(() => {
            if (!this.submitted) {
                this.submitWord(this.clue)
            }
        }, this.state?.lastInstruction?.timeout)
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
                state.lastInstruction.type === 'submit-word-request'
        "
    >
        <div v-if="isCluePlayer">
            <p>
                The word is
                {{ state != null ? state.lastInstruction.value : '' }}
            </p>
            <label for="clue-input"
                >Give a clue to help
                {{ transmittedServerState.turnPlayer.friendlyName }}
                guess!</label
            >
            <input type="text" name="clue-input" v-model="clue" />
            <button v-on:click="submitWord" type="submit">Submit</button>
        </div>
        <div v-else>
            Please wait
        </div>
    </section>
</template>
