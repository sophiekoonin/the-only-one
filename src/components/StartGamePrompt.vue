<template>
    <div class="ready-or-waiting-prompt">
        <div v-if="isHost">
            <p>Everybody ready?</p>
            <button v-on:click="emitStartGameEvent" class="form-button">
                Start Game
            </button>
        </div>

        <div v-if="!isHost">
            <span id="wait-message"
                >Waiting for {{ friendlyName }} to start the game.</span
            >
        </div>
    </div>
</template>

<script>
export default {
    name: 'StartGamePrompt',
    props: ['isHost', 'state'],
    data: function() {
        return { friendlyName: this.state?.hostIdentity?.friendlyName }
    },
    methods: {
        emitStartGameEvent: async function() {
            this.$emit('startgame')
        }
    }
}
</script>
