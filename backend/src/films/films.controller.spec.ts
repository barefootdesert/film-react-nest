import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsListDto, ScheduleListDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: FilmsService;

  const mockFilmsList: FilmsListDto = {
    total: 1,
    items: [
      {
        id: 'film-1',
        rating: 8.5,
        director: 'Director',
        tags: ['drama'],
        image: '/image.jpg',
        cover: '/cover.jpg',
        title: 'Test Film',
        about: 'About',
        description: 'Description',
      },
    ],
  };

  const mockScheduleList: ScheduleListDto = {
    total: 1,
    items: [
      {
        id: 'session-1',
        daytime: '2024-07-01T10:00:00.000Z',
        hall: 1,
        rows: 5,
        seats: 10,
        price: 350,
        taken: [],
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockFilmsList),
            findSchedule: jest.fn().mockResolvedValue(mockScheduleList),
          },
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    filmsService = module.get<FilmsService>(FilmsService);
  });

  describe('findAll', () => {
    it('возвращает список фильмов', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(mockFilmsList);
      expect(filmsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findSchedule', () => {
    it('возвращает расписание сеансов для фильма', async () => {
      const result = await controller.findSchedule('film-1');

      expect(result).toEqual(mockScheduleList);
      expect(filmsService.findSchedule).toHaveBeenCalledWith('film-1');
    });

    it('пробрасывает NotFoundException если фильм не найден', async () => {
      jest
        .spyOn(filmsService, 'findSchedule')
        .mockRejectedValue(new NotFoundException('Film not found'));

      await expect(controller.findSchedule('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
