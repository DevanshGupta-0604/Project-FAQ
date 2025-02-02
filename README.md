FAQ API Project - Complete Documentation & Admin Panel Guide
This document explains how to set up, run, test, and manage FAQs using the FAQ API and its Admin Panel.

1️⃣ Project Overview
This project is a Frequently Asked Questions (FAQ) API built with:

Node.js & Express.js (API Backend)
MongoDB (Database)
Redis (Caching System)
Google Translate API (Automatic Translations)
AdminBro (Admin Panel for UI Management)
Docker & Docker Compose (Containerized Deployment)
Mocha & Chai (Unit Testing)
The API allows users to:
✅ Create FAQs in multiple languages
✅ Retrieve FAQs with translations
✅ Cache translations for faster responses
✅ Manage FAQs via an Admin Panel

2️⃣ Installation & Setup
Prerequisites
Before starting, ensure you have installed:
✅ Node.js (v14 or later)
✅ MongoDB (Database)
✅ Redis (For caching translations)
✅ Docker & Docker Compose (For containerized deployment)

Step 1: Clone the Repository
bash
Copy code
git clone <repository-url>
cd faqs_project
This downloads the project and moves into the project directory.

Step 2: Install Dependencies
bash
Copy code
npm install
This installs all required Node.js dependencies from package.json.

3️⃣ Running the Project
Option 1: Run with Docker (Recommended)
Step 1: Start the Containers
bash
Copy code
docker-compose up --build
This will:

Build the API image from Dockerfile.
Start the following containers:
API server (Node.js + Express)
MongoDB database
Redis cache
Step 2: Verify Running Containers
bash
Copy code
docker ps
You should see containers running for:

faqs_project_app (API server)
faqs_project_mongo (MongoDB)
faqs_project_redis (Redis)
Step 3: Stop the Containers
bash
Copy code
docker-compose down
This stops and removes all running containers.

Option 2: Run Locally (Without Docker)
Step 1: Start MongoDB & Redis Manually
If you're not using Docker, ensure MongoDB and Redis are running.

Start MongoDB:

bash
Copy code
mongod --dbpath=/path/to/data
Start Redis:

bash
Copy code
redis-server
Step 2: Start the API
bash
Copy code
npm start
This starts the Express.js server on port 8000.

4️⃣ Environment Variables (.env Setup)
Create a .env file in the project root:

ini
Copy code
# MongoDB connection
DATABASE_URI=mongodb://localhost:27017/FQA  

# Redis connection
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password

# Google Translate API
GOOGLE_API_KEY=your_google_translate_api_key
For Docker, MongoDB and Redis run as services (mongo and redis), so you don't need to change the defaults.

5️⃣ API Documentation
All API endpoints are prefixed with:

bash
Copy code
http://localhost:8000/api/
📌 Create a New FAQ
bash
Copy code
curl -X POST http://localhost:8000/api/faq/create \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is Node.js?",
    "answer": "Node.js is a JavaScript runtime.",
    "lang": "hi"
  }'
✔ Creates an FAQ in English & translates it into Hindi.

📌 Get All FAQs (Default: English)
bash
Copy code
curl -X GET "http://localhost:8000/api/faqs/all"
✔ Retrieves all FAQs in English.

📌 Get FAQs in a Specific Language (e.g., Hindi)
bash
Copy code
curl -X GET "http://localhost:8000/api/faqs/all?lang=hi"
✔ Retrieves FAQs translated into Hindi.

📌 Get All FAQs with IDs
bash
Copy code
curl -X GET "http://localhost:8000/api/faqs/ids"
✔ Retrieves all FAQs along with their IDs.

📌 Get a Specific FAQ by ID
bash
Copy code
curl -X GET "http://localhost:8000/api/faq-id/{faq_id}"
✔ Replace {faq_id} with an actual FAQ ID.

6️⃣ Admin Panel (FAQ Management UI)
The Admin Panel allows you to manage FAQs via a UI.

📌 Access the Admin Panel
Open your browser and go to:
bash
Copy code
http://localhost:8000/admin
Login Credentials:
Username: admin
Password: password
Note: You can change the username and password in server.js:

js
Copy code
app.use(
  adminBro.options.rootPath,
  expressBasicAuth({
    users: { admin: "password" },
    challenge: true,
  })
);
📌 Admin Panel Features
Once logged in, you can:

✔ Create a new FAQ
✔ Edit an existing FAQ
✔ Delete FAQs
✔ View FAQ translations

7️⃣ Running Tests
This project includes unit tests using Mocha & Chai.

Run all tests:
bash
Copy code
npm run test
✔ Runs all tests using a MongoDB in-memory server.

How Tests Work:
setup.js creates a test database before running tests.
faq.test.js verifies that the API correctly creates, retrieves, and translates FAQs.
8️⃣ Deployment (Production Ready)
For production deployment, update your .env and run:

bash
Copy code
docker-compose -f docker-compose.prod.yml up --build -d
✔ Runs the API in detached mode (-d), meaning it runs in the background.

9️⃣ Technologies Used
✅ Node.js & Express.js – API backend
✅ MongoDB – Stores FAQ data
✅ Redis – Caches translated FAQs
✅ Google Translate API – Provides automatic translations
✅ Docker & Docker Compose – Containerized deployment
✅ AdminBro – Admin panel for managing FAQs
✅ Mocha & Chai – Unit testing framework

🔟 Contributing
Want to improve the project? Follow these steps:

Fork the repository
Create a new branch (feature/my-feature)
Commit your changes
Push to GitHub and open a Pull Request
🔟 License
This project is licensed under the ISC License.
