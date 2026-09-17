# Support CRM

A full-stack customer support ticketing system built for the Datastraw Technologies AI + Tech Intern assessment.

## Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** FastAPI + Pydantic + PostgreSQL (Supabase)
- **Email Worker:** Python IMAP parser
- **Charts:** Recharts
- **Animations:** Framer Motion
- **UI Components:** Custom shadcn-style components

## Features

- Create tickets manually via form
- Automatically create tickets from structured support emails
- Search across ticket ID, customer name, email, subject, description
- Filter by status (Open, In Progress, Closed)
- View complete ticket details
- Update ticket status
- Add internal notes/comments
- Dashboard with ticket statistics and charts
- Responsive design for mobile and desktop
- Smooth animations following Emil Kowalski patterns

## Project Structure

```
mini-crm/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # FastAPI backend
├── email_worker/     # Python email parser
├── docs/             # Documentation
└── .env.example      # Environment variables template
```

## Local Development

### Backend

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd apps/web
npm install
npm run dev
```

### Email Worker

```bash
cd email_worker
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required:
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `IMAP_USER` - Email mailbox username
- `IMAP_PASSWORD` - Email mailbox password
- `CORS_ORIGINS` - Frontend URL for CORS

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/tickets | Create a ticket |
| GET | /api/tickets | List tickets (supports ?status= and ?search=) |
| GET | /api/tickets/{id} | Get ticket details |
| PUT | /api/tickets/{id} | Update status or add note |
| GET | /api/health | Health check |

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Supabase |

## Security

- No secrets in frontend code
- All API input validated with Pydantic
- Parameterized SQL queries
- CORS restricted to frontend origin
- Environment variables for credentials
