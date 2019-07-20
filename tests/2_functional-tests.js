/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end((err, res) => {
  //       console.log(res.body[0])
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: 'Test Title'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'Test Title')
          assert.property(res.body, '_id')
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.text, 'Missing title', 'return error')
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
   
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'Response should be array')
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount')
          assert.property(res.body[0], 'title', 'Books in array should contain title')
          assert.property(res.body[0], '_id', 'Books in array should contain _id')
          done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      const id = '5d303833b2f2ad2fa37d91d9';
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/fakeId')
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.text, "Book doesn't exist")
          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get(`/api/books/${id}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'Test Title', 'Book should contain title')
          assert.property(res.body, '_id', 'Book should contain id')
          assert.property(res.body, 'comments', 'Book should contain comments')
          done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      const id = '5d303833b2f2ad2fa37d91d9';

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post(`/api/books/${id}`)
        .send({
          comment: 'Test comment'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'Test Title', 'Title should match data sent')
          assert.property(res.body, '_id', 'Book should contain id')
          assert.property(res.body, 'comments', 'Book should contain comments')
          assert.equal(res.body.comments[0], 'Test comment', 'Book should have posted comments')
          done();
        })
      });
      
    });

  });

});
