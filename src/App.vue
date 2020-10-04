<template>
    <div id="app">
        <create-game-form
            v-if="!joinedOrHosting"
            :host="host"
            :join="join"
            :defaultGameId="gameId"
            :defaultFriendlyName="friendlyName"
        />
        <game-lobby
            v-else
            :isHost="isHost"
            :gameId="gameId"
            :transmittedServerState="transmittedServerState"
            :gameCanBeStarted="gameCanBeStarted"
            :startGame="startGame"
            :lastInstruction="state.lastInstruction"
        />
    </div>
</template>

<script>
import { P2PClient } from './lib/p2p/p2pClient'
import { P2PServer } from './lib/p2p/p2pServer'
import { PubSubClient, handleMessageFromAbly } from './lib/p2p/ably'
import { Identity } from './utils/identity'
import CreateGameForm from './components/CreateGameForm'
import GameLobby from './components/GameLobby'

export default {
    name: 'App',
    components: {
        'create-game-form': CreateGameForm,
        'game-lobby': GameLobby
    },
    data: () => ({
        p2pClient: null,
        p2pServer: null,
        friendlyName: 'Player-' + crypto.getRandomValues(new Uint32Array(1))[0],
        gameId: 'Session'
    }),
    computed: {
        state: function() {
            return this.p2pClient != null ? this.p2pClient.state : null
        },
        transmittedServerState: function() {
            return this.p2pClient != null ? this.p2pClient.serverState : null
        },
        joinedOrHosting: function() {
            return this.p2pClient != null || this.p2pServer != null
        },
        isHost: function() {
            return this.p2pServer != null
        },
        currentTurn: function() {
            return this.p2pClient != null
                ? this.p2pClient.state.currentTurn.friendlyName
                : ''
        },
        gameStarted: function() {
            return this.p2pClient != null && this.p2pClient.state.gameStarted
        },
        gameCanBeStarted: function() {
            return (
                this.transmittedServerState &&
                !this.transmittedServerState.started
            )
        }
    },
    methods: {
        host: async function(friendlyName, gameId) {
            this.gameId = gameId
            this.friendlyName = friendlyName

            const pubSubClient = new PubSubClient((message, metadata) => {
                handleMessageFromAbly(
                    message,
                    metadata,
                    this.p2pClient,
                    this.p2pServer
                )
            })

            const identity = new Identity(this.friendlyName)
            this.p2pServer = new P2PServer(identity, this.gameId, pubSubClient)
            this.p2pClient = new P2PClient(identity, this.gameId, pubSubClient)

            await this.p2pServer.connect()
            await this.p2pClient.connect()
        },
        join: async function(friendlyName, gameId) {
            this.gameId = gameId
            this.friendlyName = friendlyName

            const pubSubClient = new PubSubClient((message, metadata) => {
                handleMessageFromAbly(
                    message,
                    metadata,
                    this.p2pClient,
                    this.p2pServer
                )
            })

            const identity = new Identity(this.friendlyName)
            this.p2pClient = new P2PClient(identity, this.gameId, pubSubClient)

            await this.p2pClient.connect()
        },
        startGame: async function(evt) {
            evt.preventDefault()
            this.p2pServer?.startGame()
        },
        nextRound: async function(evt) {
            evt.preventDefault()
            this.p2pServer?.nextRound()
        }
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
