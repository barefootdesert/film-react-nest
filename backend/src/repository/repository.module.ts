import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FILMS_REPOSITORY } from './films-repository.interface';
import { FilmsMemoryRepository } from './films-memory.repository';
import { FilmsPostgresRepository } from './films-postgres.repository';
import { Film, Schedule } from './film.entity';

const isPostgres = process.env.DATABASE_DRIVER === 'postgres';

@Module({
  imports: [
    ...(isPostgres
      ? [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const databaseUrl = configService.get<string>('DATABASE_URL');
              const parsed = new URL(databaseUrl);
              return {
                type: 'postgres' as const,
                host: parsed.hostname,
                port: Number(parsed.port) || 5432,
                database: parsed.pathname.replace(/^\//, ''),
                username: configService.get<string>('DATABASE_USERNAME'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                entities: [Film, Schedule],
                synchronize: false,
              };
            },
          }),
          TypeOrmModule.forFeature([Film, Schedule]),
        ]
      : []),
  ],
  providers: [
    FilmsMemoryRepository,
    ...(isPostgres ? [FilmsPostgresRepository] : []),
    {
      provide: FILMS_REPOSITORY,
      useExisting: isPostgres ? FilmsPostgresRepository : FilmsMemoryRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
