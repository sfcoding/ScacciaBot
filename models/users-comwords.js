"use strict";

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("UsersComWords", {
    money: DataTypes.INTEGER.UNSIGNED.ZEROFILL
  }, {
    classMethods: {
      associate: function(models) {
        }
      }
  });
  return Users;
};
