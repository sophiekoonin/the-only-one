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
        <div
            v-if="
                !gameCanBeStarted &&
                    clientState != null &&
                    clientState.lastInstruction == null
            "
        >
            <loading-placeholder></loading-placeholder>
        </div>
        <div
            v-if="clientState != null && clientState.lastInstruction != null"
            class="playfield"
        >
            <submit-word-stage
                :state="clientState"
                :transmittedServerState="transmittedServerState"
                :client="client"
                :isCluePlayer="isCluePlayer"
            />
            <duplicate-words-stage
                :state="clientState"
                :transmittedServerState="transmittedServerState"
                :client="client"
                :clientId="clientId"
                :isCluePlayer="isCluePlayer"
            />
        </div>
    </div>
</template>

<script>
import StartGamePrompt from './StartGamePrompt'
import LoadingPlaceholder from './LoadingPlaceholder'
import InviteLink from './InviteLink'
import SubmitWordStage from './GameStages/SubmitWordStage'
import DuplicateWordsStage from './GameStages/DuplicateWordsStage'
import ConnectedPlayersSummary from './ConnectedPlayersSummary'

export default {
    name: 'GameLobby',
    components: {
        'start-game-prompt': StartGamePrompt,
        'loading-placeholder': LoadingPlaceholder,
        'invite-link': InviteLink,
        'connected-players-summary': ConnectedPlayersSummary,
        'submit-word-stage': SubmitWordStage,
        'duplicate-words-stage': DuplicateWordsStage
    },
    props: [
        'gameId',
        'client',
        'clientState',
        'transmittedServerState',
        'isHost',
        'startGame',
        'gameStarted',
        'gameCanBeStarted',
        'clientId',
        'isCluePlayer'
    ]
}
</script>
