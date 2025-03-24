import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration], // Explicitly load configuration.ts
      isGlobal: true, // Make it available throughout the app
      envFilePath: '.env', // Explicitly set the env file path
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    DocumentsModule,
    IngestionModule,
    PermissionsModule,
  ],
})
export class AppModule {}
