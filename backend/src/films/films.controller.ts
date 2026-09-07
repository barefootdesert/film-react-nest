import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsListDto, ScheduleListDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll(): Promise<FilmsListDto> {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  findSchedule(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ScheduleListDto> {
    return this.filmsService.findSchedule(id);
  }
}
