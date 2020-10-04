import { useContext } from 'react'
import { P2PContext } from '../lib/p2p/P2PContext'

export default function DisconnectButton() {
  const { disconnect, connectionState } = useContext(P2PContext)
  return (
    <>
      <p>Connection status: {connectionState || 'null'}</p>
      <button type="button" onClick={() => disconnect()}>
        Disconnect client
      </button>
    </>
  )
}