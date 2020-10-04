<script>
export default {
    name: 'InviteLink',
    props: ['gameId'],
    data: function() {
        return {
            gameIdString: this.gameId
        }
    },
    methods: {
        copyLink: async function() {
            navigator.clipboard.writeText(this.inviteLink)
        }
    },
    computed: {
        inviteLink: function() {
            const { protocol, host } = window.location
            return `${protocol}//${host}/?gameId=${this.gameIdString}&join=true`
        }
    }
}
</script>
<template>
    <div class="invite-link">
        <h2 class="section-heading">Invite your friends!</h2>
        <p>Share this link to invite people to play:</p>
        <div>
            <span id="copyLinkInputBox" class="copy-link-text">{{
                gameId
            }}</span>
            <input
                type="button"
                v-on:click="copyLink"
                class="copy-link"
                value="Copy link"
            />
        </div>
    </div>
</template>
