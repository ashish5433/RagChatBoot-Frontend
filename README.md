## RAG BASED AI CHAT BOT - FRONTEND

Frontend interface for the chatbot built with **Vite + React**.  
It connects with the backend, provides a chat-like UI, and manages sessions to deliver conversational experience.

## Overview

This project provides the **frontend interface** for the Retrieval-Augmented Generation (RAG) news application.  
It is designed around a chat UI that interacts with the backend APIs.

### Features
- Built with **Vite + React** for fast dev/build.  
- Chat interface styled with **SCSS**.  
- API integration via `chatApi.js`.  
- Maintains session ID for contextual queries.  
- Supports:
  - Sending queries to `/chat` endpoint.  
  - Displaying responses in real-time.  
  - Viewing and maintaining chat history per session.  

## ⚡ Tech Stack

1. **React + Vite** — Frontend framework and build tool.  
2. **Axios** — For API calls to the backend.  
3. **SCSS** — Styling for chat interface.  
4. **JavaScript (ES6+)** — Core logic.  

 

## 📂 Folder Structure
```
Frontend/
├── node_modules/ # Dependencies
├── public/ # Static assets
├── src/
│ ├── api/ # API integration
│ │ └── chatApi.js
│ │
│ ├── components/ # React components
│ │ └── Chat.jsx # Chat UI component
│ │
│ ├── styles/ # Stylesheets
│ │ └── Chat.scss # Chat styling
│ │
│ ├── App.jsx # Root React component
│ ├── main.jsx # Entry point
│ └── index.css # Global styles
│
├── .env # Environment variables
├── .env.example # Sample env config
├── .gitignore
├── eslint.config.js # Linting rules
├── index.html # App HTML template
├── package.json
├── package-lock.json
├── vite.config.js # Vite configuration
└── README.md

```

## 🏗️ Architecture

```mermaid
flowchart TD
    A["Site Loads"] ==> B{"Check localStorage for sessionId"}
    B == No sessionId ==> C["Create sessionId, Save"]
    B == sessionId exists ==> D["GET /api/session/:sessionId/history"]
    C ==> D
    D ==> E["Render history messages in chat area"]
    F["User Sends Message"] ==> G{"Form submit"}
    G == Prevent double sends ==> H["Append user message to messages"]
    H ==> I["Append assistant placeholder + show Loader"]
    I ==> J["POST /api/chat/stream {sessionId, query}"]
    J == Server streams chunks ==> K["onChunk: append chunk to assistant message"]
    K ==> J
    J == Server finishes ==> L["Client updates assistant message (final), saves message ids"]
    L ==> M["Scroll to bottom"]
    N["User Resets Session"] ==> O["POST /api/session/:sessionId/reset"]
    O ==> P["Server clears Redis session"]
    P ==> Q["Client clears UI, Creates new sessionId"]

    A@{ shape: rounded}
    C@{ shape: rounded}
    D@{ shape: rounded}
    E@{ shape: rounded}
    F@{ shape: rounded}
    H@{ shape: rounded}
    I@{ shape: rounded}
    J@{ shape: rounded}
    K@{ shape: rounded}
    L@{ shape: rounded}
    M@{ shape: rounded}
    N@{ shape: rounded}
    O@{ shape: rounded}
    P@{ shape: rounded}
    Q@{ shape: rounded}
     A:::Pine
     A:::Rose
     B:::Aqua
     C:::Sky
     D:::Sky
     E:::Sky
     F:::Rose
     G:::Aqua
     H:::Sky
     I:::Rose
     I:::Sky
     J:::Aqua
     J:::Sky
     K:::Sky
     L:::Sky
     M:::Sky
     N:::Rose
     O:::Sky
     P:::Sky
     Q:::Sky
    classDef Pine stroke-width:1px, stroke-dasharray:none, stroke:#254336, fill:#27654A, color:#FFFFFF
    classDef Aqua stroke-width:1px, stroke-dasharray:none, stroke:#46EDC8, fill:#DEFFF8, color:#378E7A
    classDef Sky stroke-width:1px, stroke-dasharray:none, stroke:#374D7C, fill:#E2EBFF, color:#374D7C
    classDef Rose stroke-width:1px, stroke-dasharray:none, stroke:#FF5978, fill:#FFDFE5, color:#8E2236
    style C color:#000000,stroke:#2962FF
    style D stroke:#2962FF
    style H stroke:#2962FF
    style P stroke:#2962FF
    linkStyle default stroke:#AA00FF


```


# ⚙️ Installation & How to Run

## Prerequisites
- Node.js 18+  
- npm / yarn / pnpm  
- Git  

---

## 📥 Clone and Install 

- Clone the repo into your directory using git clone <repo_url>. 
- Install all dependencies using `npm install` or `yarn install`  
- Create a `.env` file in the root folder (same level as `package.json`)  
  - Copy variables from `.env.example`  
  

---

## 🚀 Run the Project  

- Run `npm run dev` to start development server  
- Run `npm run build` to create production build  
-  

🎉 **Hurray! Your chatbot frontend is live...**

---

**Note:**  
- Make sure your **backend server** is running (locally or deployed).  
- Update `.env` with the correct backend API URL before running.

---


### 🖼️ Chat Interface
![Chat UI Demo]<img width="1375" height="836" alt="image" src="https://github.com/user-attachments/assets/8dc1358e-55f2-45a1-8796-8af516b72c1a" />
<img width="1668" height="967" alt="image" src="https://github.com/user-attachments/assets/2a5b2b13-f3f1-45a1-ba46-c3f1a7d1d32f" />

