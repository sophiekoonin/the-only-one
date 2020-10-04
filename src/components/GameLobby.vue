<template>
    <div id="activeGame" class="game-info">
        <div class="game-lobby" v-if="gameCanBeStarted">
            <invite-link :game-id="gameId"></invite-link>
            <connected-players-summary
                :state="transmittedServerState"
            ></connected-players-summary>
            <ready-or-waiting-prompt
                :is-host="isHost"
                :state="transmittedServerState"
                v-on:startgame="startGame"
            >
            </ready-or-waiting-prompt>
        </div>
        <div v-if="!gameCanBeStarted && lastInstruction == null">
        <loader></loader>
    </div>
</template>

<script>
export default {
    name: 'GameLobby',
    props: [
        'uniqueId',
        'transmittedServerState',
        'isHost',
        'startGame',
        'advanceTurn',
        'gameStarted',
        'lastInstruction'
    ]
}
</script>
