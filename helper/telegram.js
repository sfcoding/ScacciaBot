var request = require('request');
function API (token){
  var URL = 'https://api.telegram.org/bot'+token;

  var createKeybord = function(key){
    return JSON.stringify({
      keyboard: key,
      one_time_keyboard: true,
      selective: true
    });
  };

  var createForceReplay = function(){
    return JSON.stringify({
      force_reply: true,
      selective: true
    });
  };

  var createHideKeyboard = function(){
    return JSON.stringify({
      hide_keyboard: true,
      selective: true
    });
  };

  var parseReturn = function(body){
      var res = JSON.parse(body);
      if (res.ok)
        return res.result;
  };

  this.arrayToKeyboard = function(obj,keys){
    var res = [];
    for (var i=0;i<obj.length;i++){
      var row = '';
      for (var j=0;j<keys.length;j++){
        row+=obj[i][keys[j]]+' ';
      }
      res.push([row]);
    }
    return res;
  };

  this.getMe = function(cb){
    request({
        url: URL+'/getme',
        method: 'GET'
    }, function(error, response, body){
      if (cb){
        if(error) cb(null);
        else cb(parseReturn(body));
      }
    });
  };

  /*
  {
    text:
    chat_id:
    replay_to:
    force_replay:
    keyboard:
  }
  */
  this.sendMessage = function (obj, cb){
    var form = {text: obj.text, chat_id: obj.chat_id, reply_markup:createHideKeyboard()};
    if (obj.replay_to) form.reply_to_message_id = obj.replay_to;
    if (obj.keyboard) form.reply_markup = createKeybord(obj.keyboard);
    if (obj.force_replay) form.reply_markup = createForceReplay();
    request({
        url: URL+'/sendmessage',
        method: 'POST',
        form: form,
    }, function(error, response, body){
      if (cb){
        if(error) cb(null);
        else cb(parseReturn(body));
      }
    });
  };

  this.setWebHook = function(webhook_url, cb){
    request({
        url: URL+'/setwebhook',
        method: 'POST',
        form: {url: webhook_url},
    }, function(error, response, body){
      if (cb){
        if(error) cb(null);
        else cb(parseReturn(body));
      }
    });
  };

}
module.exports = API;
