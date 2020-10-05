<script>
export default {
    name: 'DuplicateWordsStage',
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
                state.lastInstruction.type === 'show-duplicate-words'
        "
    >
        <div v-if="isCluePlayer">
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

            <h3>Duplicates:</h3>
            <ul
                v-if="
                    state != null &&
                        state.lastInstruction.dupes != null &&
                        state.lastInstruction.dupes.length > 0
                "
                class="clues"
            >
                <li
                    class="clue"
                    v-bind:key="clue.clientId"
                    v-for="clue in state.lastInstruction.dupes"
                >
                    <span>{{ clue.word }} from {{ clue.authorName }}</span>
                </li>
            </ul>
            <span v-else>No duplicates, nice work!</span>
            <h3>Resulting words:</h3>
            <ul
                v-if="state != null && state.lastInstruction.uniques != null"
                class="clues"
            >
                <li
                    class="clue"
                    v-bind:key="clue.clientId"
                    v-for="clue in state.lastInstruction.uniques"
                >
                    <span>{{ clue.word }} from {{ clue.authorName }}</span>
                </li>
            </ul>
        </div>
        <div v-else>
            Please wait
        </div>
    </section>
</template>
