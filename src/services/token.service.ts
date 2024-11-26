import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { IToken } from 'src/interfaces/token/token.interface';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService,
        @InjectModel('Token') private readonly tokenModel: Model<IToken>,
    ) { }

    public createToken(userId: string): Promise<IToken> {
        const token = this.jwtService.sign(
          {
            userId,
          },
          {
            //move it to env file...
            expiresIn: 30 * 24 * 60 * 60,
          },
        );
    
        return new this.tokenModel({
          user_id: userId,
          token,
        }).save();
      }

}
