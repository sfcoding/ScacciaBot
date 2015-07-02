var TelegramHelper = require('./telegram');
var telegram = new TelegramHelper(process.env.TOKEN);
var callbacks = {
  '/addword': {
      option : [
        function(msgId,data){
          telegram.sendMessage();
        }
      ],
      exec: function(msgId,data,myCache){

      },
      admin: true
  },
  '/help': {
    option: null,
    exec: function(msgId,data,myCache){
      telegram.sendMessage(data.chat_id,'lista comandi',msgId,[['1','2','3'],['4','5','6'],['7','8','9']]);
      myCache.del(''+data.chat_id+data.from_id);
    },
    admin: false
  }
};

var parseCommand = function(msgId, data, myCache){
  var cmdCB = callbacks[data.cmd];
  if (cmdCB.admin==data.admin){
    if (cmdCB.option && cmdCB.option.length > data.option.length)
      cmdCB.option[data.option.length](msgId, data);
    else
      cmdCB.exec(msgId,data,myCache);
  }else {
    telegram.sendMessage(data.chat_id,'Non sei admin!',msgId);
  }
};

module.exports = parseCommand;
