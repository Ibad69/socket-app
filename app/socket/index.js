const passport = require('passport');
const session = require('express-session');
const h = require('../helpers');

module.exports = (io, app) => {


      let allrooms = app.locals.chatrooms;




      io.of('/roomslist').on('connection', socket => {

            socket.on('getChatRooms', ()=> {

              socket.emit('chatRoomsList', JSON.stringify(allrooms));
          });

            socket.on('createNewRoom', newRoomInput => {

              //check to see if a room with the same title exists or not, if not, create one and broadcast it to eveeeryone.

              if(!h.findRoomByName(allrooms, newRoomInput)){
                //create a new room and broadcast it to eveeeryone

                allrooms.push({
                  room: newRoomInput,
                  roomID: h.randomHex(),
                  users: []
                });

                //broadcasting by emitting socket

                socket.emit('chatRoomsList', JSON.stringify(allrooms));
                //emit an update list to everyone the above function only emits to the current socket

                socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
              }
          });

        console.log('connected to the client');
      });


      io.of('/chatter').on('connection', socket => {
        //join a chatroom listening
        socket.on('join', data => {
          let usersList = h.addUserToRoom(allrooms, data, socket);

          //updated list of active users who are currently in the chat  room
          console.log('usersList:', usersList);
          socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
			    socket.emit('updateUsersList', JSON.stringify(usersList.users));
        });
        //when a socket exists
        socket.on('disconnect', () => {
        // find the room, to which the socket is connected to and purge the user
        let room = h.removeUserFromRoom(allrooms, socket);
        socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
      });


      //when a new message arrives

      socket.on('newMessage', data => {
  			socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
  		});



      });
}

//how socket io is working here that in the front end we are using js scrript tags to start a socket event and we are listening to them here for example the chatter
//event started from the front end and now are listening it in the backend/server and responding to it accordinglyy.
