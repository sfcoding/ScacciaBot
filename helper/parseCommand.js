var TelegramHelper = require('./telegram');
var telegram = new TelegramHelper(process.env.TOKEN);
var db = require('../models');

var callbacks = {
  '/addword': {
      option : [
        function(msgId,data){ //CHOUSE USER
          db.Users.findAll({}).then(function(userList){
            var keyArray = telegram.arrayToKeyboard(userList,'name');
            telegram.sendMessage({chat_id: data.chat_id,
                                  text: 'choose an user..',
                                  replay_to: msgId,
                                  keyboard: keyArray});
          });
        },
        function(msgId,data){ //WRIATE A WORD
          telegram.sendMessage({chat_id: data.chat_id,
                                text: 'write a word..',
                                replay_to: msgId,
                                force_replay: true});// will need force replay object
        }
      ],
      exec: function(msgId,data){
        db.Users.findOne({id: data.option[0]}).then(function(user){
          user.createPriWords({word: data.option[1]}).then(function(word){
            console.log('create word %j',word);
          });//add the word to the database
        });
      },
      admin: true
  },
  '/help': {
    option: null,
    exec: function(msgId,data){
      telegram.sendMessage({chat_id: data.chat_id,
                            text: 'lista comandi',
                            replay_to: msgId});
    },
    admin: false
  }
};

var parseCommand = function(msgId, data, myCache){
  var cmdCB = callbacks[data.cmd];
  if (cmdCB.admin==data.admin){
    if (cmdCB.option && cmdCB.option.length > data.option.length)
      cmdCB.option[data.option.length](msgId, data);
    else{
      myCache.del(''+data.chat_id+data.from_id);
      cmdCB.exec(msgId,data,myCache);
    }
  }else {
    myCache.del(''+data.chat_id+data.from_id);
    telegram.sendMessage(data.chat_id,'Non sei admin!',msgId);
  }
};

module.exports = parseCommand;
