import * as Ably from 'ably'
import { Identity } from './Identity'

export class AblyClient {
  channel: Ably.Types.RealtimeChannelPromise
  metadata: {
    uniqueId: string
    clientId: string
    friendlyName: string
  }
  ably: Ably.Types.RealtimePromise

  constructor(
    identity: Identity,
    uniqueId: string,
    onConnectionStateChange: (state: Ably.Types.ConnectionStateChange) => void
  ) {
    this.channel = null
    this.metadata = { uniqueId: uniqueId, ...identity }
    // @ts-ignore
    this.ably = new Ably.Realtime.Promise({
      authUrl: '/api/createToken',
    })
    this.ably.connection.on(onConnectionStateChange)
  }

  shouldHandleMessage(message) {
    return (
      message.forClientId == null ||
      !message.forClientId ||
      (message.forClientId && message.forClientId === this.metadata.clientId)
    )
  }

  async connect(callback: (message: Ably.Types.Message) => void) {
    this.channel = await this.ably.channels.get(
      `only-one-${this.metadata.uniqueId}`
    )
    this.channel.subscribe((message) => {
      if (this.shouldHandleMessage(message)) {
        callback(message.data)
      }
    })
  }

  disconnect() {
    this.channel.unsubscribe()
    this.ably.close()
  }

  sendMessage(message, targetClientId?: string) {
    if (!this.channel) {
      throw 'Channel is null'
    }
    message.metadata = this.metadata
    message.forClientId = targetClientId ? targetClientId : null
    this.channel.publish({ name: 'only-one-message', data: message })
  }
}
