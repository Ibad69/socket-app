const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('../config');
const db = require('../db')

if(process.env.NODE_ENV === 'production'){

    module.exports = session({

          secret: config.sessionSecret,
          resave: false,
          saveUninitialized: false,
          store: new MongoStore ({
              mongooseConnection: db.Mongoose.connection
          })                               //storing session data into something
    });
}
 else {

      module.exports = session({
            secret: config.sessionSecret,
            resave: false,
            saveUninitialized: true
      });

 }
