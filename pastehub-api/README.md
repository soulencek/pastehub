# Pastehub API

A modular, secure, and scalable Pastehub API built with Go, Gin, GORM, and JWT authentication.

---

## Features

- User registration & login with JWT authentication
- Create, read, update, and delete pastes
- List all pastes or user-specific pastes with pagination
- Password hashing & validation
- Rate limiting middleware
- Security headers middleware
- Modular architecture for maintainability
- SQLite database with automatic migrations
- Configurable via `.env`

---

## Project Structure

```text

pastehub-api/
├── main.go
├── config/          # Configuration loader
├── models/          # Database models (User, Paste)
├── controllers/     # HTTP controllers
├── services/        # Business logic & database services
├── routes/          # API routes registration
├── middlewares/     # Auth, RateLimiter, SecurityHeaders
├── validators/      # Input validation logic
├── utils/           # Pagination, error helpers
├── .env             # Environment variables
└── .gitignore

````

---

## Requirements

- Go 1.21+
- SQLite (bundled with Go)
- Git

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/pastehub-api.git
cd pastehub-api
````

### 2. Install dependencies

```bash
go mod tidy
```

### 3. Create a `.env` file at the project root

```env
PORT=8080
JWT_KEY=your_secret_jwt_key
DATABASE_PATH=pastes.db
```

### 4. Run the API

```bash
go run main.go
```

---

## API Endpoints

### Users

| Method | Endpoint          | Description           | Auth |
| ------ | ----------------- | --------------------- | ---- |
| POST   | /register         | Register a new user   | No   |
| POST   | /login            | Login & get JWT token | No   |
| GET    | /user             | Get current user info | Yes  |
| GET    | /user/\:id        | Get user by ID        | No   |
| GET    | /user/\:id/pastes | Get pastes by user    | No   |

### Pastes

| Method | Endpoint    | Description                 | Auth |
| ------ | ----------- | --------------------------- | ---- |
| POST   | /paste      | Create a new paste          | Yes  |
| GET    | /paste/\:id | Get a paste by ID           | No   |
| PUT    | /paste/\:id | Update a paste              | Yes  |
| DELETE | /paste/\:id | Delete a paste              | Yes  |
| GET    | /pastes     | List all pastes (paginated) | No   |

**Query Parameters (for listing):**

- `page` (default: 1)
- `limit` (default: 10)
- `sortField` (created_at, edited_at, title)
- `sortOrder` (asc, desc)

---

## Middlewares

- **AuthMiddleware**: Verifies JWT and sets `user_id` in context
- **RateLimiter**: Limits requests per second
- **SecurityHeaders**: Adds common security headers
- **CORS**: Configurable cross-origin requests

---

## Project Configuration

Use the `.env` file:

```env
PORT=8080
JWT_KEY=your_secret_jwt_key
DATABASE_PATH=pastes.db
```

- `PORT` – Server port
- `JWT_KEY` – Secret for signing JWTs
- `DATABASE_PATH` – Path to SQLite database

---

## Development

### 1. Run the server in **debug mode**

```bash
go run main.go
```

### 2. Run the server in **release mode** (recommended for production)

```bash
export GIN_MODE=release
go run main.go
```

### 3. Database tables are automatically migrated on startup

---

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

---

## Future Improvements

- Add unit tests for services & controllers
- Use PostgreSQL or MySQL for production
- Implement graceful shutdown
- Dockerize the application
- Add searching pastes
