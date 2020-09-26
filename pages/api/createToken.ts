import * as Ably from 'ably/promises'
import { NowRequest, NowResponse } from '@vercel/node'

export default async (_: NowRequest, res: NowResponse) => {
  const client = new Ably.Realtime(process.env.ABLY_API_KEY)
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: 'only-one',
  })
  res.json(tokenRequestData)
}
