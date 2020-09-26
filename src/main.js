import Vue from 'vue';
import App from './App.vue';
import Ably from 'ably';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');

class PubSubClient {
  constructor(onMessageReceivedCallback) {
    this.connected = false;
    this.onMessageReceivedCallback = onMessageReceivedCallback;
  }

  async connect(identity, uniqueId) {
    if (this.connected) return;

    this.metadata = { uniqueId: uniqueId, ...identity };

    const ably = new Ably.Realtime.Promise({
      authUrl: '/api/?name=createTokenRequest',
    });
    this.channel = await ably.channels.get(`only-one-${uniqueId}`);

    this.channel.subscribe((message) => {
      this.onMessageReceivedCallback(message.data, this.metadata);
    });

    this.connected = true;
  }

  sendMessage(message, targetClientId) {
    if (!this.connected) {
      throw 'Client is not connected';
    }

    message.metadata = this.metadata;
    message.forClientId = targetClientId ? targetClientId : null;
    this.channel.publish({ name: 'only-one-message', data: message });
  }
}
