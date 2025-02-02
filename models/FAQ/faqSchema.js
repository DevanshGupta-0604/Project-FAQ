import mongoose from 'mongoose';

// Define the FAQ Schema
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true, // The question field is required
  },
  answer: {
    type: String,
    required: true, // The answer field is required
  },
  translations: {
    type: Map,
    of: String, // Store translations as key-value pairs
    default: {},
  },
}, {
  timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
});

// Method to dynamically retrieve translated text based on a given language
faqSchema.methods.getTranslationText = function(lang) {
  return {
    question: this.translations[`question_${lang}`], 
    answer: this.translations[`answer_${lang}`],  
  };
};

// Create the model using the schema
const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;