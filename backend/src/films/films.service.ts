import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FilmDto,
  FilmsListDto,
  ScheduleDto,
  ScheduleListDto,
} from './dto/films.dto';
import {
  FILMS_REPOSITORY,
  FilmEntity,
  FilmsRepository,
  ScheduleEntity,
} from '../repository/films-repository.interface';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async findAll(): Promise<FilmsListDto> {
    const films = await this.filmsRepository.findAll();
    const items = films.map((film) => this.toFilmDto(film));
    return { total: items.length, items };
  }

  async findSchedule(id: string): Promise<ScheduleListDto> {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }
    const items = film.schedule.map((session) => this.toScheduleDto(session));
    return { total: items.length, items };
  }

  private toFilmDto(film: FilmEntity): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
    };
  }

  private toScheduleDto(session: ScheduleEntity): ScheduleDto {
    return {
      id: session.id,
      daytime: session.daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken || [],
    };
  }
}
