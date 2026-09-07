import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  const mockOrderDto: CreateOrderDto = {
    email: 'test@example.com',
    phone: '+79991234567',
    tickets: [
      {
        film: 'film-1',
        session: 'session-1',
        row: 1,
        seat: 5,
      },
    ],
  };

  const mockOrderResponse: OrderResponseDto = {
    total: 1,
    items: [
      {
        id: 'ticket-1',
        film: 'film-1',
        session: 'session-1',
        daytime: '2024-07-01T10:00:00.000Z',
        row: 1,
        seat: 5,
        price: 350,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn().mockResolvedValue(mockOrderResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  describe('createOrder', () => {
    it('создаёт заказ и возвращает результат', async () => {
      const result = await controller.createOrder(mockOrderDto);

      expect(result).toEqual(mockOrderResponse);
      expect(orderService.createOrder).toHaveBeenCalledWith(mockOrderDto);
    });

    it('пробрасывает BadRequestException при пустом списке билетов', async () => {
      jest
        .spyOn(orderService, 'createOrder')
        .mockRejectedValue(
          new BadRequestException({ error: 'Tickets list is empty' }),
        );

      await expect(
        controller.createOrder({ ...mockOrderDto, tickets: [] }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
