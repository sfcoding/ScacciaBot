var db = require("../models");

module.exports = function(){
  db.Users.update({admin:true},{where:{username:'cipposo'}}).then(function(data){
    console.log('done!');
    console.log(data);
  });

  db.Users.update({admin:true},{where:{username:'CampariGin'}}).then(function(data){
    console.log('done!');
    console.log(data);
  });
};
