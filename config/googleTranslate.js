import { Translate } from "@google-cloud/translate/build/src/v2"; // Import the official Google Translate client
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

// Initialize the Google Cloud Translate client
// Create a client using your API key from environment variables
const translate = new Translate({
  key: process.env.GOOGLE_API_KEY, // Fetch API key from environment variable
});

export default translate;