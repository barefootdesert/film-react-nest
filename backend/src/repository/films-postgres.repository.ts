import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film, Schedule } from './film.entity';
import {
  FilmEntity,
  FilmsRepository,
  ScheduleEntity,
} from './films-repository.interface';

@Injectable()
export class FilmsPostgresRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmEntity[]> {
    const films = await this.filmRepository.find({
      relations: ['schedule'],
    });
    return films.map((film) => this.toFilmEntity(film));
  }

  async findById(id: string): Promise<FilmEntity | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });
    return film ? this.toFilmEntity(film) : null;
  }

  async findSchedule(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleEntity | null> {
    const session = await this.scheduleRepository.findOne({
      where: { id: sessionId, film: { id: filmId } },
    });
    return session ? this.toScheduleEntity(session) : null;
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void> {
    await this.scheduleRepository.manager.transaction(async (manager) => {
      const session = await manager
        .getRepository(Schedule)
        .createQueryBuilder('schedule')
        .setLock('pessimistic_write')
        .where('schedule.id = :sessionId', { sessionId })
        .andWhere('schedule.filmId = :filmId', { filmId })
        .getOne();

      if (!session) {
        throw new NotFoundException({
          error: `Session ${sessionId} for film ${filmId} not found`,
        });
      }

      const taken = this.normalizeTaken(session.taken);
      for (const seat of seats) {
        if (taken.includes(seat)) {
          throw new BadRequestException({
            error: `Seat ${seat} is already taken`,
          });
        }
      }

      session.taken = [...taken, ...seats];
      await manager.save(session);
    });
  }

  private toFilmEntity(film: Film): FilmEntity {
    return {
      id: film.id,
      rating: Number(film.rating),
      director: film.director,
      tags: this.normalizeTaken(film.tags),
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: (film.schedule || []).map((session) =>
        this.toScheduleEntity(session),
      ),
    };
  }

  private toScheduleEntity(session: Schedule): ScheduleEntity {
    return {
      id: session.id,
      daytime: session.daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: Number(session.price),
      taken: this.normalizeTaken(session.taken),
    };
  }

  private normalizeTaken(
    value: string[] | string | null | undefined,
  ): string[] {
    if (!value) {
      return [];
    }
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return value.filter(Boolean);
  }
}
