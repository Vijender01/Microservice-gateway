import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users.controller';
import { ConfigService } from './config/config.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from './schemas/token.schema';
import { refreshTokenMiddleware } from './middleware/refreshToken.middleware';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/role.guard';
import { ProductsController } from './products.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // ConfigModule loads environment variables and configuration settings
    ConfigModule.forRoot({
      envFilePath: '.env', // Load environment variables from the .env file
    }),
    
    // MongooseModule sets up MongoDB connection and schema registration
    MongooseModule.forRoot('mongodb://localhost:27017/nest_main', {
      autoCreate: true, // Automatically create the database if it doesn't exist
    }),

    MongooseModule.forFeature([
      {
        name: 'Token', // Register Token model schema to interact with the 'Token' collection
        schema: TokenSchema,
      },
    ]),

    // ClientsModule configures the microservice clients for communication with external services (e.g., RabbitMQ)
    ClientsModule.register([
      {
        name: 'USER_SERVICE', // Client for user-related operations
        transport: Transport.RMQ, // Transport type is RabbitMQ
        options: {
          urls: [process.env.RABBIT_MQ_URL], // RabbitMQ URL (from environment variable)
          queue: 'main_queue', // Queue name
          queueOptions: {
            durable: false, // Set queue as non-durable (doesn't survive broker restarts)
          },
        },
      },
      {
        name: 'PRODUCT_SERVICE', // Product Service Client (if needed)
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URL], // RabbitMQ URL (from environment variable)
          queue: 'product_queue', // Queue name
          queueOptions: {
            durable: false, // Set queue as non-durable
          },
        },
      },
    ]),

    // JwtModule registers JWT module for authentication and signing of tokens
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Secret key for signing the JWT token (move to .env for security)
      signOptions: { expiresIn: '60s' }, // Token expiration time (1 minute)
    }),
  ],
  controllers: [
    UsersController, // Controller to handle user-related endpoints
    ProductsController, // Controller to handle product-related endpoints
  ],
  providers: [
    ConfigService, // Provides configuration service
    TokenService, // Provides token-related logic (creating, validating, etc.)
    {
      provide: APP_GUARD, // Register the RolesGuard globally
      useClass: RolesGuard, // Use the RolesGuard to enforce access control on routes
    },
  ],
})

export class AppModule {
  // Configure middleware to be applied globally or to specific routes
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(refreshTokenMiddleware) // Apply the refreshTokenMiddleware to handle token refresh
      .exclude(
        { path: 'users/', method: RequestMethod.POST }, // Exclude from 'users' POST route (e.g., registration)
        { path: 'users/login', method: RequestMethod.POST }, // Exclude from 'login' route
        { path: 'users/signout', method: RequestMethod.POST }, // Exclude from 'signout' route
      )
      .forRoutes('*'); // Apply middleware to all routes except the excluded ones
  }
}
