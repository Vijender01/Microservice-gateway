import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users.controller';
import { ConfigService } from './services/config/config.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from './schemas/token.schema';
import { refreshTokenMiddleware } from './middleware/refreshToken.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest_main',{
      autoCreate: true
    }),
    MongooseModule.forFeature([
      {
        name: 'Token',
        schema: TokenSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqps://obhlbcvp:vuMB_HPYPo769PiIYXfx-FqjXvgjq9QB@armadillo.rmq.cloudamqp.com/obhlbcvp'],
          queue: 'main_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // Ensure you provide the secret
      signOptions: { expiresIn: '60s' } // Optional: adjust as needed
    }),
  ],
  controllers: [UsersController],
  providers: [ConfigService, TokenService],
})


export class AppModule {
//to apply middleware to
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(refreshTokenMiddleware)
      .exclude(
        { path: 'users/', method: RequestMethod.POST },
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users/signout', method: RequestMethod.POST },
      )
      .forRoutes('*'); // Apply middleware to all routes or use specific routes
  }
  
}
