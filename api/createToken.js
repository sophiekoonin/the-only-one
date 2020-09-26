const Ably = require('ably/promises');

module.exports = async function(req, res) {
  const client = new Ably.Realtime(process.env.ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: 'dont-say-the-word',
  });
  res.send(JSON.stringify(tokenRequestData));
};
