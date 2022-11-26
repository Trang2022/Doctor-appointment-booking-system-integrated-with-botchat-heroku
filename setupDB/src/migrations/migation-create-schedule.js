"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Schedules", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      currentNumber: {
        type: Sequelize.INTEGER,
      },
      maxNumber: {
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.STRING,
      },

      timeType: {
        type: Sequelize.STRING,
      },
      doctorId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "createdAt",
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "updatedAt",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Schedules");
  },
};
