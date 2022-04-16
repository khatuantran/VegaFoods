const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const userController = require('../controllers/authController');

passport.use(new LocalStrategy(
    function (email, password, done) {
        userController.findUserByEmail(email)
            .then(user => {
                
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                
                userController.isValidPassword(password,user)
                    .then(result =>{
                        if(!result) {
                            done(null, false, { message: 'Incorrect password.' });
                        } else done(null, user);
                    })                 
            })

  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});
module.exports = passport;