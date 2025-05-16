# 📁 Project Management System - Backend

A robust, scalable, and secure **NestJS backend** for a Project Management System. This service supports user authentication, task boards, roles & permissions, and team collaboration—similar to platforms like **ClickUp** or **Jira**.

---

## 🚀 Features

- ✅ User registration & login (JWT-based)
- 🔐 Role-based access control (RBAC)
- 📋 Project and task board management
- 🔄 Task statuses: To Do, In Review, Done, Backlog
- 🧑‍🤝‍🧑 Team creation and user assignments
- 📁 Board filtering and sorting
- 📦 Modular architecture with RESTful APIs
- 🛡️ Guards, interceptors, and middleware integration
- 🧪 Unit & integration tests (WIP)

---

## 🛠️ Tech Stack

| Technology     | Description                          |
|----------------|--------------------------------------|
| NestJS         | Node.js framework for scalable apps  |
| TypeScript     | Strongly typed JavaScript            |
| JWT            | Secure token-based authentication    |
| PostgreSQL     | Relational database (can be swapped) |
| Passport.js    | Authentication middleware            |
 

---

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js >= 16.x
- npm or yarn
- PostgreSQL installed and running

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/DeveloperAnisulHoque/task-nest.git
cd task-nest

# 2. Install dependencies
npm install

# 3. Create environment variables
cp .env.example .env
