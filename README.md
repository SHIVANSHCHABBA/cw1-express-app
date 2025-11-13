After-School Lessons API — Node.js + Express + MongoDB Atlas + Render Deployment

Author: Shivansh Chabba
Module: CST3144 — Full Stack Development
Coursework: CW1 (Backend)

📌 1. Project Overview

This backend provides a REST API for an after-school lessons web application.
It supports:

Retrieving lessons

Searching lessons

Creating orders

Updating lesson availability

Serving lesson images

Logging all incoming requests

The API is built with Node.js, Express.js, and the native MongoDB Node Driver (as required).
The database is hosted on MongoDB Atlas, and the server is deployed to Render.com.

🌐 2. Deployment Links
🔵 Live Render API (Production)

➡️ https://cw1-express-app.onrender.com

🔵 Main Endpoints

GET /api/lessons → returns all lessons

POST /api/orders → creates an order

PUT /api/lessons/:id → updates a lesson

GET /api/search?q= → backend search

GET /images/:filename → static image server

GET /api/health → health check

📁 3. GitHub Repository

Backend source code:
➡️ https://github.com/SHIVANSHCHABBA/cw1-express-app

Branches:

main → production

dev → optional local development

🛠 4. Tech Stack
Component	Technology
Backend Runtime	Node.js
Framework	Express.js
Database	MongoDB Atlas
DB Driver	Native MongoDB Node Driver (no Mongoose)
Deployment	Render.com
API Format	REST (JSON)
Images	Express static middleware
Logging	Custom Express Middleware
⚙️ 5. Installation & Setup (Local Development)
1. Clone the repository
git clone https://github.com/SHIVANSHCHABBA/cw1-express-app
cd cw1-express-app

2. Install dependencies
npm install

3. Create .env file

Inside project root:

MONGO_URI=your_mongodb_atlas_connection_string
PORT=4000

4. Start server in development mode
npm run dev

5. Test with browser or Postman
http://localhost:4000/api/lessons
http://localhost:4000/api/health

🧩 6. API Endpoints (Detailed)
GET /api/lessons

Returns all lessons from MongoDB.

Sample Response:
[
  {
    "_id": "65a40d...",
    "topic": "Math",
    "location": "London",
    "price": 100,
    "space": 5
  }
]

GET /api/search?q=term

Full-text search across topic, location, price, space.

POST /api/orders

Creates a new order.

Sample Request:
{
  "name": "Shivansh",
  "phone": "1234567890",
  "items": [
    { "lessonId": "65a40d...", "qty": 2 }
  ]
}

PUT /api/lessons/:id

Updates any attribute, including space.

Example:

{
  "space": 3
}

GET /images/:filename

Serves lesson images from the /images directory or returns an error if missing.

GET /api/health

Simple health check:

{"status":"OK"}

🧱 7. MongoDB Collections
Lesson Collection (lesson)
Field	Type
topic	String
location	String
price	Number
space	Number
Order Collection (order)
Field	Type
name	String
phone	String
items	Array of { lessonId, qty }
🧩 8. Middleware Implemented
1. Logger Middleware (Required by CW1)

Logs every request:

[2025-11-13 12:20:05] GET /api/lessons

2. Static File Middleware
app.use("/images", express.static("images"))


Returns realistic errors if file does not exist.

🚀 9. Deployment on Render

Render settings used:

Setting	Value
Build Command	npm install
Start Command	node src/server.js
Instance Type	Free
Env Vars	MONGO_URI, PORT
Region	Oregon (US West)

Auto-deploy from GitHub is enabled.

🧪 10. Postman

This project includes the Postman collection containing:

GET lessons

GET search

POST new order

PUT update lesson

GET health

Exported and included in submitted ZIP file as required.

📦 11. Exported Files for Submission

Included in ZIP:

lesson.json — exported MongoDB collection

order.json — exported MongoDB collection

postman_collection.json — exported Postman routes

README.md — this file

Express.js code (without node_modules)

✔ Exactly matches coursework submission rules.

🏁 12. Status

Backend: 100% Complete & Fully Functional
All CW1 requirements covered:

✔ Node.js only
✔ Express.js only
✔ Native MongoDB driver (no Mongoose)
✔ Fetch-compatible API
✔ Render deployment
✔ Logger + static file middleware
✔ GET, POST, PUT endpoints
✔ Search (backend implemented)
✔ MongoDB Atlas connected
