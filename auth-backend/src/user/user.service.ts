import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';
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
   * @returns The user document if the credentials are valid, or throws an error otherwise.
   * @throws HttpException if user is not found or password does not match.
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      // Find the user by email in the database
      const user = await this.userModel.findOne({ email });

      // Check if user is found
      if (!user) {
        // Throw an error if the user is not found
        throw new HttpException(
          'User not found with this email.',
          HttpStatus.NOT_FOUND,
        );
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        // Throw an error if the password does not match
        throw new HttpException(
          'Invalid credentials. Password does not match.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return user; // Return the user if credentials are valid
    } catch (error) {
      // Log the error if something goes wrong
      console.error('Error during user validation:', error);

      // Re-throw the error with proper HTTP status
      throw new HttpException(
        error.message || 'Error during validation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
