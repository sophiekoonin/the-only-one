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
        this.hasCountdown = !isNaN(this.lastInstruction?.timeout)
        if (!this.hasCountdown) {
            return
        }

        this.countdownTimer = setInterval(() => {
            if (!this.submitted) {
                this.submitWord(this.clue)
            }
        }, this.lastInstruction?.timeout)
    },

    unmounted: function() {
        clearInterval(this.countdownTimer)
    }
}
</script>
<template>
    <section
        v-if="
            lastInstruction != null &&
                lastInstruction.type === 'submit-word-request'
        "
    >
        <p>The word is {{ lastInstruction.value }}</p>
        <label for="clue-input"
            >Give a clue to help
            {{ state.turnPlayer.friendlyName }} guess!</label
        >
        <input type="text" name="clue-input" v-model="clue" />
    </section>
</template>
