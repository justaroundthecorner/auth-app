import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.schema'; // Importing the User schema
import { Document } from 'mongoose'; // Importing Mongoose Document type

// Mock Mongoose User document (for better type compatibility)
interface MockUser extends Document {
  email: string;
  name: string;
  password: string;
  _id: string;
}

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    // Mocking UserService methods
    const serviceMock = {
      signup: jest.fn(),
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController], // UserController being tested
      providers: [
        {
          provide: UserService, // Replacing UserService with the mock
          useValue: serviceMock,
        },
      ],
    }).compile();

    // Getting instances of controller and service for testing
    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    // Test if the controller is defined (properly initialized)
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call the signup service method with correct parameters and return result', async () => {
      const body = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      // Mocked User with _id and other necessary properties from Document
      const result: MockUser = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        _id: '1',
        // Mongoose-specific methods (mocking the required ones)
      } as MockUser;

      // Mocking the service method
      jest.spyOn(service, 'signup').mockResolvedValueOnce(result);

      // Call the controller method
      const response = await controller.signup(body);

      // Test assertions
      expect(response).toEqual(result); // Check the returned result
      expect(service.signup).toHaveBeenCalledWith(
        body.email,
        body.name,
        body.password,
      ); // Check if the service was called with correct parameters
    });
  });

  describe('signin', () => {
    it('should return a success message if user validation succeeds', async () => {
      const body = { email: 'test@example.com', password: 'password123' };

      // Mocked User with _id and other necessary properties from Document
      const user: MockUser = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        _id: '1',
      } as MockUser;

      // Mocking the user validation method
      jest.spyOn(service, 'validateUser').mockResolvedValueOnce(user);

      // Call the controller method
      const response = await controller.signin(body);

      // Test assertions
      expect(response).toEqual({ message: 'Login successful' });
      expect(service.validateUser).toHaveBeenCalledWith(
        body.email,
        body.password,
      ); // Validate service method call
    });

    it('should throw an error if user validation fails', async () => {
      const body = { email: 'test@example.com', password: 'wrongpassword' };

      // Mocking failed validation (null means no user found)
      jest.spyOn(service, 'validateUser').mockResolvedValueOnce(null);

      // Call the controller method and expect it to throw an error
      await expect(controller.signin(body)).rejects.toThrow(
        'Invalid credentials',
      );

      // Ensure the service method was called with correct parameters
      expect(service.validateUser).toHaveBeenCalledWith(
        body.email,
        body.password,
      );
    });
  });
});
