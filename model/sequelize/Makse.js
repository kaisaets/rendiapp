import { DataTypes } from "sequelize";

export function defineMakseModel(sequelize) {
  return sequelize.define(
    "Makse",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      rentimine_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "rentimised",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      summa: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
      },
      makse_kuupaev: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      makse_viis: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      staatus: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      tableName: "maksed",
      timestamps: false,
    },
  );
}
