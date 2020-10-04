<template>
    <section class="game-info">
        <h2>UniqueId: {{ uniqueId }}</h2>
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
    </section>
</template>

<script>
export default {
    name: 'ConnectedPlayersSummary',
    props: ['uniqueId', 'transmittedServerState']
}
</script>
