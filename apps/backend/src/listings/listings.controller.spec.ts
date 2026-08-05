import { Test, TestingModule } from '@nestjs/testing';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';

describe('ListingsController', () => {
  let controller: ListingsController;
  let service: ListingsService;

  const mockListingsService = {
    create: jest.fn((dto, hostId) => {
      return {
        id: 'mock-listing-id',
        ...dto,
        hostId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),
    findAll: jest.fn(() => {
      return [
        { id: '1', title: 'Listing 1', price: 100 },
        { id: '2', title: 'Listing 2', price: 200 },
      ];
    }),
    findOne: jest.fn((id) => {
      return { id, title: `Listing ${id}`, price: 150 };
    }),
    remove: jest.fn((id, hostId) => {
      return { id, title: `Deleted Listing`, hostId };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListingsController],
      providers: [
        {
          provide: ListingsService,
          useValue: mockListingsService,
        },
      ],
    }).compile();

    controller = module.get<ListingsController>(ListingsController);
    service = module.get<ListingsService>(ListingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a listing', async () => {
      const dto = {
        title: 'Modern Apartment',
        description: 'Nice place',
        price: 120,
        category: 'accommodation',
        type: 'apartment',
        location: 'New York',
      };
      const req = { user: { id: 'host-123' } };
      const result = await controller.create(dto, req);
      expect(result).toEqual(expect.objectContaining({
        id: 'mock-listing-id',
        title: 'Modern Apartment',
        hostId: 'host-123',
      }));
      expect(service.create).toHaveBeenCalledWith(dto, 'host-123');
    });
  });

  describe('findAll', () => {
    it('should return all listings', async () => {
      const result = await controller.findAll();
      expect(result).toHaveLength(2);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single listing', async () => {
      const result = await controller.findOne('listing-123');
      expect(result).toEqual(expect.objectContaining({ id: 'listing-123' }));
      expect(service.findOne).toHaveBeenCalledWith('listing-123');
    });
  });

  describe('remove', () => {
    it('should remove a listing', async () => {
      const req = { user: { id: 'host-123' } };
      const result = await controller.remove('listing-123', req);
      expect(result).toEqual(expect.objectContaining({ id: 'listing-123' }));
      expect(service.remove).toHaveBeenCalledWith('listing-123', 'host-123');
    });
  });
});
