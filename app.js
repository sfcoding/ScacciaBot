/**
 * Module dependencies
 */
var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorhandler = require('errorhandler'),
  morgan = require('morgan'),
  request = require('request'),
  path = require('path'),
  fs = require('fs'),
  winston = require('winston'),
  expressWinston = require('express-winston'),

  db = require("./models"),
  telegramHeper = require('./lib/telegramAPI'),
  parseCommand = require('./helper/setCommands');
  //myCache = require('./helper/cache');

var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('env', process.env.NODE_ENV || 'development');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var TOKEN = process.env.TOKEN;
var WEBHOOK_URL = process.env.WEBHOOK_URL;
var BOT_NAME = process.env.BOT_NAME;
var telegram = new telegramHeper(TOKEN);
//var myCache =  new NodeCache( { stdTTL: 60/*, checkperiod: 120*/} );

// development only
if ('development' == app.get('env')) {
  console.log("development");
}

// production only
if ('production' == app.get('env')) {
  console.log("production");
  telegram.setWebHook(WEBHOOK_URL,function(data){
    if(data)
      console.log(data);
  });
}


/*
var mongoose = require('mongoose');
mongoose.connect('mongodb://'+app.get('mongodb_uri')+'/personal', function(err) {
    if(err) {
        console.log('connection error', err);

    } else {
        console.log('connection successful');
        var test = require('./test/testdata.js');
        test.me();
        test.education();
        test.experience();
        test.projects();
        test.skills();
    }
});
*/

/**
 * Routes
 */

app.get('/',function(req,res,next){
  res.send('Working!');
});

//app.use('/debugdb',require('./routes/debugDB'));

var TelegramCommands = require('./lib/telegramCommands');
var tc = new TelegramCommands(BOT_NAME);
require('./helper/setCommands')(tc);


app.post('/update', function(req, res, next) {
  //console.log('update!  %j', req.body);

  //parse all variable
  var message = req.body.message;
  var chatId = message.chat.id;
  var fromId = message.from.id;
  var messageId = message.message_id;
  var text = message.text;

  db.Users.findOne({ where: {id: fromId} }).then(function(user){
    tc.parseCommand(message, function(cmd,msg,data){
      if (cmd)
        return !data.admin || user.admin;
      else{
        //is not a command
      }
    });
  });
  res.send('ok');
});

/**
 * ERROR
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development only
if (app.get('env') === 'development') {
  app.use(errorhandler());
  // development error handler
  // will print stacktrace
  /*app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status = (err.status || 500));
    res.render('error', {
      message: err.message,
      error: err
    });
  });*/
}

// production only
if (app.get('env') === 'production') {
  //DEBUG_FILE
  /*var logDirectory = __dirname + '/log';
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
  app.use(expressWinston.errorLogger({
      transports: [
        new winston.transports.File({
          filename: logDirectory+'/error.log'
        })
      ],
      level: 'error'
    }));
    */
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status = (err.status || 500));
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  //For PASSENGER
  db.sequelize.sync().then(function () {
    app.listen();
    require('./test/dbdata')();

    //MODADMIN
    //require('./test/addAdmin')();
  });
}

/**
 * Start Server
 */
/*
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
*/
