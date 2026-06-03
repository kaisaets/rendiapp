"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("suulised", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      nimi: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      material: {
        type: Sequelize.ENUM(
          "Sweet iron",
          "Titanium",
          "Sweet gold",
          "Rubber",
          "Leather",
          "Stainless steel",
        ),
        allowNull: true,
      },
      suurus: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      hind_paev: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: true,
      },
      kirjeldus: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      staatus: {
        type: Sequelize.ENUM("Saadaval", "Renditud"),
        allowNull: false,
        defaultValue: "Saadaval",
      },
      tuup1: {
        type: Sequelize.ENUM(
          "kaheosaline",
          "kolmeosaline",
          "sirge",
          "lukustuv",
          "muu",
        ),
        allowNull: true,
      },
      ring_type: {
        type: Sequelize.ENUM(
          "baby fulmer",
          "loose ring",
          "fixed ring",
          "full cheek",
          "baucher",
          "D ring",
          "beval",
          "gag",
          "islandic shank",
          "Kimblehook",
          "Pelham",
          "2.5 rings",
        ),
        allowNull: true,
      },
      thickness: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 3,
      },
      buyout_price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      image_path: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      image_filename: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("suulised");
  },
};
