const Ably = require('ably/promises')

module.exports = async function(req, res) {
    const client = new Ably.Realtime(process.env.ABLY_API_KEY)
    const tokenRequestData = await client.auth.createTokenRequest({
        clientId: 'only-one'
    })
    res.json(tokenRequestData).send()
}
