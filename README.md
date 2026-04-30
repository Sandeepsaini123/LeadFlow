# LeadFlow — Lead Management Dashboard

A full-stack lead management system built with Node.js, MongoDB, and React. Manage leads, track pipeline status, visualise data with charts, export filtered reports, and get AI-powered insights.

## Live Demo

- **Frontend:** _coming soon_
- **Backend API:** _coming soon_

---

## Features

- **Lead Management** — Add, edit, and delete leads with full form validation
- **Dashboard** — Real-time stats and charts (status, city, service distribution)
- **AI Insights** — Auto-generated insights from live data (conversion rate, top city, top service, avg budget, follow-up alerts)
- **Reports** — Filter leads by date range, city, status, and service
- **Export CSV** — Download filtered report as a CSV file
- **Python Analysis Script** — Standalone script for deep data analysis via terminal

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

**Data Analysis**
- Python 3
- pandas, pymongo, tabulate

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
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── routes/       # Page components
│       └── services/     # API layer (axios)
│
└── analysis.py           # Python data analysis script
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
| GET | `/api/leads/insights` | AI-generated insights |
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
- Python 3.8+

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

### Python Analysis Script

```bash
pip install pymongo pandas python-dotenv tabulate
python analysis.py
```

Reads `MONGO_URI` from `backend/.env` and prints a detailed analysis report in the terminal including status breakdown, city-wise and service-wise conversion rates, average budgets, and key insights.

---

## Bonus Features

- **AI Insights** — Dashboard card with auto-generated insights from real-time lead data
- **Python Script** — Terminal-based deep analysis with tabular reports using pandas
- **Export CSV** — One-click export of filtered report data

---

## Deployment

- **Backend** deployed on [Render](https://render.com)
- **Frontend** deployed on [Vercel](https://vercel.com)
