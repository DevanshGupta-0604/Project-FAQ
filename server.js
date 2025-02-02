// Base code for FAQ portal
import express from "express";
import expressBasicAuth from "express-basic-auth";
import adminBro from "./controllers/admin-panel/admin";
import AdminBroExpressjs from "@admin-bro/express";
import dbConnection from "./database/FAQ/faqConnection";
import faqRoutes from "./routes/faqRoutes";
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env

dbConnection(); // Setting up database connection
const app = express(); // Create an Express Application
const PORT = process.env.PORT || 3000; // Port to listen server

// Authentication setup (optional but recommended for security)
app.use(
  adminBro.options.rootPath,
  expressBasicAuth({
    users: { admin: "password" }, // Admin username and password
    challenge: true, // Will prompt for authentication
  })
);

// Create the AdminBro router
const router = AdminBroExpressjs.buildRouter(adminBro);
app.use(adminBro.options.rootPath, router);

// middleware setup
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Use FAQ Routes
app.use('/api', faqRoutes); // prefix all routes with 'api' path

// Start the server if not testing environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, (err) => {
    console.log(err ? `ERROR: ${err}` : `Server listening at PORT: ${PORT});
  });
}

export default app;  // Export app for testing purposes
