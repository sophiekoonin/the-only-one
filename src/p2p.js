export class P2PClient {
  constructor(identity, uniqueId, ably) {
    this.identity = identity;
    this.uniqueId = uniqueId;
    this.ably = ably;

    this.serverState = null;
    this.state = { status: 'disconnected' };
  }
  async connect() {
    await this.ably.connect(this.identity, this.uniqueId);

    this.ably.sendMessage({ kind: 'connected' });
    this.state.status = 'awaiting-acknowledgement';
  }
  onReceiveMessage(message) {
    if (message.serverState) {
      this.serverState = message.serverState;
    }

    switch (message.kind) {
      case 'connection-acknowledged':
        this.state.status = 'acknowledged';
        break;
      default:
        () => {};
    }
  }
}

export class P2PServer {
  constructor(identity, uniqueId, ably) {
    this.identity = identity;
    this.uniqueId = uniqueId;
    this.ably = ably;

    this.state = { players: [] };
  }
  async connect() {
    await this.ably.connect(this.identity, this.uniqueId);
  }
  onReceiveMessage(message) {
    switch (message.kind) {
      case 'connected':
        this.onClientConnected(message);
        break;
      default:
        () => {};
    }
  }
  onClientConnected(message) {
    this.state.players.push(message.metadata);
    this.ably.sendMessage(
      { kind: 'connection-acknowledged', serverState: this.state },
      message.metadata.clientId
    );
    this.ably.sendMessage({ kind: 'peer-status', serverState: this.state });
  }
}
