# zenith

Reaching the peak of innovation

## Getting Started

### 1. Install Dependencies

#### Backend

```bash
cd zenith-backend
npm install
```

#### Frontend

```bash
cd ../zenith-frontend
npm install
```

---

### 2. Database Setup & Migrations (Drizzle Kit)

#### Create the Database

Make sure you have your database (e.g., PostgreSQL, MySQL, SQLite) running and the connection string set in your backend's environment variables (e.g., `.env` file).

#### Run Migrations

From the `zenith-backend` directory, run:

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

- `generate`: Generates migration files based on your schema.
- `push`: Applies the migrations to your database.

---

### 3. Start the Applications

#### Backend

```bash
cd zenith-backend
npm start
```

#### Frontend

```bash
cd ../zenith-frontend
npm run dev
```

---

Now, your backend should be running (usually on `localhost:3000` or similar), and your frontend (often on `localhost:5173` or similar, depending on your setup).

---

**Note:**

- Adjust the commands if you use `yarn` or `pnpm` instead of `npm`.
- Make sure to configure your environment variables as needed for both backend and frontend.
- For more details, check the documentation in each subproject.
