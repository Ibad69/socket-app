
const config = require('../config');
const logger = require('../logger');
const Mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

Mongoose.connect(config.dbURI);
Mongoose.connection.on('error', error => {
  logger.log('error','the error is ' +  error);
});

//creating a schema

const chatUser = new Mongoose.Schema({

    profileId: String,
    fullName: String,
    profilePic: String,
});


let userModel = Mongoose.model('chatUser', chatUser);


const chatRooms = new Mongoose.Schema({

      room: String,
      roomID: String,
      users: {

          socketID: String,
          userID: String,
          user: String,
          userPic: String,

      }
})



module.exports = {
  Mongoose,
  userModel
}
