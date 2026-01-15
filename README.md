# Wealth Tracker - Financial History & Projection

A beautiful Convex-powered application to track your financial history and projections with interactive visualizations.

## Features

- 📊 Interactive charts showing net worth growth over time
- 📈 Annual growth rate visualization
- 💰 Combined view of net worth vs. growth amount
- 🚀 **Projected net worth** with customizable growth rate
- 🎯 Milestone tracking ($5M, $10M targets with estimated dates)
- ➕ Easy data entry for new financial records
- 🗑️ Edit and delete records
- 🌙 Beautiful dark theme with gold accents

## Screenshots

The app features:
- **Stats Cards**: Current net worth, latest growth, total growth, and average annual growth
- **Historical Charts**: Net worth over time, annual growth rate bars
- **Projection Chart**: Combined historical + projected data with customizable growth %

## Getting Started

### Prerequisites

- Node.js 18+ (Node.js 20 recommended)
- A Convex account (free at [convex.dev](https://convex.dev))

### Installation

1. Install dependencies:

```bash
npm install
```

2. Initialize Convex (this will prompt you to log in and create a project):

```bash
npx convex dev
```

3. In a new terminal, start the Vite development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

5. Click "Load Sample Data" to populate your initial financial records, or start adding your own!

## Tech Stack

- **Backend**: [Convex](https://convex.dev) - Real-time backend
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
convex-finance/
├── convex/
│   ├── schema.ts          # Database schema
│   └── financialRecords.ts # Queries and mutations
├── src/
│   ├── App.tsx            # Main application
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
└── ...config files
```

## Data Model

Each financial record contains:
- `year`: The year of the record
- `age`: Your age at that time
- `netWorth`: Total net worth
- `growthPercentage`: Year-over-year growth %
- `growthAmount`: Year-over-year growth in dollars

## License

MIT
