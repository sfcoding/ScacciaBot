var db = require('../models');

var pickAnUser = function(res){ //CHOUSE USER
  db.Users.findAll({}).then(function(userList){
    res.sendKeys('chouse an user', userList, "{{name}} (@{{username}})");
  });
};


module.exports = function(tc){
  tc.addCommand('/addword', {
    option : [
      pickAnUser,
      function(res){ //WRIATE A WORD
        res.sendForce('write a word..');
      }
    ],
    exec: function(option,res){
      var user = option[0].obj;
      var word = option[1].str;
      db.Users.findOne({where:{name: user.name, username: user.username}}).then(function(user){
        db.PriWords.create({word: word}).then(function(wordDb){
          user.addPriWords(wordDb).then(function(ris){
            console.log('create word %j',wordDb);
            res.send('world('+word+') add for user('+user.name+')');
          });
        });
      });//add the word to the database
    },
    admin: true
  });


  tc.addCommand('/list', {
    option: [
      pickAnUser
    ],
    exec: function(option,res){
      //console.log('DATA: %j',data);
      var user = option[0].obj;
      db.Users.findOne({where:{name:user.name, username: user.username}}).then(function(users){
          users.getPriWords().then(function(words){
            console.log('list word %j',words);
            if (words.length!==0){
              //res.send("Test");
              res.sendList(words, "{{word}} - {{money}}€");
            }else
              res.send("no word");
          });

        });
    },
    admin: false
  });

  tc.addCommand('/help',{
    option: null,
    exec: function(option,res){
      res.send('lista comandi...');
    },
    admin: false
  });
}
