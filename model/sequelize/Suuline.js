import { DataTypes } from "sequelize";

export function defineSuulineModel(sequelize) {
  return sequelize.define(
    "Suuline",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      nimi: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      material: {
        type: DataTypes.ENUM(
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
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      hind_paev: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
      },
      kirjeldus: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      staatus: {
        type: DataTypes.ENUM("Saadaval", "Renditud"),
        allowNull: false,
        defaultValue: "Saadaval",
      },
      tuup1: {
        type: DataTypes.ENUM(
          "kaheosaline",
          "kolmeosaline",
          "sirge",
          "lukustuv",
          "muu",
        ),
        allowNull: true,
      },
      ring_type: {
        type: DataTypes.ENUM(
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
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 3,
      },
      buyout_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "suulised",
      timestamps: false,
    },
  );
}
