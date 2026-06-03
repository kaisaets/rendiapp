import { DataTypes } from "sequelize";

export function defineRentimineModel(sequelize) {
  return sequelize.define(
    "Rentimine",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      kasutaja_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "kasutajad",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      suuline_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: "suulised",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      algus_kuupaev: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      lopp_kuupaev: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      staatus: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      paid: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      aadress: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "rentimised",
      timestamps: false,
    },
  );
}
