import AdminBro from 'admin-bro';
import AdminBroMongoose from '@admin-bro/mongoose';
import FAQ from '../../models/FAQ/faqSchema';
import { translateFAQ } from '../features/translation'; 
import supportedLanguages from '../../database/Languages/googleLang'; // List of languages supported

// Register Mongoose adapter for AdminBro
AdminBro.registerAdapter(AdminBroMongoose);

// Initialize AdminBro
const adminBro = new AdminBro({
  resources: [
    {
      resource: FAQ,
      options: {
        actions: {
          new: {
            before: async (request) => {
              try {
                // Extract the question, answer, and lang from the request payload
                const { question, answer, lang } = request.payload;
                
                // Check if both question and answer are provided
                if (!question || !answer) throw new Error("ERROR: Both question and answer are required.");

                // If translation is needed at the time of FAQ creation
                if (lang) {
                  // Check if the language is supported
                  const supportedLang = supportedLanguages.find(language => language.language === lang);
                  if (!supportedLang) {
                    console.log(`ERROR: Language ${lang.name} not supported.`);
                    lang = 'en'; // Set to English if the language is not supported
                  }

                  // Get the translated FAQ object and add it to the request
                  request.record = await translateFAQ(request.record, lang);
                }
                return request;

              } catch (err) {
                throw new Error(err.message);
              }
            },
            after: async (response) => {
              console.log(`FAQ with question: ${response.record.question} and answer: ${response.record.answer} is added.`);
              return response;
            },
          },
          delete: {
            before: async (request) => {
              console.log(`FAQ with question: ${request.record.question} and answer: ${request.record.answer} is about to be deleted.`);
              return request;
            },
            after: async (response) => {
              console.log(`FAQ has been deleted.`);
              return response;
            },
          },
          edit: {
            before: async (request) => {
              try {
                // Extract the language and check if translation is needed
                const { lang } = request.payload;

                if (lang) {
                  // Check if the language is supported
                  const supportedLang = supportedLanguages.find(language => language.language === lang);
                  if (!supportedLang) {
                    console.log(`ERROR: Language ${lang.name} not supported.`);
                    lang = 'en'; // Set to English if the language is not supported
                  }

                  // Translate the FAQ and update the record
                  request.record = await translateFAQ(request.record, lang);
                }
                return request;

              } catch (err) {
                throw new Error(err.message);
              }
            },
            after: async (response) => {
              console.log(
                `The translated FAQ is question: ${response.record.translations[`question_${response.payload.lang.language}`]} 
                and answer: ${response.record.translations[`answer_${response.payload.lang.language}`]}`
              );
              return response;
            },
          },
        },
        // Dynamically set listProperties based on available translations
        listProperties: (faq) => {
            let listProps = ['question', 'answer']; // Default properties
  
            // Add translations for each language
            supportedLanguages.forEach((lang) => {
              listProps.push(`question_${lang.langauge}`); // Dynamically add question_{lang}
              listProps.push(`answer_${lang.language}`);   // Dynamically add answer_{lang}
            });
  
            return listProps; // Return the dynamically generated list properties
        },
        editProperties: ['question', 'answer', 'translations'], // Edit view properties
        listActions: ['edit', 'delete', 'create']
      },
    },
  ],
  rootPath: '/admin', // Admin panel root URL
});


export default adminBro;