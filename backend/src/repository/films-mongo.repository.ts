import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { FilmDocument } from './film.schema';
import {
  FilmEntity,
  FilmsRepository,
  ScheduleEntity,
} from './films-repository.interface';

@Injectable()
export class FilmsMongoRepository implements FilmsRepository {
  constructor(private readonly filmModel: Model<FilmDocument>) {}

  async findAll(): Promise<FilmEntity[]> {
    return this.filmModel.find().lean().exec();
  }

  async findById(id: string): Promise<FilmEntity | null> {
    return this.filmModel.findOne({ id }).lean().exec();
  }

  async findSchedule(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleEntity | null> {
    const film = await this.filmModel.findOne({ id: filmId }).lean().exec();
    return film?.schedule.find((session) => session.id === sessionId) || null;
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void> {
    await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $push: { 'schedule.$.taken': { $each: seats } } },
    );
  }
}
