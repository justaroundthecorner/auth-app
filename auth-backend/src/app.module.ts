import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { RateLimiterModule } from 'nestjs-rate-limiter'; // For rate limiting

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables from .env
    MongooseModule.forRoot(process.env.MONGO_URI, {
      retryAttempts: 5, // Retry connection attempts
      retryDelay: 3000, // Wait 3 seconds between retries
    }),
    UserModule,
    RateLimiterModule.register({
      points: 5, // Limit to 5 requests per minute
      duration: 60, // Per minute
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
