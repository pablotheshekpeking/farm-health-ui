# Farm Health UI

A modern web application for managing farm health and livestock tracking. Built with Next.js 15, Prisma, and NextAuth.js.

## Features

- 🔐 Secure Authentication System
- 🏠 Dashboard with Real-time Analytics
- 🐄 Livestock Management
- 📊 Health Reports Generation
- 👤 User Profile Management
- 🎨 Dark/Light Theme Support
- 📱 Responsive Design

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Authentication:** NextAuth.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **UI Components:** Shadcn/ui
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide Icons

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/farm_health_db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/farm-health-ui.git
cd farm-health-ui
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure 