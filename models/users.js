"use strict";

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    id: {type:DataTypes.INTEGER.UNSIGNED, unique: true, primaryKey: true},
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    admin: {type: DataTypes.BOOLEAN, defaultValue: false}
  }, {
    classMethods: {
      associate: function(models) {
        Users.hasMany(models.ComWords);
        Users.belongsToMany(models.PriWords,{
          through: models.UsersComWords
          });
        }
      }
  });
  return Users;
};
