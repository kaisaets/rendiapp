import { DataTypes } from "sequelize";

export function defineSuulineRentimineModel(sequelize) {
  return sequelize.define(
    "SuulineRentimine",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      rentimise_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "rentimised",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      suuline_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "suulised",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      kogus: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "suulised_rentimised",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["rentimise_id", "suuline_id"],
        },
      ],
    },
  );
}
