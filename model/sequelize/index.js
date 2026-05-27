import { sequelize } from "./connection";
import { defineKasutajaModel } from "./Kasutaja";
import { defineMakseModel } from "./Makse";
import { defineRentimineModel } from "./Rentimine";
import { defineSuulineModel } from "./Suuline";
import { defineSuulineRentimineModel } from "./SuulineRentimine";

export const Kasutaja = defineKasutajaModel(sequelize);
export const Suuline = defineSuulineModel(sequelize);
export const Rentimine = defineRentimineModel(sequelize);
export const Makse = defineMakseModel(sequelize);
export const SuulineRentimine = defineSuulineRentimineModel(sequelize);

Kasutaja.hasMany(Rentimine, {
  foreignKey: "kasutaja_id",
  as: "rentimised",
});

Rentimine.belongsTo(Kasutaja, {
  foreignKey: "kasutaja_id",
  as: "kasutaja",
});

Rentimine.belongsToMany(Suuline, {
  through: SuulineRentimine,
  foreignKey: "rentimise_id",
  otherKey: "suuline_id",
  as: "suulised",
});

Suuline.belongsToMany(Rentimine, {
  through: SuulineRentimine,
  foreignKey: "suuline_id",
  otherKey: "rentimise_id",
  as: "rentimised",
});

Rentimine.hasMany(Makse, {
  foreignKey: "rentimine_id",
  as: "maksed",
});

Makse.belongsTo(Rentimine, {
  foreignKey: "rentimine_id",
  as: "rentimine",
});

export const models = {
  Kasutaja,
  Suuline,
  Rentimine,
  Makse,
  SuulineRentimine,
};

export async function syncModels({ alter = false, force = false } = {}) {
  await sequelize.sync({ alter, force });
}
