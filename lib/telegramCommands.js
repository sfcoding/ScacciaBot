var myCache = require('./cache');
var TelegramAPI = require('./telegramAPI');
var ParseCommandRes = require('./parseCommandRes');

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments[0];
    return this.replace(/{{(\w+)}}/g, function(match, key) {
      return typeof args[key] != 'undefined'
        ? args[key]
        : match
      ;
    });
  };
}

function TelegramCommands(botName,token){
  var callbacks = {};
  var telegram = new TelegramAPI(token);

  var privateParseCommand = function(msgId,data){
    var cmdCB = callbacks[data.cmd],
        keyCache = ''+data.chat_id+data.from_id;

    if (cmdCB.option && cmdCB.option.length > data.option.length)
      cmdCB.option[data.option.length](new ParseCommandRes(msgId, data, telegram));
    else{
      myCache.del(keyCache);
      cmdCB.exec(data.option, new ParseCommandRes(msgId, data, telegram));
    }
  };

  /***
  cmdObj = {
    option : [function()],
    exec: funtion()
  }
  **/
  this.addCommand = function(cmdName,cmdObj){
    callbacks[cmdName] = cmdObj;
  };

  //example of cache Object
  /*
  {
    cmd: cmd,
    option: [],
    chat_id: chatId,
    from_id: fromId,
    admin: user.admin
  }
  */
  this.parseCommand = function(message,verification){
    //parse all variable
    var chatId = message.chat.id;
    var fromId = message.from.id;
    var messageId = message.message_id;
    var text = message.text;

    var cacheKey = ''+chatId+fromId;
    //if find a command
    if (text[0] == '/'){
      var cmd = text.split(' ')[0].split(botName)[0];
      if (callbacks[cmd] && (!verification || verification && verification(cmd,callbacks[cmd]))){
        var cacheObj={
          cmd: cmd,
          option: [],
          chat_id: chatId,
          from_id: fromId
        };
        myCache.set(cacheKey,cacheObj);
        privateParseCommand(messageId,cacheObj);
      }
    }else{
      var cache_data = myCache.get(cacheKey);
      if(cache_data){
        var option = {};
        if (cache_data.keys_list){
          var index = cache_data.keys_list.str.indexOf(text);
          if (index!=-1){
            option = {str: text, obj: cache_data.keys_list.obj[index]};
          }
          else{
              //wrong responce
          }
          cache_data.keys_list = undefined;
          myCache.set(cacheKey,cache_data);
        }else{
          option = {str: text, obj: null};
        }
        cache_data.option.push(option);
        myCache.set(cacheKey,cache_data);
        privateParseCommand(messageId,cache_data);
      }else{
        verification(null);
      }
    }
  };
}

module.exports=TelegramCommands;
