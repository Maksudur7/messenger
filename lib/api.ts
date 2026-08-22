// lib/api.ts - Type-safe REST API client

import type {
  User,
  LoginRequest,
  LoginResponse,
  Conversation,
  ConversationsResponse,
  Message,
  MessagesResponse,
  StartConversationResponse,
  SendMessageRequest,
  CreateGroupRequest,
  AddParticipantsRequest,
  PromoteAdminRequest,
  RenameGroupRequest,
  ApiError,
} from './types'

const BASE_URL = 'https://frontend-task-chatapp.onrender.com/api'

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('chat_token')
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`
      try {
        const errorBody = await response.json()
        errorMessage = errorBody?.error?.message || errorMessage
      } catch {
        // Ignore parse error, use generic message
      }

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
      }
      throw error
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T
    }

    return response.json() as Promise<T>
  }

  // --- Auth ---

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {}, // No auth token needed for login
    })
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me')
  }

  // --- Users ---

  async searchUsers(q: string): Promise<User[]> {
    return this.request<User[]>(
      `/users/search?q=${encodeURIComponent(q)}`
    )
  }

  // --- Conversations ---

  async getConversations(): Promise<Conversation[]> {
    const response = await this.request<ConversationsResponse>('/conversations')
    return response.data
  }

  async startDirectConversation(
    userId: string
  ): Promise<StartConversationResponse> {
    return this.request<StartConversationResponse>('/conversations', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
  }

  async createGroup(data: CreateGroupRequest): Promise<Conversation> {
    return this.request<Conversation>('/conversations/group', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getMessages(
    conversationId: string,
    limit = 30,
    before?: string
  ): Promise<MessagesResponse> {
    const params = new URLSearchParams({ limit: String(limit) })
    if (before) params.set('before', before)
    return this.request<MessagesResponse>(
      `/conversations/${conversationId}/messages?${params}`
    )
  }

  async addParticipants(
    groupId: string,
    data: AddParticipantsRequest
  ): Promise<Conversation> {
    return this.request<Conversation>(
      `/conversations/${groupId}/participants`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async removeParticipant(
    groupId: string,
    userId: string
  ): Promise<Conversation> {
    return this.request<Conversation>(
      `/conversations/${groupId}/participants/${userId}`,
      { method: 'DELETE' }
    )
  }

  async promoteToAdmin(
    groupId: string,
    data: PromoteAdminRequest
  ): Promise<Conversation> {
    return this.request<Conversation>(
      `/conversations/${groupId}/admins`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async renameGroup(
    groupId: string,
    data: RenameGroupRequest
  ): Promise<Conversation> {
    return this.request<Conversation>(
      `/conversations/${groupId}`,
      { method: 'PATCH', body: JSON.stringify(data) }
    )
  }

  async deleteConversation(conversationId: string): Promise<void> {
    return this.request<void>(`/conversations/${conversationId}`, {
      method: 'DELETE',
    })
  }

  // --- Messages ---

  async sendMessage(data: SendMessageRequest): Promise<Message> {
    return this.request<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}


export const api = new ApiClient()
