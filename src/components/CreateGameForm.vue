<template>
    <form class="form">
        <label for="name-name">Enter your name</label>
        <input type="text" name="name" v-model="friendlyName" />
        <button v-on:click="startHosting" class="form-button form-button--host">
            Host a Session
        </button>
        <button v-on:click="joinGame" class="form-button">
            Join a Session
        </button>
    </form>
</template>

<script>
import { generateRandomGameId, randomAnimal } from '../lib/utils/randomizer.js'

export default {
    name: 'CreateGameForm',
    props: ['host', 'join'],
    data: function() {
        const animal = randomAnimal()
        return {
            friendlyName: animal.charAt(0).toUpperCase() + animal.substring(1),
            gameId: generateRandomGameId()
        }
    },
    created: function() {
        if (window.location.search !== '') {
            const uri = window.location.search.substring(1)
            const params = new URLSearchParams(uri)
            this.gameId = params.get('gameId')
        }
    },
    methods: {
        startHosting: async function(evt) {
            evt.preventDefault()
            this.host(this.friendlyName, this.gameId)
        },
        joinGame: async function(evt) {
            evt.preventDefault()
            this.join(this.friendlyName, this.gameId)
        }
    }
}
</script>
