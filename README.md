# EaseMySaas DMS

This is our Node.js base project that serves as a robust foundation for developing scalable and efficient web applications. With a focus on performance and modularity, it provides essential tools and architecture, empowering developers to rapidly create and deploy feature-rich web solutions.

## Requirements

- Node.js `>=20 <21` (recommended: 20.11.1)
- PostgreSQL 15
- Redis

## How to run in Dev mode (locally)

1. Copy `.env.sample` to `.env` and fill in all env variables (`NODE_ENV=development`)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run database migrations:
   ```bash
   npm run db:migrate
   ```
4. Seed the database:
   ```bash
   npm run db:seed
   ```
5. Start the server in watch mode:
   ```bash
   npm run start:dev
   ```

Server starts at `http://localhost:8080`

## How to run in Production mode

1. Copy `.env.sample` to `.env` and fill in all env variables (`NODE_ENV=production`)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Run migrations:
   ```bash
   npm run db:migrate
   ```
5. Start the server:
   ```bash
   npm run start
   ```

## API Documentation (Swagger)

Swagger UI is available once the server is running.

**URL:** `http://localhost:8080/api-docs`

### Available API Groups

| Tag | Endpoints |
|-----|-----------|
| **Auth** | Sign Up, Sign In, Forgot Password, Reset Password |
| **Email Verification** | Send OTP, Verify OTP |

### How to use

1. Start the server (`npm run start:dev`)
2. Open `http://localhost:8080/api-docs` in your browser
3. Click on any endpoint to expand it
4. Click **Try it out** to enable the editor
5. Fill in the request body and click **Execute**

### Using authenticated endpoints

1. Call `POST /api/v2/user/sign-in` or `POST /api/v2/user/sign-up`
2. Copy the `accessToken` from the response
3. Click the **Authorize** button (top right of Swagger UI)
4. Enter `Bearer <your_accessToken>` and click **Authorize**
5. All authenticated requests will now include the token automatically

## Auth API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v2/user/sign-up` | No | Register with email + password |
| POST | `/api/v2/user/sign-in` | No | Login, returns JWT token |
| POST | `/api/v2/user/forgot-password` | No | Send password reset link to email |
| POST | `/api/v2/user/reset-password` | No | Reset password using token from email |
| POST | `/api/v2/user/send-email-otp` | No | Send 6-digit OTP for email verification |
| POST | `/api/v2/user/verify-email-otp` | No | Verify OTP, marks email as verified |

## Other NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start server in watch mode |
| `npm run build` | Build project with Babel |
| `npm run start` | Start production build |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:reset` | Drop, recreate and re-seed the database |
| `npm run lint` | Lint and auto-fix source files |

## Make Commands

| Command | Description |
|---------|-------------|
| `make build` | Build the project |
| `make clean` | Delete the build (`dist/`) |
| `make pull` | Pull latest changes with rebase |
| `make push` | Force push current branch |

## Features

- User Authentication (Sign Up, Sign In, Forgot/Reset Password)
- Email Verification via OTP
- User Management
- Offer Management
- QR Code Management
- Swagger API Documentation
- Redis caching
- AWS S3 integration
- Email via Resend / Mailjet
