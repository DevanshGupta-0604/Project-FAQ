import translate from '../../config/googleTranslate'; 
import FAQ from '../../models/FAQ/faqSchema';  // Import the FAQ model
import { setCachedTranslation, getCachedTranslation } from '../cache';  // Import the Redis caching driver

// Helper function to translate text using Google Cloud Translation API
/**
 * Translate text using Google Cloud Translation API.
 * @param {String} text - The text to translate.
 * @param {String} targetLang - The target language code (e.g., 'en', 'es', 'fr').
 * @returns {Promise<String>} - The translated text.
 */
const translateText = async (text, targetLang) => {
  try {
    const [translation] = await translate.translate(text, targetLang);
    return translation;  // Return the translated text
  } catch (err) {
    console.error('Error during translation:', err);
    throw new Error(`Failed to translate text: ${err.message}`);
  }
};

// Helper function to translate and update database with specified language
/**
 * Translates the FAQ and saves the translation to the translations attribute if not already present.
 * Uses Redis for caching.
 * 
 * @param {Object} faq - The FAQ object that contains the translations.
 * @param {String} lang - The language code to translate to (e.g., 'en', 'hi', 'bn').
 * @returns {Object} The translated FAQ with translations saved in the document.
 */
const translateFAQ = async (faq, lang) => {
  const languageToRender = lang || 'en'; // Default to 'en' if no language is specified

  // Construct the Redis key for caching the translation
  const redisKey = `faq:${faq._id}:translation:${languageToRender}`;

  // Check Redis cache first for the translation
  const cachedTranslation = await getCachedTranslation(redisKey);
  if (cachedTranslation) {
    console.log('Translation found in cache');
    // Map the cached translation back to the FAQ object
    faq.translations[`question_${languageToRender}`] = cachedTranslation.question;
    faq.translations[`answer_${languageToRender}`] = cachedTranslation.answer;
    return faq;
  }

  try {
    // If no translation exists, attempt to translate the question and answer
    const translatedQuestion = existingQuestionTranslation || await translateText(faq.question, languageToRender);
    const translatedAnswer = existingAnswerTranslation || await translateText(faq.answer, languageToRender);

    // Prepare the updated translation object
    const updatedTranslations = {
      [`question_${languageToRender}`]: translatedQuestion,
      [`answer_${languageToRender}`]: translatedAnswer,
    };

    // Update the FAQ document in the database with the new translations
    await FAQ.updateOne(
      { _id: faq._id },
      { $set: { translations: { ...faq.translations, ...updatedTranslations } } }
    );

    // Cache the translation in Redis
    await setCachedTranslation(redisKey, { question: translatedQuestion, answer: translatedAnswer });

    // Update the FAQ object in memory with the new translations
    faq.translations = { ...faq.translations, ...updatedTranslations };

    return faq;

  } catch (err) {
    console.error('Translation Error:', err);
    // Handle error when translation fails
    throw new Error(`Unable to translate FAQ into ${languageToRender}. ${err.message}`);
  }
};

/**
 * Checks for FAQ in given language within database and translate the text if not present
 * in particular translation
 * 
 * @param {Object} faq - The FAQ object that contains the translations.
 * @param {String} lang - The language code to translate to (e.g., 'en', 'hi', 'bn').
 * @returns {Object} The translated FAQ with translations saved in the document.
 */
export const getTranslatedFAQ = async (faq, lang) => {
  try {
    // Retrieve data from database
    const textFAQ = faq.getTranslationText(lang);

    // Check whether translation available
    if(!textFAQ.question || !textFAQ.answer){
      textFAQ = translateFAQ(faq, lang);
      textFAQ = {
        question: textFAQ.translations[`question_${lang}`],
        answer: textFAQ.translations[`answer_${lang}`]
      }
    }
    return textFAQ;

  } catch(err) {
    throw new Error(`ERROR: Error will translating. ${err.message}`)
  }
}