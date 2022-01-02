const router = require('express').Router();
const session = require('express-session');
const h = require('../helpers');
const passport = require('passport');
const config = require('../config');


module.exports = () => {




  let routes = {

        'get': {
          '/': (req, res, next) => {
              res.render('login');
          },

          '/rooms': [h.isAuthenticated, (req, res, next) => {
              res.render('rooms', {
                user: req.user,
                host: config.host
              });
          }],

          '/chat/:id': [h.isAuthenticated, (req, res, next) => {
            //finding a chatroom with the given // ID
            // render it if the id is found
            let getRoom = h.findRoomById(req.app.locals.chatrooms, req.params.id);

            if(getRoom === undefined){
              return next();
            }

            else{
              res.render('chatroom', {
                user: req.user,
                host: config.host,
                room: getRoom.room,
                roomID: getRoom.roomID
              });
            }


          }],

          '/auth/facebook': passport.authenticate('facebook'),
          '/auth/facebook/callback': passport.authenticate('facebook', {

                successRedirect: '/rooms',
                failureRedirect: '/'
          }),

          '/logout' : (req, res, next) => {
            req.logout();
            res.redirect('/');
          }



//////////////////////////////////////////////////////////////////

        },
/////////////////////////////////////////////////////

        'post': {

        },
        'NA': (req, res, next) => {
          res.status(404).sendFile(process.cwd()+ '/views/404.htm');
        }

  }



// let registerRoutes = (routes, method)  => {
//
//         for(let key in routes){
//
//             if(typeof routes[key] == 'object' && routes[key] !== null & !(routes[key] instanceof Array)){
//
//                     registerRoutes(routes[key], key); // here the key is 'get'/'post' or maybe further down '/', 'rooms' changing through every traverse.
//             }
//             else{
//               // Register the routes
//               if(method === 'get'){
//
//                 router.get(key, routes[key]);
//               }
//               else if(method === 'post'){
//                 router.post(key, routes[key]);
//               }
//             }
//         }
//
// }


          return h.route(routes); // this is how you can import this function and use it in your other projects too.


}

// Iterate through the routes object and mount the routes
// so how this function works is on the first check it is going to check and get the value from the objects like get after checking all of the conditions the if block
// is going to recall/recursively the same function but this time the function will have the value key aka 'get' or 'post' on the first check then it will check for the routes
//now looking at the routes values it will see that these are not objects but function it is going to stop and go in to the else block.
//the key variable is going to traverse through the object for eg if in the first run it is get and traversing through get in the second it will traverse through the other route handlers
