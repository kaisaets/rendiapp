"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kasutajad", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      google_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      nimi: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      telefon: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      roll: {
        type: Sequelize.ENUM("admin", "kasutaja"),
        allowNull: false,
        defaultValue: "kasutaja",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("kasutajad");
  },
};
