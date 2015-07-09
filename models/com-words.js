"use strict";

module.exports = function(sequelize, DataTypes) {
  var ComWords = sequelize.define("ComWords", {
    word: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        ComWords.belongsToMany(models.Users,{
          through: models.UsersComWords
          //foreignKey: 'word_id'
        });
      }
    }
  });
  return ComWords;
};
