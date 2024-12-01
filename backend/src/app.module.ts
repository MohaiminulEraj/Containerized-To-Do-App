import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { TodoModule } from "./todo/todo.module";
import { UserModule } from "./user/user.module";
import { typeOrmAsyncConfig } from "./config/typeorm.config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ConfigModule.forRoot({
      envFilePath: [".env"],
      isGlobal: true,
      cache: true,
    }),
    AuthModule,
    TodoModule,
    UserModule,
  ],
})
export class AppModule {}
