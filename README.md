# Product Inventory System

A full-stack MERN application for managing product inventory with categories, search, and filtering.

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Frontend:** React 18, Vite, shadcn/ui, TanStack Query, React Hook Form
- **Validation:** express-validator (server) + React Hook Form (client)

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB running locally (or an Atlas connection string)

### Backend Setup

```bash
cd server
npm install
```

**Seed the categories:**

```bash
npm run seed
```

**Start the server:**

```bash
npm run dev
```

Server runs on `http://localhost:5000`.

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:5173`.

### Environment Variables

**Server** (`server/.env`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/product-inventory
```

**Client** (`client/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

## Features

- Add products with name, description, quantity, and multiple categories
- Paginated product listing with numbered page navigation
- Search products by name (partial match, debounced)
- Filter by multiple categories (OR logic)
- Duplicate name prevention (client + server + DB level)
- Delete products with confirmation dialog
- Toast notifications for all actions
- URL-synced filters (survives page refresh)
- Responsive design