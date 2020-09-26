const Ably = require('ably/promises');

exports.createToken = async function(req, res) {
  const client = new Ably.Realtime(process.env.ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: 'ably-azure-static-site-demo',
  });
  res.send(JSON.stringify(tokenRequestData));
};
