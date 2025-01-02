import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'; // Importing cookie-parser for parsing cookies

async function bootstrap() {
  // Create the NestJS application using the AppModule
  const app = await NestFactory.create(AppModule);

  // Set a global prefix for all API routes (e.g., '/api/products', '/api/users')
  app.setGlobalPrefix('api');

  // Use cookie-parser middleware to parse cookies sent with requests
  app.use(cookieParser());

  // Enable CORS (Cross-Origin Resource Sharing) to allow requests from the specified origin
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200', // Allow requests only from this origin (usually for local development)
    methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers for the requests
  });

  // Start the server and listen on port 8000
  await app.listen(8000);
}

bootstrap(); // Execute the bootstrap function to launch the app
