var TelegramHelper = require('./telegram'),
    telegram = new TelegramHelper(process.env.TOKEN),
    db = require('../models'),
    myCache = require('./cache');

var pickAnUser = function(msgId,data){ //CHOUSE USER
  db.Users.findAll({}).then(function(userList){
    var keyArray = telegram.arrayToKeyboard(userList,'name');
    telegram.sendMessage({chat_id: data.chat_id,
                          text: 'choose an user..',
                          replay_to: msgId,
                          keyboard: keyArray});
  });
};

var callbacks = {
  '/addword': {
      option : [
        pickAnUser,
        function(msgId,data){ //WRIATE A WORD
          telegram.sendMessage({chat_id: data.chat_id,
                                text: 'write a word..',
                                replay_to: msgId,
                                force_replay: true});// will need force replay object
        }
      ],
      exec: function(msgId,data){
        db.Users.findOne({id: data.option[0]}).then(function(user){
          db.PriWords.create({word: data.option[1]}).then(function(word){
            user.addPriWords(word).then(function(ris){
              console.log('create word %j',word);
              telegram.sendMessage({chat_id: data.chat_id,
                                    text: 'world('+data.option[1]+') add for user('+data.option[0]+')',
                                    replay_to: msgId});

            });
          });
        });//add the word to the database
      },
      admin: true
  },
  '/list': {
    option: [
      pickAnUser
    ],
    exec: function(msgId,data){
      console.log('OPTION: '+data.option[0]);
      db.Users.findOne({where:{name: data.option[0]}}).then(function(users){
          users.getPriWords().then(function(words){
            console.log('list word %j',words);
            var str=data.option[0]+'\n';
            for(var i=0; i<words.length; i++){
              str+=words.word+'\n';
            }
            telegram.sendMessage({chat_id: data.chat_id,
                                  text: str,
                                  replay_to: msgId});

          });

        });//add the word to the database
      },
      admin: false
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

var parseCommand = function(msgId, data){
  var cmdCB = callbacks[data.cmd],
      keyCache = ''+data.chat_id+data.from_id;

  if ( (cmdCB.admin && data.admin) || !cmdCB.admin){
    if (cmdCB.option && cmdCB.option.length > data.option.length)
      cmdCB.option[data.option.length](msgId, data);
    else{
      myCache.del(keyCache);
      cmdCB.exec(msgId,data);
    }
  }else {
    myCache.del(keyCache);
    telegram.sendMessage(data.chat_id,'Non sei admin!',msgId);
  }
};

module.exports = parseCommand;
