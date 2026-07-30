import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FILMS_REPOSITORY } from './films-repository.interface';
import { FilmsMemoryRepository } from './films-memory.repository';
import { FilmsMongoRepository } from './films-mongo.repository';
import { Film, FilmSchema } from './film.schema';

const isMongo = process.env.DATABASE_DRIVER === 'mongodb';

@Module({
  imports: [
    ...(isMongo
      ? [
          MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              uri: configService.get<string>('DATABASE_URL'),
            }),
          }),
          MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
        ]
      : []),
  ],
  providers: [
    FilmsMemoryRepository,
    ...(isMongo ? [FilmsMongoRepository] : []),
    {
      provide: FILMS_REPOSITORY,
      useExisting: isMongo ? FilmsMongoRepository : FilmsMemoryRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
