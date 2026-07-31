import { ConfigModule } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useFactory: (): AppConfig => ({
    port: Number(process.env.PORT) || 3000,
    database: {
      driver: process.env.DATABASE_DRIVER || 'inmemory',
      url: process.env.DATABASE_URL || '',
      username: process.env.DATABASE_USERNAME || '',
      password: process.env.DATABASE_PASSWORD || '',
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
