**FAQ API Project - Complete Documentation & Admin Panel Guide**

This document explains how to set up, run, test, and manage FAQs using the FAQ API and its Admin Panel.


**1️⃣ Project Overview**

This project is a Frequently Asked Questions (FAQ) API built with:

- Node.js & Express.js (API Backend)
- MongoDB (Database)
- Redis (Caching System)
- Google Translate API (Automatic Translations)
- AdminBro (Admin Panel for UI Management)
- Docker & Docker Compose (Containerized Deployment)
- Mocha & Chai (Unit Testing)

The API allows users to:
- Create FAQs in multiple languages
- Retrieve FAQs with translations
- Cache translations for faster responses
- Manage FAQs via an Admin Panel


**2️⃣ Installation & Setup**

**Prerequisites**

Before starting, ensure you have installed:

- Node.js (v14 or later)
- MongoDB (Database)
- Redis (For caching translations)
- Docker & Docker Compose (For containerized deployment)

Now within `CLI`:

**Step 1: Clone the Repository**
```bash
git clone <repository-url>  
cd Project-FAQ
```

This downloads the project and moves into the project directory.

**Step 2: Install Dependencies**

``` bash
npm install
```

This installs all required Node.js dependencies from `package.json`.


**3️⃣ Running the Project**

**Option 1: Run with Docker (Recommended)**

Within `CLI`:

**Step 1: Start the Containers**

``` bash
docker-compose up --build
```

This will:
- Build the API image from `Dockerfile`.
- Start the following containers:
  - API server (Node.js + Express)
  - MongoDB database
  - Redis cache

**Step 2: Verify Running Containers**

``` bash
docker ps
```

You should see containers running for:
- faqs_project_app (API server)
- faqs_project_mongo (MongoDB)
- faqs_project_redis (Redis)

**Step 3: Stop the Containers**

``` bash
docker-compose down
```

This stops and removes all running containers.

**Option 2: Run Locally (Without Docker)**

**Step 1: Start MongoDB & Redis Manually**

If you're not using Docker, ensure MongoDB and Redis are running.

Start MongoDB:

``` bash
mongod --dbpath=/path/to/data
```

Start Redis:

``` bash
redis-server
```

**Step 2: Start the API**

``` bash
# In Terminal
npm start
```

This starts the Express.js server on port `8000` by default when hosting URI not given.


**4️⃣ Environment Variables (.env Setup)**

Create a `.env` file in the project root:

``` bash
# Working with arbitrary values for local system

# MongoDB connection  
DATABASE_URI=mongodb://localhost:27017/FQA

# Redis connection  
REDIS_HOST=localhost  
REDIS_PORT=6379 
REDIS_USERNAME=default  
REDIS_PASSWORD=your_redis_password

# Google Translate API 
GOOGLE_API_KEY=your_google_translate_api_key
```

For Docker, MongoDB and Redis run as services (mongo and redis), so you don't need to change the defaults.


**5️⃣ API Documentation**

All API endpoints are prefixed with:

```bash
# In local environment 
http://localhost:8000/api/
```

**Create a New FAQ**

``` bash
curl -X POST http://localhost:8000/api/faq/create -H "Content-Type: application/json" -d '{"question": "What is Node.js?", "answer": "Node.js is a JavaScript runtime.", "lang": "hi"}'
```

Creates an FAQ in English & translates it into Hindi.

**Get All FAQs (Default: English)**

``` bash
curl -X GET "http://localhost:8000/api/faqs/all"
```

Retrieves all FAQs in English.

**Get FAQs in a Specific Language (e.g., Hindi)**

``` bash
curl -X GET "http://localhost:8000/api/faqs/all?lang=hi"
```

Retrieves FAQs translated into Hindi.

**Get All FAQs with IDs**

``` bash
curl -X GET "http://localhost:8000/api/faqs/ids"
```

Retrieves all FAQs along with their IDs.

**Get a Specific FAQ by ID**

``` bash
curl -X GET "http://localhost:8000/api/faq-id/{faq_id}"
```

Replace `{faq_id}` with an actual FAQ ID.


**6️⃣ Admin Panel (FAQ Management UI)**

The Admin Panel allows you to manage FAQs via a UI.

**Access the Admin Panel**

Open your browser and go to:

``` bash
# In local environment 
http://localhost:8000/admin
```

**Login Credentials:**
- Username: admin
- Password: password

Note: You can change the username and password in `server.js`:

``` bash
app.use(  
  adminBro.options.rootPath,  
  expressBasicAuth({  
    users: { admin: "password" }, # Here user: admin and password: password 
    challenge: true,  
  })  
);
```

**Admin Panel Features**

Once logged in, you can:
- Create a new FAQ
- Edit an existing FAQ
- Delete FAQs
- View FAQ translations


**7️⃣ Running Tests**

This project includes unit tests using Mocha & Chai.

**Run all tests:**

``` bash
# In CLI
npm run test
```

Runs all tests using a MongoDB in-memory server.

**How Tests Work:**
- `setup.js` creates a test database before running tests.
- `faq.test.js` verifies that the API correctly creates, retrieves, and translates FAQs.


**8️⃣ Deployment (Production Ready)**

For production deployment, update your `.env` and run:

``` bash
docker-compose -f docker-compose.prod.yml up --build -d
```

Runs the API in detached mode (`-d`), meaning it runs in the background.


**9️⃣ Technologies Used**

- Node.js & Express.js – API backend
- MongoDB – Stores FAQ data
- Redis – Caches translated FAQs
- Google Translate API – Provides automatic translations
- Docker & Docker Compose – Containerized deployment
- AdminBro – Admin panel for managing FAQs
- Mocha & Chai – Unit testing framework


**🔟 License**

This project is licensed under the **ISC License**.
