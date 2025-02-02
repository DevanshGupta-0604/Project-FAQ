import express from "express";
import {
  getAllFAQsByIds,
  getAllFAQsByLanguage,
  getFAQsById,
  createFAQ,
} from "../controllers/faqControllers";

const router = express.Router();

/**
 * Route to get all FAQs with translations based on the 'lang' query parameter
 * Example: /faqs?lang=hi (for Hindi translation)
 */

/**
 * API to get all the FAQ's in given language
 */
router.get("/faqs/all", getAllFAQsByLanguage);

/**
 * API to get all FAQ's along with ID's in given language
 */
router.get("/faqs/ids", getAllFAQsByIds);

/**
 * API to get particular FAQ using ID in given language
 */
router.get("/faq-id/:id", getFAQsById);

/**
 * API to create a FAQ and see its translation in particular language (optional)
 * else display in en, hi, bn by default
 */
router.post("/faq/create", createFAQ);

export default router;