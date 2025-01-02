import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IToken } from 'src/interfaces/token/token.interface';

@Injectable()
export class refreshTokenMiddleware implements NestMiddleware {
    // Inject necessary services and dependencies into the middleware
    constructor(
        private jwtService: JwtService, // Service to work with JWT tokens (encode, decode, verify)
        @InjectModel('Token') private readonly tokenModel: Model<IToken>, // Inject the Token model to interact with MongoDB
    ) { }

    // Middleware logic
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            // Get the token from cookies
            const token = req.cookies?.auth_token;

            // If token is not present in the cookies, return 401 Unauthorized error
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized: No token found' });
            }

            // Find the token in the database and check its status
            const storedToken = await this.tokenModel.findOne({ token });

            // If the token is found but its status is not 'valid', reject with Unauthorized error
            if (storedToken && storedToken.status !== 'valid') {
                return res
                    .status(401)
                    .json({ message: 'Unauthorized: Token is invalid or expired' });
            }

            // Decode the JWT token to check its expiration time
            const decode = this.jwtService.decode(token) as { exp: number } | null;

            if (decode) {
                const now = Date.now(); // Current time in milliseconds
                const expires = decode.exp * 1000; // Convert expiration time from seconds to milliseconds
                const timeRemains = expires - now; // Calculate remaining time before token expiration
                const threshold = 1000 * 45; // Set the threshold for token refresh (45 seconds before expiration)

                // If the remaining time is less than or equal to the threshold, refresh the token
                if (timeRemains <= threshold) {
                    try {
                        // Verify the token's validity
                        const verifyToken = await this.jwtService.verify(token);

                        if (verifyToken) {
                            // If valid, remove sensitive data (like issued at 'iat' and expiration 'exp') from the payload
                            const { iat, exp, ...originalPayload } = verifyToken;

                            // Sign a new token with the original payload (excluding 'iat' and 'exp')
                            const newToken = await this.jwtService.sign(originalPayload);

                            // Send the new token as a cookie (with HTTP-only flag for security)
                            res.cookie('jwt', newToken, { httpOnly: true, maxAge: 60 * 1000 }); // New token expires in 60 seconds
                        } else {
                            // If verification fails, throw UnauthorizedException
                            throw new UnauthorizedException('Invalid token');
                        }
                    } catch (error) {
                        // If token verification fails, throw UnauthorizedException
                        throw new UnauthorizedException('Invalid token');
                    }
                }
            }

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            // If any error occurs, propagate the error
            throw error;
        }
    }
}
