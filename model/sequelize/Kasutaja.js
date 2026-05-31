import { DataTypes } from "sequelize";

export function defineKasutajaModel(sequelize) {
  return sequelize.define(
    "Kasutaja",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      google_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      nimi: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      telefon: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      roll: {
        type: DataTypes.ENUM("admin", "kasutaja"),
        allowNull: false,
        defaultValue: "kasutaja",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "kasutajad",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
}
