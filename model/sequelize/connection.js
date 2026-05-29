import mysql2 from "mysql2";
import { Sequelize } from "sequelize";

const database = process.env.MYSQL_DATABASE ?? "rendiapp";
const username = process.env.MYSQL_USER ?? "rendiapp_user";
const password = process.env.MYSQL_PASSWORD ?? "rendiapp_pass123";
const host = process.env.MYSQL_HOST ?? "localhost";
const port = Number(process.env.MYSQL_PORT ?? 3306);

export const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: "mysql",
  dialectModule: mysql2,
  logging: false,
  define: {
    freezeTableName: true,
    underscored: true,
  },
});

export async function testSequelizeConnection() {
  await sequelize.authenticate();
}
