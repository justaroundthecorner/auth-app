import { Injectable, HttpException, HttpStatus } from '@nestjs/common'; // Importing necessary decorators and utilities from NestJS
import { InjectModel } from '@nestjs/mongoose'; // For injecting the User model into the service
import { Model } from 'mongoose'; // Mongoose model interface
import * as bcrypt from 'bcrypt'; // For hashing passwords
import { User } from './user.schema'; // Importing the User schema

/**
 * UserService: Handles business logic related to user authentication and management.
 */
@Injectable() // Marks the class as a service that can be injected into other parts of the app
export class UserService {
  // Inject the User model for database operations
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Handles user signup by creating a new user in the database.
   *
   * @param email - The user's email address.
   * @param name - The user's name.
   * @param password - The user's password.
   * @returns The created user document.
   * @throws HttpException if the email is already taken or if there is a database error.
   */
  async signup(email: string, name: string, password: string): Promise<User> {
    // Check if a user with the given email already exists
    const existingUser = await this.userModel.findOne({ email });
    console.log('🚀 ~ UserService ~ signup ~ existingUser:', existingUser); // Debugging log
    if (existingUser) {
      // Throw an error if the email is already taken
      throw new HttpException(
        'Email is already taken. Please choose another one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash the user's password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with the hashed password
    const user = new this.userModel({ email, name, password: hashedPassword });
    console.log('🚀 ~ UserService ~ signup ~ user:', user); // Debugging log

    try {
      // Save the new user to the database
      return await user.save();
    } catch (error) {
      // Throw an error if saving to the database fails
      throw new HttpException(
        'Error during signup',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Validates user credentials during login.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns The user document if the credentials are valid, or null otherwise.
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    // Find the user by email in the database
    const user = await this.userModel.findOne({ email });

    // Compare the provided password with the stored hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
      return user; // Return the user if credentials are valid
    }

    return null; // Return null if credentials are invalid
  }
}
