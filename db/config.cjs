const defaultConfig = {
  username: process.env.MYSQL_USER || "rendiapp_user",
  password: process.env.MYSQL_PASSWORD || "rendiapp_pass123",
  database: process.env.MYSQL_DATABASE || "rendiapp",
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  dialect: "mysql",
  logging: false,
};

module.exports = {
  development: { ...defaultConfig },
  test: { ...defaultConfig },
  production: { ...defaultConfig },
};
