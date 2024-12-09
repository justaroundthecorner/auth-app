import { Controller, Post, Body } from '@nestjs/common'; // Importing necessary decorators and utilities from NestJS
import { UserService } from './user.service'; // Importing the UserService to handle user-related business logic

/**
 * UserController: Handles HTTP requests related to user authentication and registration.
 */
@Controller('user') // Defines the base route for this controller as '/user'
export class UserController {
  // Inject the UserService into the controller
  constructor(private readonly userService: UserService) {}

  /**
   * Handles user signup requests.
   * 
   * @param body - The request body containing email, name, and password.
   * @returns The newly created user or an error if signup fails.
   */
  @Post('signup') // Handles POST requests to '/user/signup'
  signup(@Body() body: { email: string; name: string; password: string }) {
    // Delegate the signup operation to the UserService
    return this.userService.signup(body.email, body.name, body.password);
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
    // Validate the user using the provided credentials
    const user = await this.userService.validateUser(body.email, body.password);
    if (user) {
      return { message: 'Login successful' }; // Return success message if validation passes
    }
    // Throw an error if credentials are invalid
    throw new Error('Invalid credentials');
  }
}
