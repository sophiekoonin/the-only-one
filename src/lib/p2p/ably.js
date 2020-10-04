import * as Ably from 'ably'

function shouldHandleMessage(message, metadata) {
    return (
        message.forClientId == null ||
        !message.forClientId ||
        (message.forClientId && message.forClientId === metadata.clientId)
    )
}

export function handleMessageFromAbly(message, metadata, p2pClient, p2pServer) {
    if (shouldHandleMessage(message, metadata)) {
        p2pServer?.onReceiveMessage(message)
        p2pClient?.onReceiveMessage(message)
    }
}

export class PubSubClient {
    constructor(onMessageReceivedCallback) {
        this.connected = false
        this.onMessageReceivedCallback = onMessageReceivedCallback
    }

    async connect(identity, gameId) {
        if (this.connected) return

        this.metadata = { gameId: gameId, ...identity }

        const ably = new Ably.Realtime.Promise({
            authUrl: '/api/createToken'
        })
        this.channel = await ably.channels.get(`only-one-${gameId}`, {
            params: { rewind: '1m' }
        })

        this.channel.subscribe(message => {
            this.onMessageReceivedCallback(message.data, this.metadata)
        })

        this.connected = true
    }

    sendMessage(message, targetClientId) {
        if (!this.connected) {
            throw 'Client is not connected'
        }

        message.metadata = this.metadata
        message.forClientId = targetClientId ? targetClientId : null
        this.channel.publish({ name: 'only-one-message', data: message })
    }
}
