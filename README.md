# slickLink

slickLink is a modern URL shortener and QR code generator built with [Next.js](https://nextjs.org), Prisma, and NextAuth. It allows users to register, sign in, shorten URLs, generate QR codes, and manage their links from a dashboard.

## Features

- 🔗 Shorten long URLs to slick, shareable links
- 📱 Generate QR codes for any shortened URL
- 🧑‍💻 User authentication (register/sign in) with NextAuth
- 🗂️ Dashboard to manage your links
- 🌐 RESTful API endpoints for shortening, QR generation, and more
- 🎨 Beautiful, animated UI with custom components
- 🛡️ Secure, production-ready setup

## Tech Stack

- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma ORM](https://www.prisma.io/) with PostgreSQL (or your DB of choice)
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn/ui](https://ui.shadcn.com/) for UI components

## Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn install
```

### 2. Set up environment variables

Create a `.env` file in the root with your database and NextAuth credentials. Example:

```
NODE_ENV=development
DATABASE_URL=postgresql:........
NEXTAUTH_URL=http://localhost:3000
ENABLE_DB_KEEPALIVE= true

AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
AUTH_SECRET=...
```

### 3. Set up the database

Run Prisma migrations:

```bash
npx prisma migrate dev
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


## API Endpoints

- `POST /api/shorten` – Shorten a URL
- `GET /api/qr` – Generate a QR code for a URL
- `GET /api/[code]` – Redirect to the original URL
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/signin` – Sign in
