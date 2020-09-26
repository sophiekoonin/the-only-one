<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <p>
      Client State:
      {{
        state == null
          ? 'null :('
          : state.status == undefined
          ? 'Disconnected'
          : state.status
      }}
    </p>
  </div>
</template>

<script>
import { P2PClient, P2PServer } from './p2p';
import { PubSubClient, handleMessageFromAbly } from './ably';
import { Identity } from './identity';

export default {
  name: 'App',
  data: () => ({
    p2pClient: null,
    p2pServer: null,
    friendlyName: 'Player-' + crypto.getRandomValues(new Uint32Array(1))[0],
    uniqueId: 'Session',
  }),
  computed: {
    state: function() {
      return this.p2pClient != null ? this.p2pClient.state : null;
    },
    transmittedServerState: function() {
      return this.p2pClient != null ? this.p2pClient.serverState : null;
    },
    joinedOrHosting: function() {
      return this.p2pClient != null || this.p2pServer != null;
    },
    iAmHost: function() {
      return this.p2pServer != null;
    },
  },
  methods: {
    host: async function(evt) {
      evt.preventDefault();

      const pubSubClient = new PubSubClient((message, metadata) => {
        handleMessageFromAbly(
          message,
          metadata,
          this.p2pClient,
          this.p2pServer
        );
      });

      const identity = new Identity(this.friendlyName);
      this.p2pServer = new P2PServer(identity, this.uniqueId, pubSubClient);
      this.p2pClient = new P2PClient(identity, this.uniqueId, pubSubClient);

      await this.p2pServer.connect();
      await this.p2pClient.connect();
    },
    join: async function(evt) {
      evt.preventDefault();

      const pubSubClient = new PubSubClient((message, metadata) => {
        handleMessageFromAbly(
          message,
          metadata,
          this.p2pClient,
          this.p2pServer
        );
      });

      const identity = new Identity(this.friendlyName);
      this.p2pClient = new P2PClient(identity, this.uniqueId, pubSubClient);

      await this.p2pClient.connect();
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
