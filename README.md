# LeadFlow — Lead Management Dashboard

A full-stack lead management system built with Node.js, MongoDB, and React. Manage leads, track pipeline status, visualise data with charts, and export filtered reports.

## Live Demo

- **Frontend:** _coming soon_
- **Backend API:** _coming soon_

---

## Features

- **Lead Management** — Add, edit, and delete leads with full form validation
- **Dashboard** — Real-time stats and charts (status, city, service distribution)
- **Reports** — Filter leads by date range, city, status, and service
- **Export CSV** — Download filtered report as a CSV file

---

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- REST API

**Frontend**
- React 19 + TypeScript
- TanStack Router
- Tailwind CSS + shadcn/ui
- Recharts (data visualisation)
- React Hook Form + Zod (validation)
- Axios

---

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/       # MongoDB connection
│       ├── controllers/  # Route handlers
│       ├── models/       # Mongoose schemas
│       ├── routes/       # Express routes
│       └── server.js
│
└── frontend/
    └── src/
        ├── components/   # Reusable UI components
        ├── routes/       # Page components
        └── services/     # API layer (axios)
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | Get all leads |
| POST | `/api/leads` | Create a new lead |
| PUT | `/api/leads/:id` | Update a lead |
| DELETE | `/api/leads/:id` | Delete a lead |
| GET | `/api/leads/stats` | Dashboard statistics |
| GET | `/api/leads/report` | Filtered report |

### Report Query Params
`/api/leads/report?city=Mumbai&status=New&service=SEO&startDate=2024-01-01&endDate=2024-12-31`

---

## Lead Schema

```json
{
  "name": "string",
  "mobile": "string",
  "email": "string",
  "city": "string",
  "service": "string",
  "budget": "number",
  "status": "New | Interested | Converted | Rejected"
}
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend runs on `http://localhost:8080`

---

## Deployment

- **Backend** deployed on [Render](https://render.com)
- **Frontend** deployed on [Vercel](https://vercel.com)
