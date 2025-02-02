import FAQ from "../models/FAQ/faqSchema";
import { getTranslatedFAQ } from "./features/translation";
import supportedLanguages from "../database/Languages/googleLang";
import translate from "../config/googleTranslate";

/** All the Function will return in English by default if language not supported or specified **/

/*
 *Route to get all FAQs in particular language
 */
export const getAllFAQsByLanguage = async (req, res) => {
  const { lang } = req.query; // Get the language from the query parameter

  try {
    if (lang) {
      // Check if language is valid
      const supportedLang = supportedLanguages.find(
        (language) => language.language === lang
      );
      if (!supportedLang) {
        lang = "en"; // Set to English if the language is not supported
        res.json({ error: "Language is not supported" });
      }
    }

    const faqs = await FAQ.find();
    // Map the FAQ to translated question and answer
    const faqsInSelectedLanguage = faqs.map((faq) =>
      getTranslatedFAQ(faq, lang)
    );
    res.status(200).json(faqsInSelectedLanguage); // Return the translated FAQ's
  } catch (err) {
    res
      .status(500)
      .json({ error: `Error fetching FAQs by language. ${err.message}` });
  }
};

/*
 *Route to get all routes along with ids in particular language
 */
export const getAllFAQsByIds = async (req, res) => {
  const { lang } = req.query; // Get the language from the query parameter

  try {
    if (lang) {
      // Check if language is valid
      const supportedLang = supportedLanguages.find(
        (language) => language.language === lang
      );
      if (!supportedLang) {
        lang = "en"; // Set to English if the language is not supported
        res.json({ error: "Language is not supported" });
      }
    }

    const faqs = await FAQ.find();
    // Map the FAQ to translated question and answer
    const faqsInSelectedLanguage = faqs.map((faq) => {
      return { id: faq._id, FAQ: getTranslatedFAQ(faq, lang) };
    });
    res.status(200).json(faqsInSelectedLanguage); // Return the translated FAQ's
  } catch (err) {
    res
      .status(500)
      .json({ error: `Error fetching FAQs by language. ${err.message}` });
  }
};

/*
 *Route to get specific FAQ in particular language by Ids
 */
export const getFAQsById = async (req, res) => {
  const { lang } = req.query; // Get the language from the query parameter
  const { id } = req.params; // id will be passed as path parameter

  try {
    if (lang) {
      // Check if language is valid
      const supportedLang = supportedLanguages.find(
        (language) => language.language === lang
      );
      if (!supportedLang) {
        lang = "en"; // Set to English if the language is not supported
        res.json({ error: "Language is not supported" });
      }
    }

    const faq = await FAQ.findById(id);
    // Map the FAQ to translated question and answer
    const faqsInSelectedLanguage = getTranslatedFAQ(faq, lang);
    res.status(200).json(faqsInSelectedLanguage); // Return the translated FAQ's
  } catch (err) {
    res
      .status(500)
      .json({ error: `Error fetching FAQs by language. ${err.message}` });
  }
};

/*
 * Route to Create new FAQ in given language and view in particular language
 */
export const createFAQ = async (req, res) => {
  try {
    const { question, answer, lang } = req.body; // Extract data from the request body

    if (!question || !answer) {
      return res
        .status(400)
        .json({ error: "Question and answer are required." });
    }

    // Create a new FAQ document
    const newFAQ = new FAQ({
      question,
      answer,
      translations: {},
    });

    // Save the FAQ to the database
    await newFAQ.save();

    // Return a response with the newly created FAQ
    res.status(201).json(newFAQ);

    // Optionally translate the FAQ if a lang is provided
    if (lang) {
      // Display the FAQ in given language
      newFAQ = FAQ.findById(newFAQ._id);
      // Automate translation to 'en', 'hi', 'bn'
      const translateLanguage = ["en", "hi", "bn", lang];
      // create FAQ with all translations
      const initialDisplayFAQ = translateLanguage.map((lang) =>
        getTranslatedFAQ(newFAQ, lang)
      );

      res.json(initialDisplayFAQ);
    }
  } catch (err) {
    console.error("Error creating FAQ:", err);
    res.status(500).json({ error: `Failed to create FAQ. ${err.message}` });
  }
};