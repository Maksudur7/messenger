// lib/socket.ts - Socket.io singleton manager

import { io, Socket } from 'socket.io-client'
import type { MessageNewEvent, ConversationUpdatedEvent } from './types'

const SOCKET_URL = 'https://frontend-task-chatapp.onrender.com'

let socket: Socket | null = null

export function getSocket(token: string): Socket {
  if (socket && socket.connected) {
    return socket
  }

  if (socket) {
    socket.disconnect()
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
  })

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket?.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason)
  })

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message)
  })

  return socket
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function onMessageNew(
  callback: (message: MessageNewEvent) => void
): () => void {
  if (!socket) return () => {}
  socket.on('message:new', callback)
  return () => socket?.off('message:new', callback)
}

export function onConversationUpdated(
  callback: (conversation: ConversationUpdatedEvent) => void
): () => void {
  if (!socket) return () => {}
  socket.on('conversation:updated', callback)
  return () => socket?.off('conversation:updated', callback)
}

export function emitMessage(
  conversationId: string,
  text: string,
  ack?: (response: unknown) => void
): void {
  if (!socket?.connected) {
    console.warn('[Socket] Cannot send — not connected')
    return
  }
  socket.emit('message:send', { conversationId, text }, ack)
}

export function isSocketConnected(): boolean {
  return socket?.connected ?? false
}
