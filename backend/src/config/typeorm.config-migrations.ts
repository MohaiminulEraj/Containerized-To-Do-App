const typeOrmConfig = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["dist/**/*.entity.js"],
  migrations: [__dirname + "/../database/migrations/*{.ts,.js}"],
  cli: {
    migrationsDir: __dirname + "/../database/migrations",
  },
  extra: {
    charset: "utf8mb4_unicode_ci",
  },
  synchronize: false,
  logging: true,
  factories: ["dist/**/database/factories/**/*.js"],
  seeds: ["dist/**/database/seeds/**/*.js"],
};

export default typeOrmConfig;
