import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';  // Import your express app
import FAQ from '../models/FAQ/faqSchema';  // FAQ model
import { createFAQ } from './utils';  // Utility functions for creating FAQ and cleaning DB

chai.use(chaiHttp);
chai.should();

// Test setup: Ensure to import the setup file so that beforeEach, afterEach work correctly
import './setup'; // Import the setup for database and server initialization

  // Test the POST /api/faq/create route (creating FAQs)
  describe('POST /api/faq/create', () => {
    it('should create a new FAQ in default English if language not specified', async () => {
      const faq = {
        question: 'What is Node.js?',
        answer: 'Node.js is a JavaScript runtime.',
      };

      const res = await chai.request(server)
        .post('/api/faq/create')
        .send(faq);

      res.should.have.status(200);
      res.body.should.have.property('question_en').eql(faq.question);
      res.body.should.have.property('answer_en').eql(faq.answer);
    });

    it('should create a new FAQ with translations when lang is provided', async () => {
      const faq = {
        question: 'What is Node.js?',
        answer: 'Node.js is a JavaScript runtime.',
        lang: 'hi', // Specify Hindi translation
      };

      const res = await chai.request(server)
        .post('/api/faq/create')
        .send(faq);

      res.should.have.status(200);
      res.body.should.have.property('question_en').eql(faq.question);
      res.body.should.have.property('answer_en').eql(faq.answer);
      res.body.should.have.property('question_hi').eql('Node.js क्या है?');
      res.body.should.have.property('answer_hi').eql('Node.js एक जावास्क्रिप्ट रनटाइम है।');
    });

    it('should return a validation error if required fields are missing', async () => {
      const faq = {
        question: 'What is Node.js?',
      };

      const res = await chai.request(server)
        .post('/api/faq/create')
        .send(faq);

      res.should.have.status(400);
      res.body.should.have.property('error').eql('Question and answer are required.');
    });
  });

  // Test the GET /api/faqs route with language parameter (fetching all FAQs)
  describe('GET /api/faqs', () => {
    it('should retrieve FAQs in the default language (English) if not specified or not valid', async () => {
      const faq = await createFAQ(); // Create a FAQ using the utility function

      const res = await chai.request(server)
        .get('/api/faqs?lang=unsupported_Lang');

      res.should.have.status(200);
      res.body[0].should.have.property('question').eql(faq.translations.question_en);
      res.body[0].should.have.property('answer').eql(faq.translations.answer_en);
    });

    it('should retrieve translated FAQ in Hindi', async () => {
      const faq = await createFAQ({ lang: 'hi' }); // Create a FAQ with Hindi translation

      const res = await chai.request(server)
        .get('/api/faqs?lang=hi');

      res.should.have.status(200);
      res.body[0].should.have.property('question').eql(faq.translations.question_hi);
      res.body[0].should.have.property('answer').eql(faq.translations.answer_hi);
    });
  });

  // Test the GET /api/faqs/ids route (fetching all FAQs with IDs)
  describe('GET /api/faqs/ids', () => {
    it('should retrieve FAQ IDs and translated questions', async () => {
      const faq = await createFAQ();

      const res = await chai.request(server)
        .get('/api/faqs/ids'); // Return in English by default since language not specified
      // Same result will be generated if language not supported

      res.should.have.status(200);
      res.body[0].should.have.property('id').eql(faq._id.toString());
      res.body[0].should.have.property('FAQ').that.is.an('object');
      res.body[0].FAQ.should.have.property('question').eql(faq.translations.question_en);
      res.body[0].FAQ.should.have.property('answer').eql(faq.translations.answer_en);
    });

    it('should return translated FAQ with IDs', async () => {
      const faq = await createFAQ({ lang: 'hi' });

      const res = await chai.request(server)
        .get('/api/faqs/ids?lang=hi');

      res.should.have.status(200);
      res.body[0].should.have.property('id').eql(faq._id.toString());
      res.body[0].should.have.property('FAQ').that.is.an('object');
      res.body[0].FAQ.should.have.property('question').eql(faq.translations.question_hi);
      res.body[0].FAQ.should.have.property('answer').eql(faq.translations.answer_hi);
    });
  });

  // Test the GET /api/faq-id/:id route (fetching a single FAQ by ID)
  describe('GET /api/faq-id/:id', () => {
    it('should retrieve a specific FAQ by ID in the default English language', async () => {
      const faq = await createFAQ();

      const res = await chai.request(server)
        .get(`/api/faq-id/${faq._id}`); // Since language not passed

      res.should.have.status(200);
      res.body.should.have.property('question').eql(faq.translations.question_en);
      res.body.should.have.property('answer').eql(faq.translations.answer_en);
    });

    it('should retrieve translated FAQ by ID in Hindi', async () => {
      const faq = await createFAQ({ lang: 'hi' });

      const res = await chai.request(server)
        .get(`/api/faq-id/${faq._id}?lang=hi`);

      res.should.have.status(200);
      res.body.should.have.property('question').eql(faq.translations.question_hi);
      res.body.should.have.property('answer').eql(faq.translations.answer_hi);
    });
  });
});
