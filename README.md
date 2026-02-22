# Spark CRM

Spark CRM is a full-stack Customer Relationship Management application designed to help teams manage leads, deals, organizations, and contacts in one place. It supports multi-tenant architecture with role-based access control, enabling businesses to manage their sales pipeline efficiently.

## Features

- Authentication with session management
- Lead and deal tracking with action history
- Organization and contact management
- Call logging and comments
- Admin dashboard with tenant management
- Data export (XLSX)
- Role-based access control (admin, manager, user)
- Multi-tenant support

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui + Radix UI | Component library |
| TanStack Query | Server state & data fetching |
| TanStack Table | Data tables |
| React Router v7 | Client-side routing |
| React Hook Form + Zod | Form handling & validation |
| Axios | HTTP client |
| Lucide React | Icons |
| xlsx | Data export |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express v5 | Web framework |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens | Authentication |
| bcrypt | Password hashing |
| Zod | Request validation |
| Helmet + CORS | Security headers |
| express-rate-limit | Rate limiting |
| Morgan | HTTP request logging |
