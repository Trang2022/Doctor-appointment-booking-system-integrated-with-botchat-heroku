"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Handbooks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.TEXT("long"),
      },
      contentHTML: {
        type: Sequelize.TEXT("long"),
      },
      contentMarkdown: {
        type: Sequelize.TEXT("long"),
      },
      image: {
        type: Sequelize.BLOB("long"),
      },
      doctorId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Handbooks");
  },
};
