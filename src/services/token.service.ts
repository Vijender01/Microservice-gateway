import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { IToken } from 'src/interfaces/token/token.interface';
import {Request, Response } from 'express';
import { Role } from 'src/common/enums/role.enums';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService,
        @InjectModel('Token') private readonly tokenModel: Model<IToken>,
    ) { }

    public createToken(userId: string,userRole:Role): Promise<IToken> {
      console.log('userId in token service???',userId);
      
        const token = this.jwtService.sign(
          {
            userId,
            userRole,
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
          user_role: userRole,
          status:'valid',
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

      public async removeToken(req: Request, res: Response): Promise<boolean> {
        try {
          const token = req.cookies?.auth_token;
      
          if (!token) {
            console.log('No auth_token found in cookies.');
            return false;
          }
      
          const updatedToken = await this.tokenModel.findOneAndUpdate(
            { token: token, status: 'valid' },
            { $set: { status: 'invalid' } },
            { new: true, lean: true } // Use `lean: true` to return plain JS object
          );
      
          if (!updatedToken) {
            console.log('Token not found or already invalid.');
            return false;
          }
      
          console.log('Token status updated to invalid:', updatedToken._id); // Log only specific fields
      
          res.clearCookie('auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
          });
      
          return true;
        } catch (error) {
          console.error('Error removing token:', error.message);
          return false;
        }
      }
      
      
}
