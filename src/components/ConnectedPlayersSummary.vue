<template>
    <section class="game-info">
        <h3>
            Active players:
            {{ state != null ? state.players.length : 0 }}
        </h3>
        <ul v-if="state != null && state.players != null" class="players">
            <li
                class="player"
                v-bind:key="user.friendlyName"
                v-for="user in state.players"
            >
                <span>{{ user.friendlyName }}</span>
            </li>
        </ul>
    </section>
</template>

<script>
export default {
    name: 'ConnectedPlayersSummary',
    props: ['state']
}
</script>
