# WhatChat — Real-Time Messaging Application & Developer Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://watchat7.netlify.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Maksudur7/messenger.git)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black?style=for-the-badge&logo=socket.io)](https://socket.io/)

A modern, high-performance real-time messaging application and interactive developer platform built with **Next.js 16 (App Router)**, **React 19**, **Socket.io**, and **Zustand**. Designed for a seamless end-to-end user experience, low-latency communication, and interactive API documentation.

---

## 🔗 Quick Links

- 🌐 **Live Application (Netlify):** [https://watchat7.netlify.app](https://watchat7.netlify.app)
- 🐙 **GitHub Repository:** [https://github.com/Maksudur7/messenger.git](https://github.com/Maksudur7/messenger.git)
- 📚 **Interactive API Explorer Route:** [https://watchat7.netlify.app/api-docs](https://watchat7.netlify.app/api-docs)
- 📄 **API Markdown Documentation:** [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
- 🧠 **Thought Process Write-up:** [docs/THOUGHT_PROCESS.md](docs/THOUGHT_PROCESS.md)

---

## 📋 Assignment Overview & Technical Write-up

---

### 1️⃣ Part 1: Architecture & Libraries Used (and Why)

This project utilizes a modular, high-performance, real-time client-server architecture. Below is the breakdown of core libraries and technical rationales:

* **Next.js 16 (App Router) + React 19:**
  * **Why Used:** Provides fast Server-Side Rendering (SSR), robust file-based routing, and server component modularity. Client-side interactivity is strictly scoped using `'use client'` directives to keep the DOM lightweight and performant.
* **Zustand 5 (State Management):**
  * **Why Used:** Real-time chat applications require high-frequency state updates. Zustand was chosen over Redux to avoid heavy boilerplate, and over React Context to eliminate full-tree re-renders using atomic selector subscriptions (`useChatStore(s => s.activeId)`).
* **Socket.io Client 4.8 (Real-Time Engine):**
  * **Why Used:** Enables instant bi-directional event streaming (`message:new`, `conversation:updated`) and seamless client-server state synchronization.
* **TailwindCSS v4 (Styling & Design Tokens):**
  * **Why Used:** Provides a utility-first dark mode palette, glassmorphism card layouts, clean design tokens, and rapid responsive styling.
* **Motion / Framer Motion (Animations):**
  * **Why Used:** Delivers smooth page transitions, modal dialog entrance animations, and fluid toast micro-interactions.
* **Zod & date-fns:**
  * **Why Used:** Zod ensures type-safe schema validation, while date-fns handles message timestamp formatting.

---

### 2️⃣ Part 2: Design Considerations & User Experience

The primary design goal was to craft a clean, visually striking, and intuitive messaging platform:

* **Simple Yet Gorgeous Landing Page:**
  * Aimed to achieve a "simple yet gorgeous" aesthetic for the landing page.
  * Carefully planned the layout, color scheme, and section placements so that the page feels elegant while remaining user-friendly and highly interactive (e.g., in-hero live interactive playground and real-time network ping latency monitor).
* **Unified Design Consistency Across Routes:**
  * Maintained visual alignment between the **Landing Page**, **Login Page**, and **Chat Page**.
  * Ensured users experience a cohesive, modern dark-slate theme (inspired by WhatsApp Web) with smooth transitions as they navigate through the app.
* **User-Centric UX Innovations:**
  * **Smart Auto-scroll & Floating Unread Pill:** `IntersectionObserver` tracks bottom scroll position. If a user is reading older messages, incoming messages do not force-scroll their view; instead, a floating unread message badge lets them jump down on demand.
  * **Per-Conversation Draft Persistence:** Unsent draft text is saved per conversation ID in Zustand, allowing users to switch chats without losing what they were typing.

---

### 3️⃣ Part 3: AI Tool Usage & Development Workflow

* **AI Tool Used:** **Antigravity AI Agent** (Google DeepMind).
* **Developer Ownership & Planning:**
  * All project planning, architecture design, UI layouts, route structure, and feature selections were conceptualized, chosen, and directed entirely by the developer.
* **Role of AI (Speed & Productivity):**
  * Antigravity AI served as a high-speed coding assistant to accelerate code implementation. Writing every line manually from scratch would have taken substantially more time.
* **Developer Focus (Complex Logic & Edge Cases):**
  * By leveraging AI for rapid coding, the developer was able to focus heavily on complex logic and troubleshooting tasks that AI struggles with (e.g., Socket.io origin path connection debugging, REST API & WebSocket synchronization, optimistic UI retry flows, and handling backend payload discrepancies).

---

### 4️⃣ Part 4: Future Improvements (With More Time)

If additional time is available in the future, the following enhancements will be implemented:

1. **Chat Route UI Refinement:** Upgrading and modernizing the design of the chat route pages and components even further.
2. **Micro-Messaging Functionalities:** Perfectly completing subtle messaging features (e.g., read receipts/ticks, message reactions, reply threads, and media attachments).
3. **Route & Workflow Enhancements:** Improving performance and user experience across all secondary routes.
4. **Landing Page Design Polish:** Continuously refining the landing page design, embracing continuous improvement and acknowledging that design can always be perfected.

---

### 5️⃣ Part 5: API Quirks, Challenges & Solutions

During live API integration and testing, several backend quirks were identified and resolved:

1. **Socket.io Origin Path Mismatch:**
   * **Issue:** The WebSocket server runs at the root origin (`https://frontend-task-chatapp.onrender.com`), not under `/api`. Connecting to `/api/socket.io` failed silently.
   * **Solution:** Decoupled `SOCKET_BASE_URL` (`.../`) from `API_BASE_URL` (`.../api`) in the client setup.
2. **Minimal Direct Conversation Payload on Creation:**
   * **Issue:** `POST /api/conversations` returns a minimal object omitting `type` and `participant` arrays.
   * **Solution:** Triggered a background `getConversations()` fetch immediately after chat creation to synchronize complete metadata.
3. **Empty `lastMessage` Payload (`{}`):**
   * **Issue:** Newly created conversations return `{}` instead of `null` or missing keys, causing runtime errors if accessed directly.
   * **Solution:** Implemented defensive optional chaining (`lastMessage?.text`) across all UI components.
4. **User Search Self-Match:**
   * **Issue:** `GET /api/users/search` includes the currently authenticated user in search results.
   * **Solution:** Applied client-side ID filtering (`results.filter(u => u._id !== currentUser._id)`) to exclude self from contact search.
5. **Root Level Health Endpoint:**
   * **Issue:** Health check is served at `/health` on root, whereas `/api/health` returns 404.
   * **Solution:** Configured the health monitor to target the root `/health` route directly.

---

## 🛠️ Complete Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | React 19 SSR, file-based routing, component modularity |
| **Language** | TypeScript 5.0 | Type-safe store contracts, API DTOs, and Socket event interfaces |
| **State Management** | Zustand 5 | Decoupled reactive store with granular selector subscriptions |
| **Styling** | TailwindCSS v4 | Dynamic dark palette, responsive utilities, glassmorphism |
| **Real-Time Engine** | Socket.io Client 4.8 | Event-driven WebSocket connection & automatic reconnection |
| **Animations** | Motion (`motion/react`) | Fluid layout transitions, modals, toasts, hover effects |
| **Icons** | Lucide React | Clean, scalable interface icons |

---

## 🚀 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Maksudur7/messenger.git
   cd messenger
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   - Landing Page: `http://localhost:3000`
   - Chat Application: `http://localhost:3000/chat`
   - API Documentation: `http://localhost:3000/api-docs`

---

## 📄 License

MIT © 2026 WhatChat Application