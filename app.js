var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');

var login = require('./routes/login');
var superLogin = require('./routes/superLogin');
var superMain = require('./routes/super');
var main = require('./routes/main');
var gallery = require('./routes/gallery');
var market = require('./routes/market'); 
var myinfo = require('./routes/myinfo');
var message = require('./routes/message');

var app = express();

//Session Set
app.use(session({
    secret:'Secret key',
    resave:false,
    saveUninitialized:true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port',65004);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login',login);
app.use('/superLogin',superLogin);
app.use('/super',superMain);
app.use('/main', main);
app.use(express.static('./views'));
app.use('/gallery',gallery);
app.use('/market', market);
app.use('/myinfo',myinfo);
app.use('/',message);

var client_id = 'uRqh5LYASazrMiYjyM6D';
var state = "RANDOM_STATE";
var redirectURI = encodeURI("http://203.249.127.60:65004/login/oAuth");

app.get('/',function(req,res){
    var api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
   res.render('login',{api_url:api_url}); 
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(app.get('port'), function(req,res){
  console.log('Server running');
});

module.exports = app;
