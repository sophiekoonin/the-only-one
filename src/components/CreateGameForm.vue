<template>
    <form class="form">
        <label for="name-name">Enter your name</label>
        <input type="text" name="name" v-model="friendlyName" />
        <button v-on:click="startHosting" class="form-button form-button--host">
            Host a Session
        </button>
    </form>
</template>

<script>
import { generateRandomGameId, randomAnimal } from '../lib/utils/randomizer.js'
import { mapActions } from 'vuex'
export default {
    name: 'CreateGameForm',
    data: function() {
        const animal = randomAnimal()
        return {
            friendlyName: animal.charAt(0).toUpperCase() + animal.substring(1),
            gameId: generateRandomGameId()
        }
    },
    methods: {
        ...mapActions(['host']),
        startHosting: function(evt) {
            console.log(this)
            evt.preventDefault()
            this.host({ friendlyName: this.friendlyName, gameId: this.gameId })
            this.$router.push(`/${this.gameId}`)
        }
    }
}
</script>
