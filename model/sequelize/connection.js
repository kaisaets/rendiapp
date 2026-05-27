import { Sequelize } from "sequelize";

const database = process.env.MYSQL_DATABASE;
const username = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST ?? "localhost";
const port = Number(process.env.MYSQL_PORT ?? 3306);

export const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: "mysql",
  logging: false,
  define: {
    freezeTableName: true,
    underscored: true,
  },
});

export async function testSequelizeConnection() {
  await sequelize.authenticate();
}
