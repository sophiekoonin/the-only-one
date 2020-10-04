<template>
    <form class="form">
        <label for="session-name">Enter a name for your session</label>
        <input type="text" name="session-name" v-model="gameId" />
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
export default {
    name: 'CreateGameForm',
    props: ['host', 'join', 'defaultFriendlyName', 'defaultGameId'],
    data: function() {
        return {
            friendlyName: this.defaultFriendlyName,
            gameId: this.defaultGameId
        }
    },
    created: function() {
        const uri = window.location.search.substring(1)
        const params = new URLSearchParams(uri)
        this.gameId = params.get('gameId')
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
