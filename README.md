# Containerized ToDo List Application

A simple Todo application built with React, Node.js (v22.11.0), and PostgreSql. This app allows users to manage tasks across different categories with authentication and user-specific data management.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
  - [Docker Deployment](#docker-deployment)
  - [Local Deployment](#local-deployment)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Future Enhancements](#future-enhancements)

---

## Features

### Frontend

- Comprehensive task management: Create, update, display, and delete tasks.
- Mark tasks as completed to track progress effectively.
- Categorize tasks for better organization and prioritization.
- Secure user authentication using JSON Web Tokens (JWT).
- Intuitive UI styling to clearly distinguish between completed and pending tasks.
- Categories list for personalized task organization.

### Backend

- RESTful APIs for efficient management of tasks, categories, and user data.
- JSON Web Token (JWT) based authentication ensuring secure user sessions.
- Comprehensive data validation to maintain application integrity and prevent errors.
- Well-defined PostgreSql schemas to structure and store data effectively.
- Dockerization of the application for consistent and portable deployment.

### Database

- Schemas for todos, and users.
- User-specific todos.
- Secure storage of sensitive user data.

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Nginx
- **Backend**: Node.js, NestJS
- **Database**: PostgreSql
- **Containerization**: Docker, Docker Compose
- **Infrastructure**: Pulumi

---

## Project Structure

```
mern-todo-list-application/
│
├── frontend/                 # React-based frontend
│   ├── src/
│   └── .env.example
│   └── .gitignore
│   └── Dockerfile
│   └── eslint.config.js
│   └── index.html
│   └── nginx.conf
│   └── package.json
│   └── postcss.config.js
│   └── tailwind.config.js
│   └── tsconfig.json
│   └── vite.config.ts
│   └── yarn.lock
│
├── backend/                  # Node.js backend
│   ├── src/
│   ├── .dockerignore
│   └── .env.example
│   └── nest-cli.json
│   └── tsconfig.json
│   └── .gitignore
│   └── Dockerfile
│   └── package.json
│   └── yarn.lock
│
├── docker-compose.yml        # Compose file for running the app
└── README.md                 # Project documentation
```

---

## Setup and Installation

### Docker Deployment

1. **Docker**:
   Ensure Docker and Docker Compose, and PostgreSql are installed on your machine.

2. **Run Via Docker Image**:

   ```bash
   # Pull the official PostgreSQL image
   docker pull postgres:latest

   # Pull the official PostgreSQL image
   docker run -d \
      --name postgres-container \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=your_database_name \
      -p 5432:5432 \
      -v postgres-data:/var/lib/postgresql/data \
      postgres:latest

   # Pull and Run Todo Backend
   docker pull mohaiminuleraj/todo-backend:1.0
   docker run -p 3000:3000 mohaiminuleraj/todo-backend:1.0

   # Pull and Run Todo Frontend
   docker pull mohaiminuleraj/todo-frontend:1.0
   docker run -p 8080:8080 mohaiminuleraj/todo-frontend:1.0
   ```

3. **Build and run the application**:

   ```bash
   sudo docker compose build --no-cache && sudo docker compose up -d
   ```

4. **Access the application**:

   - **Frontend**: [http://localhost:8080](http://localhost:8080)
   - **Backend**: [http://localhost:3000](http://localhost:3000)

5. **Authentication Options**

   - **User Registration**:

     New users can create their own accounts directly from the application. Each user will have a personalized dashboard to manage tasks and categories.

---

### Local Deployment

1. **Install prerequisites**:

   - Node.js (v22.11.0)
   - Yarn (v1.22.22)
   - PostgreSql

2. **Clone the repository**:

   ```bash
   git clone https://github.com/MohaiminulEraj/Containerized-To-Do-App.git
   cd Containerized-To-Do-App
   ```

3. **Set up environment variables**:
   Create `.env` files for both frontend and backend services. See the [Environment Variables](#environment-variables) section for details.

4. **Install dependencies and run services**:

   - **Backend**:
     ```bash
     cd backend
     yarn
     yarn start:dev
     ```
   - **Frontend**:
     ```bash
     cd frontend
     yarn
     yarn build
     yarn dev
     ```

5. **Access the application**:

   - **Frontend**: [http://localhost:8080](http://localhost:8080)
   - **Backend**: [http://localhost:3000](http://localhost:3000)

6. **Authentication Options**

   - **User Registration**:

     New users can create their own accounts directly from the application. Each user will have a personalized dashboard to manage tasks and categories.

---

## Environment Variables

### Backend

Create a `.env` file in the `backend/` directory and copy all the content from `.envExample`:

```
# Port number
PORT=3000


NODE_ENV=development

# Your local PostgreSql DB credentials
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=todo_db

# JWT
# JWT secret key
JWT_SECRET=thisisasamplesecret
```

### Frontend

Create a `.env` file in the `frontend/` directory and copy all the content from `.envExample`:

```
VITE_API_URL=http://localhost:3000/api
```

---

### Todos

- `GET /todos`: Retrieve all todos.
- `POST /todos`: Create a new todo.
- `PATCH /todos/:id`: Update a todo.
- `PATCH /todos/:id/toggle`: Toggle a todo.
- `DELETE /todos/:id`: Delete a todo.

### Authentication

- `POST /auth/login`: User login.
- `POST /auth/register`: User registration.
- `POST /auth/logout`: Access token refreshing.

---

## Database Schema

### Todo

- `title`: String (required)
- `description`: String (optional)
- `dueDate`: Date (optional)
- `category`: Enum (Category List, default: personal)
- `completed`: Boolean (default: false)
- `user`: ManyToOne relationship with User
- `timestamps`: CreatedAt, UpdatedAt (automatically added by postgreSql)

### User

- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required)
- `todos`: OneToMany relationship with Todo
- `timestamps`: CreatedAt, UpdatedAt (automatically added by postgreSql)

---
