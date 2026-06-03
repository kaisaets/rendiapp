import { sequelize } from "./connection";
import { defineKasutajaModel } from "./Kasutaja";
import { defineMakseModel } from "./Makse";
import { defineRentimineModel } from "./Rentimine";
import { defineSuulineModel } from "./Suuline";

export const Kasutaja = defineKasutajaModel(sequelize);
export const Suuline = defineSuulineModel(sequelize);
export const Rentimine = defineRentimineModel(sequelize);
export const Makse = defineMakseModel(sequelize);

Kasutaja.hasMany(Rentimine, {
  foreignKey: "kasutaja_id",
  as: "rentimised",
});

Rentimine.belongsTo(Kasutaja, {
  foreignKey: "kasutaja_id",
  as: "kasutaja",
});

Rentimine.belongsTo(Suuline, {
  foreignKey: "suuline_id",
  as: "suuline",
});

Suuline.hasOne(Rentimine, {
  foreignKey: "suuline_id",
  as: "rentimine",
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
};

export async function syncModels({ alter = false, force = false } = {}) {
  await sequelize.sync({ alter, force });
}
