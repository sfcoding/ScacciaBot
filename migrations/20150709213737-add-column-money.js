'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Link_Users_ComWords',
      'money',
      {type: Sequelize.INTEGER.UNSIGNED.ZEROFILL}
    );
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Link_Users_ComWords', 'money');
  }
};
