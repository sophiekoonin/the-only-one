<script>
export default {
    name: 'SubmitWordStage',
    props: ['state', 'client'],

    data: function() {
        return {
            countdownTimer: null,
            submitted: false,
            clue: ''
        }
    },

    methods: {
        submitWord: async function(word) {
            this.submitted = true
            await this.client.submitWord(word)
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
        <p>The word is {{ state.lastInstruction.value }}</p>
        <label for="clue-input"
            >Give a clue to help
            {{ state.turnPlayer.friendlyName }} guess!</label
        >
        <input type="text" name="clue-input" v-model="clue" />
    </section>
</template>
