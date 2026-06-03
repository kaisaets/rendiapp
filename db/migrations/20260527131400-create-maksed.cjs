"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("maksed", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      rentimine_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "rentimised",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      summa: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: false,
      },
      makse_kuupaev: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      makse_viis: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      staatus: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("maksed");
  },
};
