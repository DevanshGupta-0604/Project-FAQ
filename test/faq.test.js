import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';  // Import express app
import FAQ from '../models/FAQ/faqSchema';  // FAQ model
import mongoose from 'mongoose';
import dbConnection from '../database/FAQ/faqConnection';

chai.use(chaiHttp);
chai.should();

describe('FAQs API', () => {
  // Before each test, connect to the DB and clean up any existing records
  before(async () => {
    await dbConnection();
  });

  beforeEach(async () => {
    await FAQ.deleteMany({});  // Clear all FAQs before each test
  });

  after(async () => {
    await mongoose.disconnect();  // Disconnect after tests
  });

  // Test the POST /api/faqs route
  describe('POST /api/faqs', () => {
    it('should create a new FAQ', async () => {
      const faq = {
        question: 'What is Node.js?',
        answer: 'Node.js is a JavaScript runtime.',
      };

      const res = await chai.request(server)
        .post('/api/faqs')
        .send(faq);

      res.should.have.status(200);
      res.body.should.have.property('question').eql(faq.question);
      res.body.should.have.property('answer').eql(faq.answer);
    });

    it('should return a validation error if required fields are missing', async () => {
      const faq = {
        question: 'What is Node.js?',
      };

      const res = await chai.request(server)
        .post('/api/faqs')
        .send(faq);

      res.should.have.status(400);  // Assuming validation fails with 400 status
      res.body.should.have.property('error');
    });
  });

  // Test the GET /api/faqs route with translation
  describe('GET /api/faqs', () => {
    it('should retrieve FAQs in the default language (English)', async () => {
      const faq = new Faq({
        question: 'What is Node.js?',
        answer: 'Node.js is a JavaScript runtime.',
      });
      await faq.save();

      const res = await chai.request(server)
        .get('/api/faqs?lang=en');

      res.should.have.status(200);
      res.body[0].should.have.property('question').eql(faq.question);
      res.body[0].should.have.property('answer').eql(faq.answer);
    });

    it('should retrieve translated FAQ in Hindi', async () => {
      const faq = new Faq({
        question: 'What is Node.js?',
        answer: 'Node.js is a JavaScript runtime.',
        translations: {
          question_hi: 'Node.js क्या है?',
          answer_hi: 'Node.js एक जावास्क्रिप्ट रनटाइम है।',
        },
      });
      await faq.save();

      const res = await chai.request(server)
        .get('/api/faqs?lang=hi');

      res.should.have.status(200);
      res.body[0].should.have.property('question').eql('Node.js क्या है?');
      res.body[0].should.have.property('answer').eql('Node.js एक जावास्क्रिप्ट रनटाइम है।');
    });

    it('should return default language (English) if translation is not available', async () => {
      const faq = new Faq({
        question: 'What is Node.js?',
        answer: 'Node.js is a JavaScript runtime.',
      });
      await faq.save();

      const res = await chai.request(server)
        .get('/api/faqs?lang=hi'); // Query for Hindi, but no translation available

      res.should.have.status(200);
      res.body[0].should.have.property('question').eql(faq.question);
      res.body[0].should.have.property('answer').eql(faq.answer);
    });
  });
});
