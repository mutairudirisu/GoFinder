import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn((dto) => {
      return {
        access_token: 'mock-token',
        user: { id: 'mock-id', email: dto.email, name: dto.name, role: dto.role || 'renter' },
      };
    }),
    login: jest.fn((dto) => {
      return {
        access_token: 'mock-token',
        user: { id: 'mock-id', email: dto.email, name: 'Test User', role: 'renter' },
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should register a new user and return a token', async () => {
      const signupDto = { email: 'test@example.com', password: 'password', name: 'Test User' };
      const result = await controller.signup(signupDto);
      expect(result).toEqual({
        access_token: 'mock-token',
        user: { id: 'mock-id', email: 'test@example.com', name: 'Test User', role: 'renter' },
      });
      expect(service.register).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('login', () => {
    it('should authenticate user and return a token', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const result = await controller.login(loginDto);
      expect(result).toEqual({
        access_token: 'mock-token',
        user: { id: 'mock-id', email: 'test@example.com', name: 'Test User', role: 'renter' },
      });
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
