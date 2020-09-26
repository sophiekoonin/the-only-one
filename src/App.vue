<template>
    <div id="app">
        <create-game-form
            v-if="!joinedOrHosting"
            :host="host"
            :join="join"
            :defaultUniqueId="uniqueId"
            :defaultFriendlyName="friendlyName"
        />
        <game-info
            v-else
            :uniqueId="uniqueId"
            :iAmHost="iAmHost"
            :transmittedServerState="transmittedServerState"
            :advanceTurn="advanceTurn"
            :gameStarted="gameStarted"
            :startGame="startGame"
            :currentTurn="currentTurn"
        />
    </div>
</template>

<script>
import { P2PClient, P2PServer } from './p2p'
import { PubSubClient, handleMessageFromAbly } from './ably'
import { Identity } from './identity'
import CreateGameForm from './components/CreateGameForm'
import GameInfo from './components/GameInfo'

export default {
    name: 'App',
    components: {
        'create-game-form': CreateGameForm,
        'game-info': GameInfo
    },
    data: () => ({
        p2pClient: null,
        p2pServer: null,
        friendlyName: 'Player-' + crypto.getRandomValues(new Uint32Array(1))[0],
        uniqueId: 'Session'
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
        iAmHost: function() {
            return this.p2pServer != null
        },
        currentTurn: function() {
            return this.p2pClient != null
                ? this.p2pClient.state.currentTurn.friendlyName
                : ''
        },
        gameStarted: function() {
            return this.p2pClient != null && this.p2pClient.state.gameStarted
        }
    },
    methods: {
        setFriendlyName: function(evt) {
            this.friendlyName = evt.target.value
        },
        setUniqueId: function(evt) {
            this.uniqueId = evt.target.value
        },
        host: async function(friendlyName, uniqueId) {
            this.friendlyName = friendlyName
            this.uniqueId = uniqueId
            const pubSubClient = new PubSubClient((message, metadata) => {
                handleMessageFromAbly(
                    message,
                    metadata,
                    this.p2pClient,
                    this.p2pServer
                )
            })

            const identity = new Identity(friendlyName)
            this.p2pServer = new P2PServer(identity, uniqueId, pubSubClient)
            this.p2pClient = new P2PClient(identity, uniqueId, pubSubClient)

            await this.p2pServer.connect()
            await this.p2pClient.connect()
        },
        join: async function(friendlyName, uniqueId) {
            this.friendlyName = friendlyName
            this.uniqueId = uniqueId
            const pubSubClient = new PubSubClient((message, metadata) => {
                handleMessageFromAbly(
                    message,
                    metadata,
                    this.p2pClient,
                    this.p2pServer
                )
            })

            const identity = new Identity(friendlyName)
            this.p2pClient = new P2PClient(identity, uniqueId, pubSubClient)

            await this.p2pClient.connect()
        },
        advanceTurn: async function(evt) {
            evt.preventDefault()
            await this.p2pServer.advanceTurn()
        },
        startGame: async function(evt) {
            evt.preventDefault()
            await this.p2pServer.startGame()
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
