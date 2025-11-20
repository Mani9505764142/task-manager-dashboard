
📘 Task Manager Dashboard

A full-stack Task Manager Dashboard built with React + Material UI on the frontend and Node.js + Express + LowDB + Basic Authentication on the backend.
This project demonstrates clean architecture, secure API design, validation, audit logs, pagination, filtering, and responsive UI.

🚀 Tech Stack
    Frontend

    React (Vite)

    Material UI (MUI)

    Axios

    React Hook Form

    React Router

    Dark Theme Support

    Backend

    Node.js

    Express.js

    LowDB (JSON database)

    Basic Authentication

    Express Validator

    sanitize-html

    nanoid

📁 Project Structure
task-manager-dashboard/

│
├── backend/

│   ├── server.js

│   ├── db.json

│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── models/
│       ├── middlewares/
│       └── validators/
│

└── frontend/

    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── api/
    │   ├── theme.js
    │   └── App.jsx
    
🔐 Basic Authentication
Every request to /api/* is protected.
Credentials:
Username: admin
Password: password123
If missing or incorrect → returns:
{
  "error": "Unauthorized access. Please provide valid credentials."
}
Frontend automatically sends authorization headers via Axios.

🗄️ Database
The backend uses LowDB with a JSON file (db.json).
Tables:
tasks
logs
Completely sufficient for the assignment and behaves like a real lightweight database.

📌 Features

✅ Task Management

1. Create tasks

2. Edit tasks

3. Delete tasks

4. View paginated list (5 per page)

5. Search/filter tasks by title or description

6. Responsive table UI

7. Dark theme

✨ Audit Logs

Every CRUD action automatically generates a log entry with:

Timestamp

Action type

Task ID

Updated fields (only changed keys for updates)

Color-coded actions:

Green → Create

Yellow → Update

Red → Delete

⚡ Security & Validation

Basic Authentication

Input validation

Max-length restrictions (Title: 100 chars, Description: 500 chars)

HTML sanitization to prevent XSS

Clean error responses

🌐 API Endpoints

Tasks

Method	Endpoint	Description

GET	/api/tasks	Fetch paginated tasks

POST	/api/tasks	Create task

PUT	/api/tasks/:id	Update task

DELETE	/api/tasks/:id	Delete task

Audit Logs

Method	Endpoint	Description

GET	   /api/logs	Fetch audit logs

▶️ Running the Project

  1. Start Backend
   
    cd backend

    npm install

    node server.js

 2. Start Frontend
   
    cd frontend

    npm install

    npm run dev

  Runs at:

  http://localhost:5173

  🎥 Demo Instructions (3–5 mins)

  Explain:

   1. Start backend + frontend

   2. Show Basic Auth (401 → 200)

   3. Create a task

   4. Update a task

   5. Delete a task

   6. Search + pagination

   7. Open Audit Logs

   8. Show folder structure

🧩 Challenges Faced

The main challenge was ensuring secure API access using Basic Authentication 
and keeping validation consistent on both frontend and backend. Implementing 
audit logs required careful tracking of changed fields and clean formatting 
of log data. Designing the UI to be responsive and clean while integrating 
pagination and filtering also required attention to detail.

✔ Final Notes

Completed well within the given timeline

Clean, modular, production-like structure

Fully meets assignment requirements

Secure, validated, responsive full-stack application

📸 Screenshots
<img width="1919" height="866" alt="image" src="https://github.com/user-attachments/assets/ad630967-27ec-4272-851a-71aaafdb3d5e" />
<img width="1919" height="874" alt="image" src="https://github.com/user-attachments/assets/a385f8bb-c959-44cc-b4cc-19a78f743da0" />



