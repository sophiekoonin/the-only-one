<template>
    <div id="activeGame" class="game-info">
        <div class="game-lobby" v-if="gameCanBeStarted">
            <invite-link :game-id="gameId"></invite-link>
            <connected-players-summary
                :state="transmittedServerState"
            ></connected-players-summary>
            <start-game-prompt
                :is-host="isHost"
                :state="transmittedServerState"
                v-on:startgame="startGame"
            >
            </start-game-prompt>
        </div>
        <div v-if="!gameCanBeStarted && lastInstruction == null">
            <loading-placeholder></loading-placeholder>
        </div>
    </div>
</template>

<script>
import StartGamePrompt from './StartGamePrompt'
import LoadingPlaceholder from './LoadingPlaceholder'
import InviteLink from './InviteLink'
import ConnectedPlayersSummary from './ConnectedPlayersSummary'

export default {
    name: 'GameLobby',
    components: {
        'start-game-prompt': StartGamePrompt,
        'loading-placeholder': LoadingPlaceholder,
        'invite-link': InviteLink,
        'connected-players-summary': ConnectedPlayersSummary
    },
    props: [
        'gameId',
        'transmittedServerState',
        'isHost',
        'startGame',
        'gameStarted',
        'lastInstruction',
        'gameCanBeStarted'
    ]
}
</script>
