import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Signup method with email uniqueness check
  async signup(email: string, name: string, password: string): Promise<User> {
    // Check if the email already exists
    const existingUser = await this.userModel.findOne({ email });
    console.log("🚀 ~ UserService ~ signup ~ existingUser:", existingUser)
    if (existingUser) {
      // If email already exists, throw an error
      throw new HttpException(
        'Email is already taken. Please choose another one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new this.userModel({ email, name, password: hashedPassword });
    console.log("🚀 ~ UserService ~ signup ~ user:", user)

    try {
      // Save the user to the database
      return await user.save();
    } catch (error) {
      // Handle any errors that occur while saving the user
      throw new HttpException('Error during signup', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Validate user for login
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
