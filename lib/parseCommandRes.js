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

function ParseCommandRes(msgId,data,telegram){
  var cacheKey = ''+data.chat_id+data.from_id;
  var formatList = function(obj,str){
    var res = [];
    for (var i=0;i<obj.length;i++){
      res.push(str.format(obj[i]));
    }
    return res;
  };
  //"{{name}} (@{{username}})"
  this.sendKeys = function(text, optionList, format){

    var list = formatList(optionList,format);
    data.keys_list = {str:list, obj:optionList};
    myCache.del(cacheKey);
    myCache.set(cacheKey,data);

    var keyArray = telegram.arrayToKeyboard(userList);
    telegram.sendMessage({chat_id: data.chat_id,
                          text: text,
                          replay_to: msgId,
                          keyboard: keyArray});
  };

  this.sendForce = function(text){
    telegram.sendMessage({chat_id: data.chat_id,
                          text: text,
                          replay_to: msgId,
                          force_replay: true});
  };

  this.send = function(text){
    telegram.sendMessage({chat_id: data.chat_id,
                          text: text,
                          replay_to: msgId});
  };

  this.sendList = function(list,format){
    telegram.sendMessage({chat_id: data.chat_id,
                          text: formatList(list,format),
                          replay_to: msgId});

  };
}

module.exports=ParseCommandRes;
