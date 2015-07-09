'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameTable('Link_Users_ComWords','UsersComWords');
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.renameTable('UsersComWords', 'Link_Users_ComWords');
  }
};
