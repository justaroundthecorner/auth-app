import {
  Controller,
  Post,
  Body,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
/**
 * UserController: Handles HTTP requests related to user authentication and registration.
 */
@Controller('user') // Defines the base route for this controller as '/user'
export class UserController {
  private readonly logger = new Logger(UserController.name);

  // Inject the UserService into the controller
  constructor(private readonly userService: UserService) {}

  /**
   * Handles user signup requests.
   *
   * @param body - The request body containing email, name, and password.
   * @returns The newly created user or an error if signup fails.
   */
  @Post('signup') // Handles POST requests to '/user/signup'
  async signup(
    @Body() body: { email: string; name: string; password: string },
  ) {
    this.logger.log('Processing signup request for email: ' + body.email);

    try {
      // Delegate the signup operation to the UserService
      const newUser = await this.userService.signup(
        body.email,
        body.name,
        body.password,
      );
      this.logger.log('User signed up successfully: ' + body.email);
      return newUser; // Return the newly created user
    } catch (error) {
      this.logger.error('Signup failed for email: ' + body.email, error.stack);
      throw new HttpException('Signup failed', HttpStatus.BAD_REQUEST); // Return a proper error response
    }
  }

  /**
   * Handles user signin requests.
   *
   * @param body - The request body containing email and password.
   * @returns A success message if credentials are valid, or throws an error if invalid.
   * @throws Error if the provided credentials are invalid.
   */
  @Post('signin') // Handles POST requests to '/user/signin'
  async signin(@Body() body: { email: string; password: string }) {
    this.logger.log('Processing signin request for email: ' + body.email);

    try {
      // Validate the user using the provided credentials
      const user = await this.userService.validateUser(
        body.email,
        body.password,
      );

      if (user) {
        this.logger.log('User login successful for email: ' + body.email);
        return { message: 'Login successful' }; // Return success message if validation passes
      }

      // If validation fails, log the failed attempt and throw an error
      this.logger.warn('Invalid credentials for email: ' + body.email);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED); // Return proper 401 error
    } catch (error) {
      this.logger.error('Signin failed for email: ' + body.email, error.stack);
      throw new HttpException(
        'Signin failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ); // Return a 500 error if an exception occurs
    }
  }
}
