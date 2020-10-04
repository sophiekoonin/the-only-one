<script>
export default {
    name: 'DuplicateWordsStage',
    props: ['state', 'client', 'transmittedServerState'],

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
                state.lastInstruction.type === 'show-duplicate-words'
        "
    >
        <h3>
            Submitted words
        </h3>
        <ul
            v-if="state != null && state.lastInstruction.allClues != null"
            class="clues"
        >
            <li
                class="clue"
                v-bind:key="clue.clientId"
                v-for="clue in state.lastInstruction.allClues"
            >
                <span>{{ clue.word }} from {{ clue.authorName }}</span>
            </li>
        </ul>
    </section>
</template>
