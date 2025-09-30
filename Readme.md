# AI-Powered Interview Assistant

## Overview

This project is a **React-based AI-powered interview assistant** designed for full-stack developer recruitment. It provides **two synchronized tabs**:

1. **Interviewee (Chat)** — for candidates to interact with the AI.
2. **Interviewer (Dashboard)** — for recruiters to view candidate performance, chat history, and AI-generated summaries.

The system supports **resume upload, dynamic question generation, timed interviews, pause/resume functionality, and session persistence**.

---

## Features

### Interviewee (Chat)

- **Resume Upload**: Accepts **PDF/DOCX**. Automatically extracts **Name, Email, and Phone**.
- **Missing Fields**: If any required information is missing from the resume, a **form appears** asking for only the missing fields. Otherwise, the chat interview starts directly.
- **Interview Flow**:
  - AI generates **6 questions** for a Full-Stack role:
    - **2 Easy (20s each)**
    - **2 Medium (60s each)**
    - **2 Hard (120s each)**
  - Questions are shown **one at a time** in the chat interface.
  - Candidate answers are recorded and **auto-submitted** when time expires.
  - After all questions, AI computes a **final score** and a **summary**.
- **Pause/Resume**: Candidates can pause the interview. A **Welcome Back modal** appears if the session is unfinished.

### Interviewer (Dashboard)

- Displays a **list of candidates** with final scores.
- Allows viewing **detailed candidate info**:
  - Chat history
  - Profile
  - AI-generated summary and scores
- Supports **search and sort** functionality.

---

## Persistence

- All data including **timers, answers, and progress** is persisted locally using **Redux + redux-persist**.
- Refreshing or closing the browser restores the candidate's session.
- Unfinished sessions trigger a **Welcome Back screen** on return.

---

## Tech Stack

- **Frontend**: React, Redux, Redux-Persist
- **APIs**: Hugging Face API for AI model integration
- **Storage**: Local Storage
- **Styling**: Tailwind CSS (responsive, mobile-first)
- **State Management**: Redux slices for chat, user, resume, and UI states

---

## Installation

### 1. Clone the repo

```bash
git clone https://github.com/Rohit131313/AI-Powered-Interview-Assistant.git
cd AI-Powered-Interview-Assistant
````

### 2. Backend Setup

```bash
cd backend
```

Create a `.env` file with:

```
PORT=3000
IMAGEKIT_PUBLIC_KEY=""
IMAGEKIT_PRIVATE_KEY=""
IMAGEKIT_URL_ENDPOINT=""
HF_API_KEY=""
DB_CONNECT=""
```

Install dependencies and start:

```bash
npm install
npx nodemon
```

### 3. Frontend Setup

```bash
cd frontend
```

Create a `.env` file with:

```
VITE_BASE_URL=http://localhost:3000
```

Install dependencies and start:

```bash
npm install
npm run dev
```

### 4. Open in browser

Visit: [http://localhost:5173](http://localhost:5173)

---

## Usage

### Interviewee

1. Upload your resume.
2. Fill in missing fields if prompted.
3. Start the interview — answer each question in the chat.
4. Pause or resume as needed.
5. Finish the interview and view AI-generated summary.

### Interviewer

1. Switch to the dashboard tab.
2. View the candidate list, scores, and chat history.
3. Filter/search candidates and analyze summaries.

---

