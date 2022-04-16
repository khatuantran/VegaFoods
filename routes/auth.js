const express = require('express');
const authController = require('../controllers/authController')
const router = express.Router();
const passport = require('../api/passport');
const randomString = require('randomstring')
const modelUser = require('../models/user')
const activeAccountMailSender = require('../api/activeAccount')
/* GET home page. */
router.all('/',  (req, res) => res.redirect('/auth/login'));
router.get('/login',  authController.renderLogin);

router.post('/login', function(req, res, next) {
  /* look at the 2nd parameter to the below call */
  passport.authenticate('local', function(err, user) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login?wrongPassword'); }
    //check if account has'n activated then send a new string active for user email
    if(!user.isActivated){
      const newActiveString = randomString.generate();
      modelUser.updateOne({email: user.email}, {activationString: newActiveString})
        .then(doc => {
            activeAccountMailSender(user.email, newActiveString, req.hostname)
        })
      return res.render('email-checking')
    }

    //authenticate success then login for user
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      res.redirect(req.session.returnTo || '/');
      delete req.session.returnTo
    });

  })(req, res, next);
});

router.get('/logout', authController.logout)

module.exports = router;
