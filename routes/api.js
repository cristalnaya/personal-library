/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const dotenv = require('dotenv').config();
var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, client) => {
        client.db('FCC').collection('personal-library').find({}, {
          _id: 1,
          title: 1,
          commentcount: 1
        }).toArray((err, data) => {
          if(err) {
            res.status(400);
            res.send(`Connection ${err}`);
          }
          res.send(data)
          client.close();
        });
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including at least _id and title
      if(!title) {
        res.status(400);
        res.send('Missing title')
        return
      }
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, client) => {
        client.db('FCC').collection('personal-library').insertOne({
          title, commentcount: 0, comments: []
        }, (err, data) => {
          if(err) {
            res.status(400);
            res.send(`Connection ${err}`);
          } else {
            let obj = {
              _id: data.ops[0]._id,
              title: title
            };
            res.send(obj);
          }
          client.close();
        })
      });

    })
    
    .delete((req, res) => {
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, client) => {
        client.db('FCC').collection('personal-library').deleteMany({}, (err, data) => {
          if(err) {
            res.status(400);
            res.send(`Connection ${err}`);
          } else {
            res.send('complete delete successful');
          }
          client.close();
        })
      });

    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        let id = ObjectId(bookid);
      } catch (err) {
        res.status(400);
        res.send(`Book doesn't exist`)
        return
      }
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, client) => {
        client.db('FCC').collection('personal-library').find({
          _id: ObjectId(bookid)
        }).toArray((err, data) => {
          if(err) {
            res.status(400);
            res.send(`Connection ${err}`);
          }
          res.send(data[0]);
          client.close();
        });
      });

    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      if(!bookid) {
        res.status(400);
        res.send('Missing title')
        return
      }
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, client) => {
        client.db('FCC').collection('personal-library').findOneAndUpdate({
          _id: ObjectId(bookid)
        }, {
          $push: {
            comments: comment
          },
          $inc: {
            commentcount: 1
          }
        }, {
          returnOriginal: false
        }, (err, data) => {
          if(err) {
            res.status(400);
            res.send(`Connection ${err}`);
          }
          res.send(data.value);
          client.close();
        });
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err, client) => {
        client.db('FCC').collection('personal-library').deleteMany({}, (err, data) => {
          if(err) {
            res.status(400);
            res.send(`Connection ${err}`);
          } 
          res.send('delete successful');
          client.close();
        });
      });
    });
  
};
