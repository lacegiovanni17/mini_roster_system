# Mini Roster System - Backend

A simplified roster/shift scheduling system built with **NestJS**, **GraphQL**, **TypeORM**, and **PostgreSQL**.

## About 
* 👋 Hi, I’m Chidike Henry
* 😎 I’m a fullstack developer
* 💻 This is a fullstack movie tracker project built with ReactJS, C# and RooCode AI. 
* 💞️ I’m looking to collaborate on AI, C#, .Net mvc and ReactJS projects
* 📫 How to reach me chidike.henry@gmail.com

## Technologies Used
* NestJS
* GraphQl
* TypeORM
* PostgreSQL
* Github
* Typescript
* Git
* Graphql test endpoints

## Features

- **User Management**: Create and manage users with roles (admin/user)
- **Shift Management**: Create, view, and manage shifts with time slots
- **Assignment Management**: Assign users to shifts
- **Pagination & Filtering**: All list queries support pagination and filtering
- **GraphQL API**: Code-first GraphQL schema with Apollo Server
- **Database Migrations**: TypeORM migrations for schema management

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **GraphQL** - Query language with Apollo Server
- **TypeORM** - ORM for TypeScript and JavaScript
- **PostgreSQL** - Relational database
- **TypeScript** - Type-safe development

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- npm

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=roster_system
```

### 3. Create Database

```bash
createdb roster_system
```

Or using psql:

```sql
CREATE DATABASE roster_system;
```

### 4. Run Migrations

```bash
npm run migration:run
```

### 5. Seed Database (Optional)

```bash
npm run seed
```

### 6. Start Development Server

```bash
npm run start:dev
```

The GraphQL Playground will be available at: `http://localhost:3000/graphql`



### Database Picture with PgAdmin4 and Postico

<img width="1409" height="778" alt="Screenshot 2025-11-28 at 22 15 58" src="https://github.com/user-attachments/assets/e692d056-c2ad-4ec9-b55a-16099644496e" />


## Available Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with watch mode
- `npm run build` - Build for production
- `npm run migration:create -- ./src/migrations/MigrationName` - Create new migration
- `npm run migration:generate` - Generate migration from entities
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration
- `npm run seed` - Seed database with sample data

## GraphQL API
<img width="1386" height="852" alt="Screenshot 2025-11-28 at 22 52 59" src="https://github.com/user-attachments/assets/cc229661-e67d-4072-b5fb-ed9be4d1b7a6" />


### Queries

#### Users

```graphql
query {
  users(page: 1, limit: 10, filter: { role: "admin" }) {
    items {
      id
      name
      email
      role
    }
    total
  }
}
```

#### Shifts

```graphql
query {
  shifts(page: 1, limit: 10, filter: { isOpen: true }) {
    items {
      id
      startTime
      endTime
      isOpen
    }
    total
  }
}

query {
  openShifts(page: 1, limit: 10) {
    items {
      id
      startTime
      endTime
    }
    total
  }
}
```

#### Assignments

```graphql
query {
  assignments(page: 1, limit: 10, filter: { userId: "user-id" }) {
    items {
      id
      user {
        name
      }
      shift {
        startTime
        endTime
      }
    }
    total
  }
}
```

### Mutations

#### Create User

```graphql
mutation {
  createUser(createUserInput: {
    name: "John Doe"
    email: "john@example.com"
    role: "user"
  }) {
    id
    name
    email
  }
}
```

#### Create Shift

```graphql
mutation {
  createShift(createShiftInput: {
    startTime: "2025-11-26T08:00:00Z"
    endTime: "2025-11-26T16:00:00Z"
    isOpen: true
  }) {
    id
    startTime
    endTime
  }
}
```

#### Create Assignment

```graphql
mutation {
  createAssignment(createAssignmentInput: {
    userId: "user-id"
    shiftId: "shift-id"
  }) {
    id
    user {
      name
    }
    shift {
      startTime
    }
  }
}
```

#### Remove Assignment

```graphql
mutation {
  removeAssignment(id: "assignment-id")
}
```

## Database Schema

See the schema diagram in the root README.

## Project Structure

```
src/
├── assignments/          # Assignment module
│   ├── dto/             # Data transfer objects
│   ├── assignment.entity.ts
│   ├── assignments.service.ts
│   ├── assignments.resolver.ts
│   └── assignments.module.ts
├── shifts/              # Shift module
│   ├── dto/
│   ├── shift.entity.ts
│   ├── shifts.service.ts
│   ├── shifts.resolver.ts
│   └── shifts.module.ts
├── users/               # User module
│   ├── dto/
│   ├── user.entity.ts
│   ├── users.service.ts
│   ├── users.resolver.ts
│   └── users.module.ts
├── common/              # Common utilities
│   ├── pagination/      # Pagination DTOs
│   └── utils/           # Helper functions
├── migrations/          # Database migrations
├── app.module.ts        # Root module
├── data-source.ts       # TypeORM data source
└── main.ts              # Application entry point
```
<img width="1414" height="865" alt="Screenshot 2025-11-29 at 21 16 45" src="https://github.com/user-attachments/assets/865f981e-d8ca-476d-afd0-7c4d395a8104" />

## License

UNLICENSED
