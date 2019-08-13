'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Schools', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_name: {
        type: Sequelize.STRING
      },
      alias: {
        type: Sequelize.STRING
      },
      logo: {
        type: Sequelize.BLOB
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      established: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      long: {
        type: Sequelize.BIGINT
      },
      lat: {
        type: Sequelize.BIGINT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Schools');
  }
};