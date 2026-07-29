import { Module } from '@nestjs/common';
import mongoose from 'mongoose';
import { AppConfig, configProvider } from '../app.config.provider';
import { FILMS_REPOSITORY } from './films-repository.interface';
import { FilmsMemoryRepository } from './films-memory.repository';
import { FilmsMongoRepository } from './films-mongo.repository';
import { getFilmModel } from './film.schema';

@Module({
  providers: [
    configProvider,
    {
      provide: FILMS_REPOSITORY,
      useFactory: async (config: AppConfig) => {
        if (config.database.driver === 'mongodb') {
          await mongoose.connect(config.database.url);
          return new FilmsMongoRepository(getFilmModel());
        }
        return new FilmsMemoryRepository();
      },
      inject: ['CONFIG'],
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
