
# Campus Club CRUD Application

## Project Overview
A web-based campus club management system developed using
Node.js, Express.js, SQLite, HTML, CSS and JavaScript.

## Features
- View all registered clubs.
- View a club by its ID.
- Register a new club.
- Update an existing club.
- Delete a club.
- Validate submitted club information.
- Return JSON responses from the REST API.

## Database
Database: SQLite

Table: clubs

Fields:
- id
- name
- category
- description
- president
- email
- meeting_day
- created_at
- updated_at

The database is initialized with 10 sample clubs.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/clubs | Retrieve all clubs |
| GET | /api/clubs/:id | Retrieve one club |
| POST | /api/clubs | Create a club |
| PUT | /api/clubs/:id | Update a club |
| DELETE | /api/clubs/:id | Delete a club |

## Run Locally

1. Install Node.js.
2. Open a terminal in the backend folder.
3. Install dependencies using:

   npm.cmd install

4. Start the server using:

   npm.cmd start

5. Open frontend/index.html using VS Code Live Server.

## Local API Address
http://localhost:3000/api/clubs
