<template>
    <section class="game-info">
        <h2>UniqueId: {{ uniqueId }}</h2>
        <button v-if="iAmHost" v-on:click="sendWordsAsHost" class="form-button">
            Stream words to client
        </button>
        <h3>
            Active players:
            {{
                transmittedServerState != null
                    ? transmittedServerState.players.length
                    : 0
            }}
        </h3>
        <ul
            v-if="
                transmittedServerState != null &&
                    transmittedServerState.players != null
            "
            class="players"
        >
            <li
                class="player"
                v-bind:key="user.friendlyName"
                v-for="user in transmittedServerState.players"
            >
                <span>{{ user.friendlyName }}</span>
            </li>
        </ul>
        <div>
            {{ receivedWords }}
        </div>
    </section>
</template>

<script>
export default {
    name: 'GameInfo',
    props: [
        'uniqueId',
        'transmittedServerState',
        'iAmHost',
        'sendWordsAsHost',
        'receivedWords'
    ]
}
</script>
