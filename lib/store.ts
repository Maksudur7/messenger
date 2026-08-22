// lib/store.ts - Zustand v5 global state management

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Conversation, Message } from './types'

// --- Auth Token Persistence Helpers ---

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  const localToken = localStorage.getItem('chat_token')
  if (localToken) return localToken

  const match = document.cookie.match(/(?:^|; )chat_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) {
    localStorage.setItem('chat_token', token)
    document.cookie = `chat_token=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`
  } else {
    localStorage.removeItem('chat_token')
    document.cookie = 'chat_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

// --- Auth Store ---

interface AuthState {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: getStoredToken(),
      login: (user, token) => {
        setStoredToken(token)
        set({ user, token })
      },
      logout: () => {
        setStoredToken(null)
        set({ user: null, token: null })
      },
    }),
    {
      name: 'chat_auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)


// --- Chat Store ---

interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  messages: Record<string, Message[]>         // keyed by conversationId
  hasMore: Record<string, boolean>             // keyed by conversationId
  drafts: Record<string, string>              // BONUS: draft persistence per conversation
  readConversations: Record<string, number>    // timestamp when conversation was last seen/read
  deletedConversationIds: string[]             // persistent list of deleted conversation IDs
  isLoadingConversations: boolean
  isLoadingMessages: boolean
  conversationsError: string | null
  messagesError: string | null

  // Actions
  setConversations: (conversations: Conversation[]) => void
  setActiveConversation: (id: string | null) => void
  markAsRead: (id: string) => void
  restoreConversation: (conversationId: string) => void
  prependConversation: (conversation: Conversation) => void
  updateConversation: (conversation: Conversation) => void
  deleteConversation: (conversationId: string) => void
  setMessages: (conversationId: string, messages: Message[], hasMore: boolean) => void
  prependMessages: (conversationId: string, messages: Message[], hasMore: boolean) => void
  addMessage: (conversationId: string, message: Message) => void
  updateMessage: (conversationId: string, tempId: string, updatedMessage: Message) => void
  removeMessage: (conversationId: string, tempId: string) => void
  editMessage: (conversationId: string, messageId: string, newText: string) => void
  deleteMessage: (conversationId: string, messageId: string) => void
  setDraft: (conversationId: string, text: string) => void
  setLoadingConversations: (loading: boolean) => void
  setLoadingMessages: (loading: boolean) => void
  setConversationsError: (error: string | null) => void
  setMessagesError: (error: string | null) => void
  updateLastMessage: (conversationId: string, text: string, sender: string) => void
}

function deduplicateMessages(msgs: Message[]): Message[] {
  const seen = new Set<string>()
  const result: Message[] = []
  for (const m of msgs) {
    const key = m._id || m.tempId
    if (key && seen.has(key)) continue
    if (key) seen.add(key)
    result.push(m)
  }
  return result
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      messages: {},
      hasMore: {},
      drafts: {},
      readConversations: {},
      deletedConversationIds: [],
      isLoadingConversations: false,
      isLoadingMessages: false,
      conversationsError: null,
      messagesError: null,

      setConversations: (conversations) =>
        set((state) => ({
          conversations: conversations.filter((c) => !state.deletedConversationIds.includes(c._id)),
          isLoadingConversations: false,
          conversationsError: null,
        })),

      setActiveConversation: (id) =>
        set((state) => ({
          activeConversationId: id,
          messagesError: null,
          readConversations: id ? { ...state.readConversations, [id]: Date.now() } : state.readConversations,
        })),

      markAsRead: (id) =>
        set((state) => ({
          readConversations: { ...state.readConversations, [id]: Date.now() },
        })),

      restoreConversation: (conversationId) =>
        set((state) => ({
          deletedConversationIds: state.deletedConversationIds.filter((id) => id !== conversationId),
        })),

      prependConversation: (conversation) =>
        set((state) => ({
          deletedConversationIds: state.deletedConversationIds.filter((id) => id !== conversation._id),
          conversations: [
            conversation,
            ...state.conversations.filter((c) => c._id !== conversation._id),
          ],
        })),

      updateConversation: (conversation) =>
        set((state) => {
          if (state.deletedConversationIds.includes(conversation._id)) return state
          return {
            conversations: state.conversations.map((c) =>
              c._id === conversation._id ? { ...c, ...conversation } : c
            ),
          }
        }),


      deleteConversation: (conversationId) =>
        set((state) => ({
          deletedConversationIds: state.deletedConversationIds.includes(conversationId)
            ? state.deletedConversationIds
            : [...state.deletedConversationIds, conversationId],
          conversations: state.conversations.filter((c) => c._id !== conversationId),
          activeConversationId:
            state.activeConversationId === conversationId ? null : state.activeConversationId,
        })),


  setMessages: (conversationId, messages, hasMore) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: deduplicateMessages(messages) },
      hasMore: { ...state.hasMore, [conversationId]: hasMore },
      isLoadingMessages: false,
      messagesError: null,
    })),

  prependMessages: (conversationId, messages, hasMore) =>
    set((state) => {
      const existing = state.messages[conversationId] ?? []
      const combined = deduplicateMessages([...messages, ...existing])
      return {
        messages: { ...state.messages, [conversationId]: combined },
        hasMore: { ...state.hasMore, [conversationId]: hasMore },
      }
    }),

  addMessage: (conversationId, message) =>
    set((state) => {
      const existing = state.messages[conversationId] ?? []
      // Check if message already exists by _id or tempId
      const isDuplicate = existing.some(
        (m) =>
          (m._id && message._id && m._id === message._id) ||
          (m.tempId && message.tempId && m.tempId === message.tempId)
      )
      if (isDuplicate) return state
      return {
        messages: {
          ...state.messages,
          [conversationId]: deduplicateMessages([...existing, message]),
        },
      }
    }),

  updateMessage: (conversationId, tempId, updatedMessage) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] ?? []).map((m) =>
          m.tempId === tempId || m._id === tempId ? { ...m, ...updatedMessage } : m
        ),
      },
    })),

  removeMessage: (conversationId, tempId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] ?? []).filter(
          (m) => m.tempId !== tempId && m._id !== tempId
        ),
      },
    })),

  editMessage: (conversationId, messageId, newText) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] ?? []).map((m) =>
          m._id === messageId || m.tempId === messageId
            ? { ...m, text: newText, isEdited: true }
            : m
        ),
      },
    })),

  deleteMessage: (conversationId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] ?? []).filter(
          (m) => m._id !== messageId && m.tempId !== messageId
        ),
      },
    })),

  setDraft: (conversationId, text) =>
    set((state) => ({
      drafts: { ...state.drafts, [conversationId]: text },
    })),

  setLoadingConversations: (loading) =>
    set({ isLoadingConversations: loading }),

  setLoadingMessages: (loading) =>
    set({ isLoadingMessages: loading }),

  setConversationsError: (error) =>
    set({ conversationsError: error, isLoadingConversations: false }),

  setMessagesError: (error) =>
    set({ messagesError: error, isLoadingMessages: false }),

  updateLastMessage: (conversationId, text, sender) =>
    set((state) => {
      const now = new Date().toISOString()
      const target = state.conversations.find((c) => c._id === conversationId)
      if (!target) return state

      const updatedConv: Conversation = {
        ...target,
        lastMessage: { text, sender, createdAt: now },
        updatedAt: now,
      }

      // Bump conversation to the very top of the list!
      return {
        conversations: [
          updatedConv,
          ...state.conversations.filter((c) => c._id !== conversationId),
        ],
      }
    }),
    }),
    {
      name: 'chat_store',
      partialize: (state) => ({
        drafts: state.drafts,
        readConversations: state.readConversations,
        deletedConversationIds: state.deletedConversationIds,
      }),
    }
  )
)



