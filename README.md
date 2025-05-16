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

#### Database Management

To manage your database data:

```bash
# Clear all data from the database
npm run clear

# Seed the database with test data
npm run seed
```

The seeder will create the following test users:

| Role              | Email                      | Password   | Description                  |
| ----------------- | -------------------------- | ---------- | ---------------------------- |
| Admin             | admin@zenith.com           | admin123   | System administrator         |
| Student           | student@zenith.com         | student123 | Learning student             |
| Student (Teacher) | teacher.student@zenith.com | teacher123 | Student who can teach others |

The seeder will also create:

- Sample skills (Programming, Design)
- A course with chapters and articles
- Skill transfers between students (one student teaching another)
- Sessions for each skill transfer
- Chat messages between users

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
