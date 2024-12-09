import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';

describe('UserService', () => {
  let service: UserService;
  let userModelMock: any;

  beforeEach(async () => {
    userModelMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: userModelMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should throw an error if the email already exists', async () => {
      userModelMock.findOne.mockResolvedValueOnce({
        email: 'test@example.com',
      });
      await expect(
        service.signup('test@example.com', 'Test User', 'password123'),
      ).rejects.toThrow('Email is already taken. Please choose another one.');
    });
  });

  describe('validateUser', () => {
    it('should return the user if email and password match', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);

      userModelMock.findOne.mockResolvedValueOnce({
        email: 'test@example.com',
        password: hashedPassword,
      });

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual({
        email: 'test@example.com',
        password: hashedPassword,
      });
    });

    it('should return null if email or password do not match', async () => {
      userModelMock.findOne.mockResolvedValueOnce(null);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });
});
