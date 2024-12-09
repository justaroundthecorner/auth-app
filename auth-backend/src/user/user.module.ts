import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Import User schema
  ],
  controllers: [UserController],  // Register the UserController
  providers: [UserService],       // Register the UserService
})
export class UserModule {}
