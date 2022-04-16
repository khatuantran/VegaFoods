const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const shopRouter = require('./routes/shop');
const blogRouter = require('./routes/blog');
const contactRouter = require('./routes/contact');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const passport = require('./api/passport');
const middleware = require('./middlewares/middleware');




const app = express();
// view engine setup
require('./views/hbs-config');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(middleware.loginCheck)
app.use('/', indexRouter);
app.use('/auth', authRouter);

app.use('/users', usersRouter);
app.use('/shop-grid', shopRouter)
app.use('/blog', blogRouter);
app.use('/contact', contactRouter);
app.use('/shoping-cart', middleware.loginGuard, cartRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
