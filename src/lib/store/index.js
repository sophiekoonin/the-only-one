import Vue from 'vue'
import Vuex from 'vuex'
import { generateRandomGameId, randomAnimal } from '../utils/randomizer'
import { P2PClient } from '../p2p/p2pClient'
import { P2PServer } from '../p2p/p2pServer'
import { PubSubClient, handleMessageFromAbly } from '../p2p/ably'
import { Identity } from '../utils/identity'
Vue.use(Vuex)

const animal = randomAnimal()

export default new Vuex.Store({
    state: {
        p2pClient: null,
        p2pServer: null,
        friendlyName: animal.charAt(0).toUpperCase() + animal.substring(1),
        gameId: generateRandomGameId()
    },
    getters: {
        clientId: state => state.p2pClient?.identity?.clientId,
        clientState: state => state.p2pClient?.state,
        serverState: state => state.p2pClient?.serverState,
        turnPlayer: state => state.serverState()?.turnPlayer,
        isCluePlayer: state => {
            const turnPlayer = state.turnPlayer()
            const clientId = state.clientId()
            return (
                turnPlayer != null &&
                clientId != null &&
                turnPlayer !== clientId
            )
        },
        gameClient: state => state.p2pClient?.gameClient,
        isHost: state => state.p2pServer != null,
        hasJoined: state => state.p2pClient != null
    },
    mutations: {
        setP2pClient(state, client) {
            state.p2pClient = client
        },
        setP2pServer(state, server) {
            state.p2pServer = server
        },
        setFriendlyName(state, name) {
            state.friendlyName = name
        },
        setGameId(state, gameId) {
            state.gameId = gameId
        }
    },
    actions: {
        async host({ commit, state }, gameData) {
            console.log({ gameData })
            const { gameId, friendlyName } = gameData
            commit('setFriendlyName', friendlyName)
            commit('setGameId', gameId)
            const pubSubClient = new PubSubClient((message, metadata) => {
                handleMessageFromAbly(
                    message,
                    metadata,
                    state.p2pClient,
                    state.p2pServer
                )
            })

            const identity = new Identity(friendlyName)
            const p2pServer = new P2PServer(identity, gameId, pubSubClient)
            const p2pClient = new P2PClient(identity, gameId, pubSubClient)
            commit('setP2pServer', p2pServer)
            commit('setP2pClient', p2pClient)
            await state.p2pServer.connect()
            await state.p2pClient.connect()
        },
        async join({ commit, state }, gameData) {
            const { gameId, friendlyName } = gameData
            commit('setFriendlyName', friendlyName)
            commit('setGameId', gameId)
            const pubSubClient = new PubSubClient((message, metadata) => {
                handleMessageFromAbly(
                    message,
                    metadata,
                    state.p2pClient,
                    state.p2pServer
                )
            })
            const identity = new Identity(friendlyName)
            const p2pClient = new P2PClient(identity, gameId, pubSubClient)
            commit('setP2pClient', p2pClient)
            await state.p2pClient.connect()
        },
        async startGame({ state }) {
            await state.p2pServer?.startGame()
        }
    }
})
