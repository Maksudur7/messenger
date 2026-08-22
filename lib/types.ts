// lib/types.ts - All TypeScript interfaces for the chat application

export interface User {
  _id: string
  name: string
  phone: string
  createdAt: string
}

export interface LastMessage {
  text: string
  sender: string
  senderName?: string
  createdAt: string
}

export interface DirectConversation {
  _id: string
  type: 'direct'
  participant: User
  lastMessage: Partial<LastMessage>
  updatedAt: string
}

export interface GroupConversation {
  _id: string
  type: 'group'
  name: string
  createdBy: string
  admins: string[]
  participants: User[]
  lastMessage: Partial<LastMessage>
  updatedAt: string
}

export type Conversation = DirectConversation | GroupConversation

export interface Message {
  _id: string
  conversation: string
  sender: string
  senderName?: string
  text: string
  createdAt: string
  // Optimistic UI state & local edits (client-side only)
  status?: 'sending' | 'sent' | 'error'
  tempId?: string
  isEdited?: boolean
}

export interface MessagesResponse {
  messages: Message[]
  hasMore: boolean
}

export interface ConversationsResponse {
  data: Conversation[]
}

export interface LoginRequest {
  phone: string
  name: string
}

export interface LoginResponse {
  token: string
  user: User
}

// Minimal shape returned by POST /conversations (start direct)
export interface StartConversationResponse {
  _id: string
  participants: string[]
  createdAt: string
}

export interface SendMessageRequest {
  conversationId: string
  text: string
}

export interface CreateGroupRequest {
  name: string
  participantIds: string[]
}

export interface AddParticipantsRequest {
  userIds: string[]
}

export interface PromoteAdminRequest {
  userId: string
}

export interface RenameGroupRequest {
  name: string
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

// Socket.io event payloads
export interface MessageNewEvent {
  _id: string
  conversation: string
  sender: string
  text: string
  createdAt: string
}

export interface ConversationUpdatedEvent extends GroupConversation {}
