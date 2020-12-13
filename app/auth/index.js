const  passport = require('passport');
const config = require('../config');
const h = require('../helpers');


const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = () => {


    passport.serializeUser((user, done) =>{
      done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{
        //finding the user by its id.
        h.findById(id)
            .then(user => done(null, user))
            .catch(error => console.log('error finding the user'))
    });

    let authProcessor = (accessToken, refreshToken, profile, done) => {
        //finds a user in the local db using profile.id, if the user is found it  returns the user data using the done function
        //if not found we will have to create one in the local db and return.

        h.findOne(profile.id)
            .then(result => {
              if(result){
                done(null, result);
              } else {
                //creating a new user and return
                h.createNewUser(profile)
                    .then(newChatUser => done(null, newChatUser))
                    .catch(error => console.log('error crreating'))
              }
            });
    }

    passport.use(new FacebookStrategy(config.fb, authProcessor))
}
