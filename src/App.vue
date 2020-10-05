<template>
    <div id="app">
        <h1>only one</h1>
        <create-game-form
            v-if="!joinedOrHosting"
            :host="host"
            :join="join"
            :defaultGameId="gameId"
            :defaultFriendlyName="friendlyName"
        />
        <game-lobby v-else />
    </div>
</template>

<script>
import { P2PClient } from './lib/p2p/p2pClient'
import { P2PServer } from './lib/p2p/p2pServer'
import { PubSubClient, handleMessageFromAbly } from './lib/p2p/ably'
import { Identity } from './lib/utils/identity'
import CreateGameForm from './components/CreateGameForm'
import GameLobby from './components/GameLobby'
import VueRouter from 'vue-router'
import store from './store'

const routes = [
    { path: '/', component: CreateGameForm },
    { path: '/:gameId', component: GameLobby }
]

const router = new VueRouter({
    routes // short for `routes: routes`
})

export default {
    name: 'App',
    router,
    store,
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
            return this.p2pClient?.state
        },
        transmittedServerState: function() {
            return this.p2pClient?.serverState
        },
        joinedOrHosting: function() {
            return this.p2pClient != null || this.p2pServer != null
        },
        isHost: function() {
            return this.p2pServer != null
        },
        gameStarted: function() {
            return this.p2pClient?.state?.gameStarted
        },
        gameCanBeStarted: function() {
            return (
                this.transmittedServerState &&
                !this.transmittedServerState.started
            )
        },
        gameClient: function() {
            return this.p2pClient?.gameClient
        },
        clientId: function() {
            return this.p2pClient?.identity?.clientId
        },
        turnPlayer: function() {
            return this.transmittedServerState?.turnPlayer
        },
        isCluePlayer: function() {
            const turnPlayer = this.turnPlayer?.clientId
            return (
                turnPlayer != null &&
                this.clientId != null &&
                turnPlayer !== this.clientId
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
        startGame: async function() {
            this.p2pServer?.startGame()
        },
        nextRound: async function() {
            this.p2pServer?.nextRound()
        }
    }
}
</script>

<style lang="scss">
body {
    background: #e2d4ff;
}

#app {
    background: #ac9dcc;
    width: 50vw;
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    border-radius: 6px;
    border: 1px solid #584187;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #241c36;
    margin-top: 60px;
}
</style>
