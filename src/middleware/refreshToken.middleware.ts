import { BadRequestException, Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Model} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IToken } from 'src/interfaces/token/token.interface';

@Injectable()
export class refreshTokenMiddleware implements NestMiddleware {
    constructor(
        private reflector: Reflector, 
        private jwtService: JwtService,
        @InjectModel('Token') private readonly tokenModel: Model<IToken>,

    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies?.auth_token; 
            // console.log('inside refresh Token',token);
            
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized: No token found' });
            }

            const storedToken = await this.tokenModel.findOne({ token });

            if(storedToken && storedToken.status !== 'valid') {
                return res
                .status(401)
                .json({ message: 'Unauthorized' });
            }

            const decode = this.jwtService.decode(token) as { exp: number } | null;

            if (decode) {
                const now = Date.now();
                const expires = decode.exp * 1000;
                const timeRemains = expires - now;
                const threshold = 1000 * 45;

                if (timeRemains <= threshold) {
                    try {
                        const verifyToken = await this.jwtService.verify(token);

                        if (verifyToken) {
                            const { iat, exp, ...originalPayload } = verifyToken;
                            const newToken = await this.jwtService.sign(originalPayload);
                            res.cookie('jwt', newToken, { httpOnly: true, maxAge: 60 * 1000 }); 
                        } else {
                            throw new UnauthorizedException('Invalid token');
                        }
                    } catch (error) {
                        throw new UnauthorizedException('Invalid token');
                    }
                }
            }
            next();
        } catch (error) {
            throw error; 
        }
    }
}
