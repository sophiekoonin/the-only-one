<template>
    <form class="form">
        <label for="session-name">Enter a name for your session</label>
        <input type="text" name="session-name" v-model="uniqueId" />
        <label for="name-name">Enter your name</label>
        <input type="text" name="name" v-model="friendlyName" />

        <button v-on:click="host" class="form-button form-button--host">
            Host a Session
        </button>
        <button v-on:click="join" class="form-button">Join a Session</button>
    </form>
</template>

<script>
export default {
    name: 'CreateGameForm',
    props: ['host', 'join', 'friendlyName', 'uniqueId']
}
</script>
