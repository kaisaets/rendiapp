"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("suulised_rentimised", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      rentimise_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "rentimised",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      kogus: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });

    await queryInterface.addIndex(
      "suulised_rentimised",
      ["rentimise_id", "suuline_id"],
      {
        unique: true,
        name: "suulised_rentimised_unique_pair",
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("suulised_rentimised");
  },
};
