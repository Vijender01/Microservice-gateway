import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users.controller';
import { ConfigService } from './services/config/config.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from './schemas/token.schema';

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
      secret: process.env.JWT_SECRET, // Ensure you provide the secret
      signOptions: { expiresIn: '60s' } // Optional: adjust as needed
    }),
  ],
  controllers: [UsersController],
  providers: [ConfigService, TokenService],
})
export class AppModule {}
