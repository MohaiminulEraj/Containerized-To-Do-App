import { DataSource } from "typeorm";
import { User } from "../user/user.entity.js";
import { Todo } from "../todo/todo.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "todo_db",
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
  entities: [User, Todo],
  subscribers: [],
  migrations: [],
});
