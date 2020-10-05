import Vue from 'vue'
import Vuex from 'vuex'
import { generateRandomGameId, randomAnimal } from '../utils/randomizer'

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
        isHost: state => state.p2pServer != null
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
    actions: {}
})
