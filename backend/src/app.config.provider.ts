import { ConfigModule, ConfigService } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule],
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    port: Number(configService.get<string>('PORT')) || 3000,
    database: {
      driver: configService.get<string>('DATABASE_DRIVER') || 'postgres',
      url: configService.get<string>('DATABASE_URL') || '',
      username: configService.get<string>('DATABASE_USERNAME') || '',
      password: configService.get<string>('DATABASE_PASSWORD') || '',
    },
  }),
};

export interface AppConfig {
  port: number;
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  username: string;
  password: string;
}
