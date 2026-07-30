import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderResultDto,
} from './dto/order.dto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films-repository.interface';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async createOrder(order: CreateOrderDto): Promise<OrderResponseDto> {
    if (!order?.tickets?.length) {
      throw new BadRequestException({ error: 'Tickets list is empty' });
    }

    const seatsBySession = new Map<string, string[]>();
    const sessionMeta = new Map<
      string,
      {
        filmId: string;
        sessionId: string;
        taken: string[];
        daytime: string;
        price: number;
      }
    >();

    for (const ticket of order.tickets) {
      const key = `${ticket.film}:${ticket.session}`;
      const seatKey = `${ticket.row}:${ticket.seat}`;

      if (!sessionMeta.has(key)) {
        const schedule = await this.filmsRepository.findSchedule(
          ticket.film,
          ticket.session,
        );
        if (!schedule) {
          throw new NotFoundException({
            error: `Session ${ticket.session} for film ${ticket.film} not found`,
          });
        }
        sessionMeta.set(key, {
          filmId: ticket.film,
          sessionId: ticket.session,
          taken: [...(schedule.taken || [])],
          daytime: schedule.daytime,
          price: schedule.price,
        });
        seatsBySession.set(key, []);
      }

      const meta = sessionMeta.get(key);
      const pending = seatsBySession.get(key);

      if (meta.taken.includes(seatKey) || pending.includes(seatKey)) {
        throw new BadRequestException({
          error: `Seat ${seatKey} is already taken`,
        });
      }

      pending.push(seatKey);
    }

    for (const [key, seats] of seatsBySession.entries()) {
      const meta = sessionMeta.get(key);
      await this.filmsRepository.takeSeats(meta.filmId, meta.sessionId, seats);
    }

    const items: OrderResultDto[] = order.tickets.map((ticket) => {
      const meta = sessionMeta.get(`${ticket.film}:${ticket.session}`);
      return {
        id: randomUUID(),
        film: ticket.film,
        session: ticket.session,
        daytime: meta.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: meta.price,
      };
    });

    return {
      total: items.length,
      items,
    };
  }
}
