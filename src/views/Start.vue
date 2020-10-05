<template>
    <div id="app">
        <h1>only one</h1>
        <create-game-form />
    </div>
</template>

<script>
import CreateGameForm from '../components/CreateGameForm'

export default {
    name: 'Start',
    components: {
        'create-game-form': CreateGameForm
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
