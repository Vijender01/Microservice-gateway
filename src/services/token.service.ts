import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { IToken } from 'src/interfaces/token/token.interface';
import { Response } from 'express';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService,
        @InjectModel('Token') private readonly tokenModel: Model<IToken>,
    ) { }

    public createToken(userId: string): Promise<IToken> {
      console.log('userId in token service???',userId);
      
        const token = this.jwtService.sign(
          {
            userId,
          },
          {
            //move it to env file...
            expiresIn: 30 * 24 * 60 * 60,
          },
        );

        console.log('token',token);
        
    
        return new this.tokenModel({
          user_id: userId,
          token,
        }).save();
      }

      public setTokenInRes(res:Response, token:IToken){
        
        res.cookie('auth_token', token, {
          httpOnly: true, // Ensures the cookie is accessible only by the web server
          secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
          maxAge: 30 * 24 * 60 * 60 * 1000, // Expiration time in milliseconds (30 days)
          sameSite: 'strict', // Helps mitigate CSRF attacks
          path: '/', // Cookie available for all routes

        });
      }

}
