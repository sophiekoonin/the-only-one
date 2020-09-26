<template>
    <section class="game-info">
        <h2>UniqueId: {{ uniqueId }}</h2>
        <button
            v-if="iAmHost && !gameStarted"
            v-on:click="startGame"
            class="form-button"
        >
            Start game
        </button>
        <button
            v-if="iAmHost && gameStarted"
            v-on:click="advanceTurn"
            class="form-button"
        >
            Next turn
        </button>
        <h3>
            Active players:
            {{
                transmittedServerState != null
                    ? transmittedServerState.players.length
                    : 0
            }}
        </h3>
        <ul
            v-if="
                transmittedServerState != null &&
                    transmittedServerState.players != null
            "
            class="players"
        >
            <li
                class="player"
                v-bind:key="user.friendlyName"
                v-for="user in transmittedServerState.players"
            >
                <span>{{ user.friendlyName }}</span>
            </li>
        </ul>
        <p v-if="gameStarted">It's {{ currentTurn }}'s turn!</p>
    </section>
</template>

<script>
export default {
    name: 'GameInfo',
    props: [
        'uniqueId',
        'transmittedServerState',
        'iAmHost',
        'startGame',
        'advanceTurn',
        'gameStarted',
        'currentTurn'
    ]
}
</script>
