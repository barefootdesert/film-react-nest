export interface ScheduleEntity {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export interface FilmEntity {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: ScheduleEntity[];
}

export interface FilmsRepository {
  findAll(): Promise<FilmEntity[]>;
  findById(id: string): Promise<FilmEntity | null>;
  findSchedule(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleEntity | null>;
  takeSeats(filmId: string, sessionId: string, seats: string[]): Promise<void>;
}

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';
