# Chat API Documentation

> **Version:** 1.0.0  
> **Base URL (REST):** `https://frontend-task-chatapp.onrender.com/api`  
> **Base URL (WebSocket):** `https://frontend-task-chatapp.onrender.com`  
> **Protocol:** REST over HTTPS + Socket.io (WebSocket)

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [Auth](#auth)
   - [Users](#users)
   - [Conversations](#conversations)
   - [Messages](#messages)
   - [Groups](#groups)
   - [System](#system)
4. [WebSocket (Socket.io)](#websocket-socketio)
5. [Error Handling](#error-handling)
6. [Observed Quirks & Edge Cases](#observed-quirks--edge-cases)

---

## Overview

This API powers a real-time 1-to-1 and group chat application. It exposes:

- **REST endpoints** under `/api` for all CRUD operations (auth, conversations, messages, group management).
- **Socket.io WebSocket** at the root origin for real-time event streaming.

The API intentionally does **not** separate registration from login — a single `POST /auth/login` call handles both flows. If the phone number is new, an account is created; if it exists, the user is authenticated and returned a JWT.

---

## Authentication

### Flow

1. Call `POST /api/auth/login` with `{ phone, name }`.
2. The response returns a `token` (JWT) and `user` object.
3. Include the token in all subsequent REST requests:
   ```
   Authorization: Bearer <token>
   ```
4. For WebSocket connections, pass the token in the Socket.io handshake:
   ```js
   io('https://frontend-task-chatapp.onrender.com', { auth: { token } })
   ```

### Token Lifetime

Tokens expire after approximately 7 days (observed from JWT `exp` field). On expiry, re-authenticate via `POST /auth/login`.

---

## Endpoints

---

### Auth

#### `POST /api/auth/login`

Log in or register a user in a single step.

- **Auth required:** No
- **Content-Type:** `application/json`

**Request Body:**

```json
{
  "phone": "+15551234567",
  "name": "Ada Lovelace"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phone` | string | ✅ | Phone number. If new, the account is created automatically. |
| `name` | string | ✅ | Display name for the user. |

**Response `200 OK`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6a882468e5d6aac97521e25e",
    "name": "Ada Lovelace",
    "phone": "+15551234567",
    "createdAt": "2026-08-21T10:11:52.529Z"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `token` | string | JWT bearer token. Include in `Authorization` header for all protected requests. |
| `user._id` | string | Unique user identifier (MongoDB ObjectId). |
| `user.name` | string | Display name. |
| `user.phone` | string | Phone number. |
| `user.createdAt` | string | ISO 8601 timestamp of account creation. |

---

#### `GET /api/auth/me`

Fetch the currently authenticated user's profile. Used for session restoration on page load.

- **Auth required:** Yes

**Response `200 OK`:**

```json
{
  "_id": "6a882468e5d6aac97521e25e",
  "name": "Ada Lovelace",
  "phone": "+15551234567",
  "createdAt": "2026-08-21T10:11:52.529Z"
}
```

**Error `401 Unauthorized`:** Invalid or expired token.

---

### Users

#### `GET /api/users/search?q={query}`

Search for other users by name or phone number.

- **Auth required:** Yes

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | ✅ | Search term — partial name or phone number. |

**Response `200 OK`:**

```json
[
  {
    "_id": "6a8826abe5d6aac97521e28f",
    "name": "Alice",
    "phone": "+12345678901"
  },
  {
    "_id": "6a8826dce5d6aac97521e2ba",
    "name": "Alice Test",
    "phone": "+11122233344"
  }
]
```

Returns an array of matching users (excluding the current user). Empty array `[]` if no matches.

> **Note:** Results include the searching user in results — client should filter out self by `_id`.

---

### Conversations

#### `GET /api/conversations`

Fetch all conversations the authenticated user is part of (both direct and group).

- **Auth required:** Yes

**Response `200 OK`:**

```json
{
  "data": [
    {
      "_id": "6a887e5fe5d6aac975234ef2",
      "type": "direct",
      "participant": {
        "_id": "6a887e5de5d6aac975234ed5",
        "name": "Bob",
        "phone": "+19998887702"
      },
      "lastMessage": {
        "text": "Hello Bob!",
        "sender": "6a8857e3e5d6aac975225707",
        "createdAt": "2026-08-21T16:35:44.331Z"
      },
      "updatedAt": "2026-08-21T16:35:44.566Z"
    },
    {
      "_id": "6a887e62e5d6aac975234f07",
      "type": "group",
      "name": "Project Alpha",
      "createdBy": "6a8857e3e5d6aac975225707",
      "admins": ["6a8857e3e5d6aac975225707"],
      "participants": [
        { "_id": "6a8857e3e5d6aac975225707", "name": "Alice", "phone": "+19998887701" },
        { "_id": "6a887e5de5d6aac975234ed5", "name": "Bob", "phone": "+19998887702" }
      ],
      "lastMessage": {},
      "updatedAt": "2026-08-21T16:35:46.603Z"
    }
  ]
}
```

Conversations are sorted by `updatedAt` descending (most recently active first).

**Direct conversation fields:**

| Field | Description |
|-------|-------------|
| `type` | `"direct"` |
| `participant` | The other user's profile `{ _id, name, phone }` |
| `lastMessage` | May be empty `{}` if no messages sent yet |

**Group conversation fields:**

| Field | Description |
|-------|-------------|
| `type` | `"group"` |
| `name` | Group display name |
| `createdBy` | User `_id` of creator |
| `admins` | Array of user `_id`s with admin privileges |
| `participants` | Array of `{ _id, name, phone }` for all members |
| `lastMessage` | May be empty `{}` if no messages sent yet |

---

#### `POST /api/conversations`

Start a new direct (1-to-1) conversation, or retrieve an existing one between the same two users.

- **Auth required:** Yes
- **Content-Type:** `application/json`

**Request Body:**

```json
{
  "userId": "6a887e5de5d6aac975234ed5"
}
```

**Response `200 OK` / `201 Created`:**

```json
{
  "_id": "6a887e5fe5d6aac975234ef2",
  "participants": [
    "6a8857e3e5d6aac975225707",
    "6a887e5de5d6aac975234ed5"
  ],
  "createdAt": "2026-08-21T16:35:43.344Z"
}
```

> **⚠️ Quirk:** The response for a new direct conversation is minimal — it does **not** include `type`, `participant` object, or `lastMessage`. These are only present in the `GET /conversations` list response. Client code must handle this discrepancy.

---

#### `GET /api/conversations/{id}/messages`

Retrieve paginated message history for a conversation.

- **Auth required:** Yes

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | Conversation `_id` |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Max messages per page. Default appears to be 20. |
| `before` | string | No | Cursor for older-page pagination. Pass a `message._id` to fetch messages older than that message. |

**Response `200 OK`:**

```json
{
  "messages": [
    {
      "_id": "6a887e60e5d6aac975234efc",
      "conversation": "6a887e5fe5d6aac975234ef2",
      "sender": "6a8857e3e5d6aac975225707",
      "text": "Hello Bob! How are you?",
      "createdAt": "2026-08-21T16:35:44.331Z"
    }
  ],
  "hasMore": false
}
```

Messages are returned in **chronological order** (oldest first). Use `hasMore: true` to detect that older messages exist, and pass `before=<oldest_message_id>` for the next page.

---

### Messages

#### `POST /api/messages`

Send a message to a conversation (direct or group).

- **Auth required:** Yes
- **Content-Type:** `application/json`

**Request Body:**

```json
{
  "conversationId": "6a887e5fe5d6aac975234ef2",
  "text": "Hello!"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `conversationId` | string | ✅ | The `_id` of the target conversation. |
| `text` | string | ✅ | Message content. Empty strings should be rejected client-side. |

**Response `201 Created`:**

```json
{
  "_id": "6a887e60e5d6aac975234efc",
  "conversation": "6a887e5fe5d6aac975234ef2",
  "sender": "6a8857e3e5d6aac975225707",
  "text": "Hello!",
  "createdAt": "2026-08-21T16:35:44.331Z"
}
```

> **Note:** Sending via REST also triggers the `message:new` WebSocket event for all participants in the conversation — so you **do not** need to update local state manually after a successful REST send; the socket event handles it.

---

### Groups

#### `POST /api/conversations/group`

Create a new group conversation.

- **Auth required:** Yes
- **Content-Type:** `application/json`

**Request Body:**

```json
{
  "name": "Project Team",
  "participantIds": [
    "6a887e5de5d6aac975234ed5",
    "6a887e5ee5d6aac975234ee4"
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Display name for the group. |
| `participantIds` | string[] | ✅ | `_id`s of members to add (not including self — the creator is added automatically as admin). Minimum 2 others required (for a group of 3+). |

**Response `201 Created`:**

```json
{
  "_id": "6a887e62e5d6aac975234f07",
  "type": "group",
  "name": "Project Team",
  "createdBy": "6a8857e3e5d6aac975225707",
  "admins": ["6a8857e3e5d6aac975225707"],
  "participants": [
    { "_id": "6a8857e3e5d6aac975225707", "name": "Alice", "phone": "+19998887701" },
    { "_id": "6a887e5de5d6aac975234ed5", "name": "Bob", "phone": "+19998887702" },
    { "_id": "6a887e5ee5d6aac975234ee4", "name": "Charlie", "phone": "+19998887703" }
  ],
  "createdAt": "2026-08-21T16:35:46.603Z",
  "updatedAt": "2026-08-21T16:35:46.603Z"
}
```

---

#### `POST /api/conversations/{id}/participants`

Add one or more members to an existing group. Admin-only.

- **Auth required:** Yes (must be a group admin)

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | Group conversation `_id` |

**Request Body:**

```json
{
  "userIds": ["6a887e5de5d6aac975234ed5"]
}
```

**Response `200 OK`:** Updated group conversation object.

---

#### `DELETE /api/conversations/{id}/participants/{userId}`

Remove a member from a group, or leave the group yourself.

- **Auth required:** Yes
  - **Admin:** Can remove any member.
  - **Member:** Can only pass their own `userId` to leave the group.

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `id` | Group conversation `_id` |
| `userId` | The `_id` of the user to remove. Pass your own `_id` to leave. |

**Response `200 OK`:** Updated group conversation object.

---

#### `POST /api/conversations/{id}/admins`

Promote an existing group member to admin. Admin-only.

- **Auth required:** Yes (must be a group admin)

**Request Body:**

```json
{
  "userId": "6a887e5de5d6aac975234ed5"
}
```

**Response `200 OK`:** Updated group conversation object.

---

#### `PATCH /api/conversations/{id}`

Rename a group conversation. Admin-only.

- **Auth required:** Yes (must be a group admin)

**Request Body:**

```json
{
  "name": "New Group Name"
}
```

**Response `200 OK`:** Updated group conversation object.

---

### System

#### `GET /health`

Simple health check endpoint.

- **Auth required:** No
- **Base URL:** Root (not `/api`) — `https://frontend-task-chatapp.onrender.com/health`

**Response `200 OK`:**

```json
{ "status": "ok" }
```

---

## WebSocket (Socket.io)

### Connection

Connect to the **root origin** (not `/api`):

```js
import { io } from 'socket.io-client'

const socket = io('https://frontend-task-chatapp.onrender.com', {
  auth: { token: '<JWT_TOKEN>' }
})
```

> ⚠️ **Critical:** The Socket.io server lives at the root host. Connecting to `.../api/socket.io` will fail. The JWT must be passed in `auth.token` — an invalid or missing token is rejected.

### Events

#### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `message:send` | `{ conversationId: string, text: string }` | Send a message via socket (alternative to `POST /messages`). Accepts an optional acknowledgement callback. |

#### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `message:new` | `{ _id, conversation, sender, text, createdAt }` | A new message was received in a conversation the user belongs to. |
| `conversation:updated` | Group conversation object | Fired when a group the user is in is created, renamed, or has its members/admins changed. |

### Usage Pattern

```js
// Listen for new messages
socket.on('message:new', (message) => {
  // Add message to the appropriate conversation in state
})

// Listen for group updates
socket.on('conversation:updated', (conversation) => {
  // Update the conversation in state
})

// Send a message
socket.emit('message:send', { conversationId, text }, (ack) => {
  // Optional acknowledgement
})
```

---

## Error Handling

The API returns JSON error responses for failure cases. General observed structure:

```json
{
  "error": {
    "message": "Human-readable error description",
    "code": "ERROR_CODE"
  }
}
```

| HTTP Status | Description |
|-------------|-------------|
| `200` | Success (GET, idempotent operations) |
| `201` | Resource created (POST) |
| `400` | Bad request — missing required field or invalid input |
| `401` | Unauthorized — missing, invalid, or expired JWT |
| `403` | Forbidden — action not permitted (e.g., non-admin tries to rename group) |
| `404` | Resource not found |
| `500` | Internal server error |

---

## Observed Quirks & Edge Cases

During live testing against the API, the following inconsistencies were observed:

1. **Direct conversation response is minimal:** `POST /conversations` (start direct) returns `{ _id, participants, createdAt }` — without a `type` field or `participant` sub-object. The full shape only appears in `GET /conversations`. Client must re-fetch the list or manually construct the conversation object.

2. **`lastMessage` can be empty object:** Both direct and group conversations return `lastMessage: {}` (empty object) when no messages have been sent yet. Clients must handle this gracefully rather than assuming `lastMessage.text` always exists.

3. **Search includes self:** `GET /users/search` returns the authenticated user in results. Client should filter out results where `_id === currentUser._id`.

4. **Swagger response bodies are intentionally unspecified:** The official Swagger spec at `/docs` deliberately omits response body schemas. All response structures in this document were derived from live API testing.

5. **`/health` is at root, not `/api`:** `GET /health` lives at `https://frontend-task-chatapp.onrender.com/health`, not under the `/api` prefix. `GET /api/health` returns a 404.

6. **No message pagination enforced on small datasets:** `hasMore` correctly returns `false` when all messages fit in one page, but the default page size appears to be 20 — not clearly documented.
