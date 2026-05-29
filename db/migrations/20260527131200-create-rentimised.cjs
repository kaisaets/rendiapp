"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rentimised", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      kasutaja_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "kasutajad",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      suuline_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "suulised",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      algus_kuupaev: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      lopp_kuupaev: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      staatus: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      paid: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("rentimised");
  },
};
