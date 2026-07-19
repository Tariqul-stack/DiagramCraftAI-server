# DiagramCraft AI — Backend Server 🖥️

> REST API backend for DiagramCraft AI — Built with Node.js, Express.js, TypeScript, MongoDB, and Groq AI.

![Node.js](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-4-black?style=for-the-badge&logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Groq](https://img.shields.io/badge/Groq-AI-orange?style=for-the-badge)

---

## Live API

```
https://diagram-craft-ai-server.vercel.app
```

### Health Check
```bash
curl https://diagram-craft-ai-server.vercel.app/api/health
```

---

## Overview

This is the backend REST API for DiagramCraft AI. It handles:
- User authentication (JWT + Google OAuth)
- Diagram CRUD operations
- AI diagram generation via Groq API
- AI chat assistant
- Contact form submissions

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 20 LTS | Runtime environment |
| Express.js | v4 | REST API framework |
| TypeScript | 5+ | Type safety |
| MongoDB Atlas | Cloud | Database |
| Mongoose | v8 | MongoDB ODM |
| Groq SDK | latest | LLM API (Llama 3.3 70B) |
| JSON Web Token | latest | Authentication |
| bcryptjs | latest | Password hashing |
| google-auth-library | latest | Google OAuth token verification |
| Zod | v3 | Request body validation |
| Helmet | v7 | HTTP security headers |
| Morgan | v1 | HTTP request logging |
| cors | v2 | Cross-origin requests |
| tsx | latest | TypeScript execution |
| nodemon | latest | Development auto-restart |

---

## Project Structure

```
diagram_craft_ai-server/
├── src/
│   ├── config/
│   │   ├── db.ts              # MongoDB connection
│   │   └── env.ts             # Environment variable validation
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── diagram.controller.ts
│   │   ├── ai.controller.ts
│   │   └── contact.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts     # JWT verification
│   │   └── validate.middleware.ts # Zod request validation
│   ├── models/
│   │   ├── User.model.ts
│   │   ├── Diagram.model.ts
│   │   └── Contact.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── diagram.routes.ts
│   │   ├── ai.routes.ts
│   │   └── contact.routes.ts
│   ├── services/
│   │   ├── ai.service.ts       # Groq API calls
│   │   ├── diagram.service.ts  # Business logic
│   │   └── prompt.service.ts   # Prompt templates
│   ├── utils/
│   │   ├── apiResponse.ts      # Success/error response helpers
│   │   ├── asyncHandler.ts     # Async error wrapper
│   │   └── AppError.ts         # Custom error class
│   └── app.ts                  # Express app setup
├── index.ts                    # Server entry point
├── vercel.json                 # Vercel deployment config
├── .env                        # Environment variables
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Groq API key ([console.groq.com](https://console.groq.com))
- Google OAuth credentials ([console.cloud.google.com](https://console.cloud.google.com))

---

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Tariqul-stack/diagram_craft_ai-server.git
cd diagram_craft_ai-server
```

**2. Install dependencies**
```bash
npm install
```

**3. Create `.env` file**
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/diagramcraft
JWT_SECRET=your_very_long_random_secret_key_here
GROQ_API_KEY=gsk_your_groq_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret_here
```

**4. Start development server**
```bash
npm run dev
```

Server runs on `http://localhost:8000`

---

### Scripts

```bash
npm run dev      # Start development server with nodemon + tsx
npm run build    # Compile TypeScript to dist/
npm start        # Run compiled production build
```

---

## API Endpoints

### Base URL
```
http://localhost:8000  (development)
https://your-app.vercel.app  (production)
```

---

### Auth Routes `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login with email/password | No |
| POST | `/api/auth/google` | Google OAuth login | No |
| POST | `/api/auth/logout` | Logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Google OAuth Request Body:**
```json
{
  "credential": "google_id_token_here"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "_id": "...", "name": "...", "email": "..." },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Diagram Routes `/api/diagrams`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/diagrams` | Get all public diagrams (paginated) | No |
| GET | `/api/diagrams/:id` | Get single diagram | No |
| POST | `/api/diagrams` | Create new diagram | Yes |
| PUT | `/api/diagrams/:id` | Update diagram | Yes (owner) |
| DELETE | `/api/diagrams/:id` | Delete diagram | Yes (owner) |
| GET | `/api/diagrams/user/my` | Get logged-in user's diagrams | Yes |
| POST | `/api/diagrams/:id/like` | Toggle like on diagram | Yes |

**Query Parameters for GET `/api/diagrams`:**
```
?search=login flow
?diagramType=flowchart
?category=tech
?sort=latest | oldest | popular
?page=1
?limit=12
```

**Create Diagram Request Body:**
```json
{
  "title": "User Login Flow",
  "description": "A simple login flow diagram",
  "mermaidCode": "graph TD\n  A[Start] --> B[Login]",
  "prompt": "Show a simple login flow",
  "diagramType": "flowchart",
  "category": "tech",
  "tags": ["login", "auth"],
  "visibility": "public"
}
```

---

### AI Routes `/api/ai`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ai/generate` | Generate diagram from prompt | Yes |
| POST | `/api/ai/regenerate` | Regenerate with same prompt | Yes |
| POST | `/api/ai/chat` | Chat with AI about diagram | Yes |

**Generate Request Body:**
```json
{
  "diagramType": "flowchart",
  "prompt": "Show a user login flow with email verification"
}
```

**Generate Success Response:**
```json
{
  "success": true,
  "message": "Diagram generated",
  "data": {
    "mermaidCode": "graph TD\n  A[Start] --> B{Enter Email}..."
  }
}
```

**Chat Request Body:**
```json
{
  "diagramCode": "graph TD\n  A[Start] --> B[End]",
  "history": [
    { "role": "user", "content": "What does this diagram show?" },
    { "role": "assistant", "content": "This is a simple flowchart..." }
  ],
  "message": "How can I improve it?"
}
```

---

### Contact Route `/api/contact`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/contact` | Submit contact form | No |

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about DiagramCraft AI",
  "message": "I have a question about..."
}
```

---

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

**Response:**
```json
{
  "status": "ok",
  "message": "DiagramCraft AI server is running"
}
```

---

## 🗄️ Database Schema

### User Model
```typescript
{
  _id: ObjectId
  name: String (required)
  email: String (unique, required)
  password: String (hashed, optional for Google users)
  provider: "email" | "google"
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}
```

### Diagram Model
```typescript
{
  _id: ObjectId
  title: String (required)
  description: String
  mermaidCode: String (required)
  prompt: String
  diagramType: "flowchart" | "sequence" | "erd" | "class" | "mindmap" | "gantt"
  category: "business" | "tech" | "education" | "personal"
  tags: [String]
  visibility: "public" | "private"
  author: ObjectId (ref: User)
  likeCount: Number (default: 0)
  viewCount: Number (default: 0)
  createdAt: Date
  updatedAt: Date
}
```

### Contact Model
```typescript
{
  _id: ObjectId
  name: String (required)
  email: String (required)
  subject: String (required)
  message: String (required)
  createdAt: Date
  updatedAt: Date
}
```

---

## AI Integration

### Groq API Setup
- **Model:** `llama-3.3-70b-versatile`
- **Temperature:** `0.3` (for consistent Mermaid syntax)
- **Max Tokens:** `2000`

### Prompt Engineering
Each diagram type has a dedicated system prompt in `src/services/prompt.service.ts`:

```typescript
// Example for flowchart
"You are a Mermaid.js expert. Generate ONLY valid Mermaid.js flowchart syntax.
No explanation. No markdown fences. No backticks.
Start directly with 'graph TD' or 'graph LR'."
```

### Supported Diagram Types
| Type | Mermaid Keyword |
|------|----------------|
| flowchart | `graph TD` / `graph LR` |
| sequence | `sequenceDiagram` |
| erd | `erDiagram` |
| class | `classDiagram` |
| mindmap | `mindmap` |
| gantt | `gantt` |

---

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

### How It Works
1. User registers/logs in → Server generates JWT (expires in 7 days)
2. Client stores JWT in localStorage
3. Client sends JWT in `Authorization: Bearer <token>` header
4. Server verifies JWT on protected routes via `auth.middleware.ts`

### Protected Routes
Add `protect` middleware to any route that requires authentication:
```typescript
router.get("/protected", protect, controller);
```

---

## Deployment on Vercel

**1. Add `vercel.json` to root:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.ts"
    }
  ]
}
```

**2. Push to GitHub**
```bash
git add .
git commit -m "feat: ready for deployment"
git push origin main
```

**3. Import on Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add all environment variables

**4. Update Google Console**
Add your Vercel URL to:
- Authorized JavaScript origins
- Authorized redirect URIs

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 8000) | No |
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `GROQ_API_KEY` | Groq API key for LLM | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Yes |
| `CLIENT_URL` | Frontend URL for CORS | Yes |
| `BETTER_AUTH_SECRET` | BetterAuth secret key | Yes |

---

## Author

**Tariqul Islam**
- GitHub: [@Tariqul-stack](https://github.com/Tariqul-stack)
- LinkedIn: [tariqul-islam-dev](https://linkedin.com/in/tariqul-islam-dev)
- Email: tariqul.dev0@gmail.com

---

## License

This project is licensed under the MIT License.