import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FILMS_REPOSITORY } from './films-repository.interface';
import { FilmsPostgresRepository } from './films-postgres.repository';
import { Film, Schedule } from './film.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');
        const parsed = new URL(databaseUrl);

        return {
          type: 'postgres' as const,
          host: parsed.hostname,
          port: Number(parsed.port) || 5432,
          database: parsed.pathname.replace(/^\//, ''),
          username: configService.getOrThrow<string>('DATABASE_USERNAME'),
          password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
          entities: [Film, Schedule],
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  providers: [
    {
      provide: FILMS_REPOSITORY,
      useClass: FilmsPostgresRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
