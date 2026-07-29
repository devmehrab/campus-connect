# Campus Connect

A modern university social networking platform built as a **pnpm monorepo**.

Campus Connect enables students to communicate, share posts, exchange messages, receive notifications, and interact with an AI-powered university assistant capable of answering questions using Retrieval-Augmented Generation (RAG).

---

# Architecture

```
                    ┌──────────────────────┐
                    │      Frontend        │
                    │      Next.js         │
                    └──────────┬───────────┘
                               │
                     HTTP / WebSocket
                               │
               ┌───────────────┴───────────────┐
               │                               │
               ▼                               ▼
      Express Backend                  AI Service
      REST API                     RAG + LangChain
               │                               │
               └───────────────┬───────────────┘
                               │
                     MongoDB Atlas Database
                               │
                        Vector Search Index
```

---

# Monorepo Structure

```
apps/
├── frontend      → Next.js 16 Application
├── backend       → Express.js REST API
└── ai-service    → LangChain RAG Service

packages/
└── Shared packages

package.json
pnpm-workspace.yaml
```

---

# Applications

## Frontend

Location

```
apps/frontend
```

Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Server Actions
- Socket.IO Client

Features

- Authentication
- User Profiles
- Feed
- Posts
- Comments
- Real-time Messaging
- Notifications
- Floating AI Chat Assistant

---

## Backend

Location

```
apps/backend
```

Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Redis
- BullMQ
- Socket.IO
- Cloudinary

Responsibilities

- Authentication
- User Management
- Posts
- Comments
- Messaging
- Notifications
- File Uploads
- Real-time Communication
- Email Queue
- AI Service Integration

---

## AI Service

Location

```
apps/ai-service
```

Tech Stack

- LangChain
- Google Gemini
- MongoDB Atlas Vector Search
- Local Embeddings
- LlamaParse
- Express

Responsibilities

- PDF, JSON ingestion
- Embedding generation
- Retrieval-Augmented Generation (RAG)
- AI Chat
- Context retrieval
- Document indexing

---

# Features

- Authentication
- Student Profiles
- Social Feed
- Create Posts
- Comment System
- Real-time Chat
- Notifications
- AI Assistant
- File Uploads
- Cloud Image Storage
- JWT Authentication
- Role-based Access
- Redis Caching
- Background Jobs
- Docker Support

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis
- BullMQ
- Socket.IO
- JWT

## AI

- LangChain
- Gemini
- MongoDB Atlas Vector Search
- LlamaParse

## DevOps

- Docker
- Docker Compose
- pnpm Workspaces

---

# Project Structure

```
apps
├── frontend
│   ├── app
│   ├── components
│   ├── actions
│   ├── services
│   └── providers
│
├── backend
│   ├── src
│   │   ├── modules
│   │   ├── config
│   │   ├── middlewares
│   │   ├── jobs
│   │   └── utils
│
└── ai-service
    ├── src
    │   ├── controllers
    │   ├── services
    │   ├── routes
    │   └── utils
```

---

# Getting Started

## Clone Repository

```bash
git clone https://github.com/devmehrab/campus-connect.git

cd campus-connect
```

---

## Install Dependencies

```bash
pnpm install
```

---

# Running Development Servers

## Frontend

```bash
pnpm --filter frontend dev
```

---

## Backend

```bash
pnpm --filter backend dev
```

---

## AI Service

```bash
pnpm --filter ai-service dev
```

---

# Build

Build every application

```bash
pnpm build
```

Build individual applications

```bash
pnpm --filter frontend build

pnpm --filter backend build

pnpm --filter ai-service build
```

---

# Environment Variables

Each application maintains its own environment configuration.

```
apps/frontend/.env

apps/backend/.env

apps/ai-service/.env
```

---

# Docker

Each service contains its own Docker configuration.

```
apps/backend/Dockerfile

apps/backend/docker-compose.yml

apps/ai-service/Dockerfile

apps/ai-service/docker-compose.yml
```

---

# Core Modules

Backend modules

```
Authentication

Users

Posts

Comments

Messages

Notifications

Assistant
```

---

# AI Pipeline

```
Upload PDF/JSON
      │
      ▼
LlamaParse
      │
      ▼
Chunk Documents
      │
      ▼
Generate Embeddings
      │
      ▼
MongoDB Atlas Vector Search
      │
      ▼
Retriever
      │
      ▼
Gemini
      │
      ▼
Response
```

---

# Development

Install dependencies

```bash
pnpm install
```

Lint

```bash
pnpm lint
```

Build

```bash
pnpm build
```

---

# Future Improvements

- Friend Requests
- Groups
- Events
- University Marketplace
- Video Calls
- AI Study Planner
- AI Summarisation
- Semantic Search
- OCR for Scanned PDFs
- Admin Dashboard

---

# License

This project is licensed under the MIT License.

---

# Author

**Mehrab Hossain**

Computer Science & Engineering

Bangladesh University of Professionals (BUP)

Full Stack Developer

---
