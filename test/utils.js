import FAQ from '../models/FAQ/faqSchema';

// Utility function to create a FAQ with optional language
export const createFAQ = async ({ question = 'What is Node.js?', answer = 'Node.js is a JavaScript runtime.', lang = 'en' } = {}) => {
  const faq = new FAQ({
    question,
    answer,
    translations: {
      question_hi: lang === 'hi' ? 'Node.js क्या है?' : undefined,
      answer_hi: lang === 'hi' ? 'Node.js एक जावास्क्रिप्ट रनटाइम है।' : undefined,
    },
  });

  await faq.save();
  return faq;
};
