const express = require('express');
const app = express();
const chatCat = require('./app'); // we have created a router instance in the index.js file and this is pointing to that.
const passport = require('passport');
const session = require('express-session');

app.set('port', process.env.PORT || 3000);
app.use(express.static('public')); // remove the . before the slash in your html files to invoke the css and other styling features.
app.set('view engine', 'ejs');
//app.set('views', './views'); this statement is going to set the views folder change it if you want to.

//  this is a middleware function, which includes a req and a response stream and next we need to do the next() step to move it forward.
// let helloMiddleWare = (req, res, next) => {
//
//     req.hello = "hello its me";
//     next();
//
// }

// in this step we are plugging in the middlware function
//app.use(helloMiddleWare);

app.use(chatCat.session);
app.use(passport.initialize());
app.use(passport.session());
// app.use(require('morgan')('combined'), {
//   stream: {
//     write: message => {
//       //writing to logs
//       chatCat.logger.log('info', message);
//     }
//   }
// });

app.use('/', chatCat.router); // here we are defining the root route to use the chatCat.router aka index.js file router config.



chatCat.ioServer(app).listen(app.get('port'), ()=> {
  console.log("the server is running");
});
