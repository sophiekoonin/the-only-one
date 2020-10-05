<script>
export default {
    name: 'RoundEndStage',
    props: ['state', 'client', 'isCluePlayer', 'transmittedServerState'],

    data: function() {
        return {
            countdownTimer: null
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
                state.lastInstruction.type === 'show-result'
        "
    >
        <h3>
            {{ transmittedServerState.turnPlayer.friendlyName }}
            guessed {{ state.lastInstruction.guess }}
        </h3>
        <p>The word was: {{ state.lastInstruction.word }}</p>
        <p v-if="state.lastInstruction.word === state.lastInstruction.guess">
            Correct!
        </p>
        <p v-else>Oh no!</p>
    </section>
</template>
