# Spark CRM

Spark CRM is a full-stack Customer Relationship Management application designed to help teams manage leads, deals, organizations, and contacts in one place. It supports multi-tenant architecture with role-based access control, enabling businesses to manage their sales pipeline efficiently.

## Features

- Authentication with JWT-based session management
- Lead and deal tracking with action history
- Organization and contact management
- Call logging and comments
- File attachments with cloud storage (AWS S3)
- Email notifications via SMTP
- CSV and XLSX data import/export
- Admin dashboard with tenant management
- Role-based access control (admin, manager, user)
- Multi-tenant support
- Background job processing with worker queues (AWS SQS)
- Scheduled jobs and automation
- Keyboard shortcuts
- AI-powered features via LangChain (Google Gemini + Tavily search)
- Image processing for attachments

## DB Schema

![Entity–relationship model](entity–relationship-model.png)

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 7.3 | Build tool & dev server |
| Tailwind CSS | 4.2 | Utility-first styling |
| shadcn (CLI) | 3.8 | Component scaffolding |
| Radix UI | 1.4 | Accessible primitives |
| Base UI | 1.2 | Unstyled components |
| TanStack Query | 5.90 | Server state & data fetching |
| TanStack Table | 8.21 | Data tables |
| TanStack Hotkeys | 0.3 | Keyboard shortcuts |
| React Router | 7.13 | Client-side routing |
| React Hook Form + @hookform/resolvers | 7.71 / 5.2 | Form state & validation integration |
| Axios | 1.13 | HTTP client |
| Lucide React | 0.577 | Icons |
| date-fns | 4.1 | Date utilities |
| GridStack | 12.4 | Dashboard grid layout |
| Recharts | 2.15 | Charts & data visualization |
| DOMPurify + Marked | 3.3 / 17.0 | Safe HTML/Markdown |
| lodash | 4.17 | Utility functions |
| xlsx | 0.18 | Spreadsheet import/export |
| uuid | 13.0 | Unique ID generation |
| react-hot-toast | 2.6 | Toast notifications |
| react-helmet-async | 2.0 | Document head management |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | - | Runtime |
| TypeScript | 5.9 | Type safety |
| Express | 5.2 | Web framework |
| MongoDB + Mongoose | 9.2 | Database & ODM |
| Redis (ioredis) | 5.10 | Caching & session store |
| AWS SDK v3 (S3, SQS, presigner) | 3.998 | Storage, queues, signed URLs |
| Arcjet | 1.2 | Security and abuse protection |
| JSON Web Tokens | 9.0 | Authentication |
| bcrypt | 6.0 | Password hashing |
| Zod | 4.3 | Request validation |
| Nodemailer | 8.0 | Email sending |
| Multer | 2.1 | File uploads |
| csv-parser + csv-stringify | 3.2 / 6.6 | CSV import/export |
| xlsx | 0.18 | Spreadsheet import/export |
| date-fns | 4.1 | Date utilities |
| Helmet + CORS + compression | 8.1 / 2.8 / 1.8 | Security + middleware |
| Morgan | 1.10 | HTTP request logging |
| cookie-parser + body-parser | 1.4 / 2.2 | Request parsing |
| dotenv | 17.3 | Environment configuration |
| Axios | 1.13 | HTTP client |
| LangChain Core/Google/Tavily | 1.1 / 0.1 / 1.2 | AI integrations |
| uuid | 13.0 | Unique ID generation |
