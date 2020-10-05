<template>
    <div id="activeGame" class="game-info">
        <div v-if="!hasJoined">
            <form class="form">
                <label for="name-name">Enter your name</label>
                <input type="text" name="name" v-model="playerFriendlyName" />
                <button v-on:click="join" class="form-button">
                    Join game
                </button>
            </form>
        </div>
        <div class="game-lobby" v-if="gameCanBeStarted">
            <invite-link :game-id="gameId"></invite-link>
            <connected-players-summary
                :state="serverState"
            ></connected-players-summary>
            <start-game-prompt
                :is-host="isHost"
                :state="serverState"
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
                :transmittedServerState="serverState"
                :client="client"
                :isCluePlayer="isCluePlayer"
            />
            <duplicate-words-stage
                :state="clientState"
                :transmittedServerState="serverState"
                :client="client"
                :clientId="clientId"
                :isCluePlayer="isCluePlayer"
            />
            <player-guess-stage
                :state="clientState"
                :transmittedServerState="serverState"
                :client="client"
                :clientId="clientId"
                :isCluePlayer="isCluePlayer"
            />
            <round-end-stage
                :state="clientState"
                :transmittedServerState="serverState"
                :client="client"
                :clientId="clientId"
                :isCluePlayer="isCluePlayer"
            />
        </div>
    </div>
</template>

<script>
import StartGamePrompt from '../components/StartGamePrompt'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import InviteLink from '../components/InviteLink'
import SubmitWordStage from '../components/GameStages/SubmitWordStage'
import DuplicateWordsStage from '../components/GameStages/DuplicateWordsStage'
import ConnectedPlayersSummary from '../components/ConnectedPlayersSummary'
import PlayerGuessStage from '../components/GameStages/PlayerGuessStage'
import RoundEndStage from '../components/GameStages/RoundEndStage'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

export default {
    name: 'GameLobby',
    data: function() {
        return { playerFriendlyName: this.friendlyName }
    },
    components: {
        'start-game-prompt': StartGamePrompt,
        'loading-placeholder': LoadingPlaceholder,
        'invite-link': InviteLink,
        'connected-players-summary': ConnectedPlayersSummary,
        'submit-word-stage': SubmitWordStage,
        'duplicate-words-stage': DuplicateWordsStage,
        'player-guess-stage': PlayerGuessStage,
        'round-end-stage': RoundEndStage
    },
    computed: {
        ...mapState(['gameId']),
        ...mapGetters([
            'hasJoined',
            'clientId',
            'isHost',
            'serverState',
            'clientState',
            'gameClient',
            'isCluePlayer'
        ]),
        gameCanBeStarted: function() {
            return this.serverState && !this.serverState.started
        },
        gameStarted: function() {
            return this.clientState?.gameStarted
        }
    },
    methods: {
        ...mapMutations(['setGameId']),
        ...mapActions(['join', 'startGame']),
        joinGame: async function() {
            this.join({ friendlyName: this.friendlyName, gameId: this.gameId })
        }
    },
    created: function() {
        this.setGameId(this.$route.params.gameId)
    }
}
</script>
