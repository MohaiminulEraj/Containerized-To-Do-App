import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from "@nestjs/typeorm";

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: "postgres",
      host: configService.get("DB_HOST", "localhost"),
      port: configService.get<number>("DB_PORT", 5432),
      username: configService.get("DB_USER", "postgres"),
      password: configService.get<string>("DB_PASSWORD", "password"),
      database: configService.get("DB_NAME", "todo_db"),
      entities: [__dirname + "/../**/*.entity.{js,ts}"],
      migrations: [__dirname + "/../database/migrations/*{.ts,.js}"],
      extra: {
        charset: "utf8mb4_unicode_ci",
      },
      synchronize: true,
      logging: false,
    };
  },
};
