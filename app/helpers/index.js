const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');
const passport = require('passport');
const session = require('express-session');

let _registerRoutes = (routes, method)  => {

        for(let key in routes){

            if(typeof routes[key] == 'object' && routes[key] !== null & !(routes[key] instanceof Array)){

                    _registerRoutes(routes[key], key); // here the key is 'get'/'post' or maybe further down '/', 'rooms' changing through every traverse.
            }
            else{
              // Register the routes
              if(method === 'get'){

                router.get(key, routes[key]);
              }
              else if(method === 'post'){
                router.post(key, routes[key]);
              } else {
                router.use(routes[key]);
              }
            }
        }

}

let route = routes => {

    _registerRoutes(routes);
    return router;

}


//find a single document based on a key.

let findOne  = profileID => {
  return db.userModel.findOne({
    'profileId': profileID
  });
}

let createNewUser = profile => {
  return new Promise((resolve, reject)=> {
    let newChatUser = new db.userModel({
      profileId: profile.id,
      fullName: profile.displayName,
      profilePic: profile.photos[0].value || ''
    });

    newChatUser.save(error => {
      if(error){
        console.log(error);
        reject(error);
      }
      else{
        resolve(newChatUser);
      }
    })
  });
}

let findById = id => {
  return new Promise((resolve, reject)=> {
      db.userModel.findById(id, (error, user)=>{
        if(error){
          reject(error);
        }
        else{
          resolve(user);
        }
      });
  });
}


// a middleware that checks to see if the user is authenticated and logged in.

let isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()){
    next();
  }
  else {
    res.redirect('/');
  }
}


//find room by name

let findRoomByName = (allrooms, room) => {
// more details on this find index in the vid.
    let findRoom = allrooms.findIndex((element, index, array)=> {

        if(element.room === room) {
            return true;
        } else {
          return false;
        }

    });


}

//function to generate unique room id for us

let randomHex = () => {
  return crypto.randomBytes(24).toString('hex');
}

let findRoomById = (allrooms, roomID) => {
  return allrooms.find((element, index, array)=> {
    if(element.roomID === roomID){
      return true;
    }
    else {
      return false;
    }
  });
}

//add a user to a chatRoomsList
let addUserToRoom = (allrooms, data, socket) => {
  //get the room object
  let getRoom = findRoomById(allrooms, data.roomID);
  //checking if the room exists
  if(getRoom !== undefined){
    //fetching the active users session id/ object id which does not change for the user in socket, socket id changes on every connection
    console.log(socket.request.session);
    let userID = socket.request.session.passport.user;

    // checking to see if the user already exists in the chatroom
    let checkUser = getRoom.users.findIndex((element, index, array)=> {
      if(element.userID === userID){
          return true;

      } else {
        return false;
      }
    });
    //if the user is alreraedy present in room, remove him first.
    if(checkUser > -1){
      getRoom.users.splice(checkUser, 1);
    }
    //push the user into the room's users Array
    getRoom.users.push({
      socketID: socket.id,
      userID,
      user: data.user,
      userPic: data.userPic
    });
    //join the room channel that specific channel


    socket.join(data.roomID);

    //return the updated room object
    return getRoom;
  }
}

//find and purge the user when a socket disconnects

let removeUserFromRoom = (allrooms, socket) => {

  for(let room of allrooms){
    //find the user
    let findUser = room.users.findIndex((element, index, array)=>{
      if(element.socketID === socket.id){
        return true;
      }
      else {
        return false;
      }
      //return element.socketID === socket.id ? true : false
    });
    if(findUser > -1){
      socket.leave(room.roomID);
      room.users.splice(findUser, 1);
      return room;
    }
  }
}



module.exports = {

  route: route,
  findOne,
  createNewUser,
  findById,
  isAuthenticated,
  findRoomByName,
  randomHex,
  findRoomById,
  addUserToRoom,
  removeUserFromRoom
}
