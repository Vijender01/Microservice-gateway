import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IToken } from 'src/interfaces/token/token.interface';
import { Request, Response } from 'express';
import { Role } from 'src/common/enums/role.enums';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService,
    @InjectModel('Token') private readonly tokenModel: Model<IToken>,
    private readonly configService: ConfigService,
  ) { }

  public async createToken(userId: string, userRole: Role): Promise<IToken> {
    try {
      console.log('userId in token service???', userId);

      // Generate a JWT token using the user ID and role
      const token = this.jwtService.sign(
        {
          userId,
          userRole,
        },
        {
          // You should move the 'expiresIn' value to the .env file for better security and flexibility
          expiresIn: this.configService.get<string>('EXPIRES_IN'), // Token expiration time (30 days)
        },
      );

      console.log('token', token);

      // Save the token in the database associated with the user
      return new this.tokenModel({
        user_id: userId,
        token,
        user_role: userRole,
        status: 'valid', // Set token status as 'valid'
      }).save();
    } catch (error) {
      // Handle any errors that occur during token creation or saving
      console.error('Error creating token:', error);
      throw new Error('An unexpected error occurred while creating the token.');
    }
  }

  public setTokenInRes(res: Response, token: IToken) {
    try {
      // Set the token as an HTTP-only cookie in the response
      res.cookie('auth_token', token, {
        httpOnly: true, // Ensures the cookie is only accessible via the web server (not by JavaScript in the browser)
        secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production environments
        maxAge: 30 * 24 * 60 * 60 * 1000, // Token expiration time in milliseconds (30 days)
        sameSite: 'strict', // Prevents the cookie from being sent in cross-site requests to mitigate CSRF attacks
        path: '/', // Cookie available for all routes of the application
      });
    } catch (error) {
      // Handle any errors that occur while setting the cookie
      console.error('Error setting token in response:', error);
      throw new Error('An unexpected error occurred while setting the token in the response.');
    }
  }

  public async removeToken(req: Request, res: Response): Promise<boolean> {
  try {
    // Retrieve the token from the cookies
    const token = req.cookies?.auth_token;

    // If no token is found, log the message and return false
    if (!token) {
      console.log('No auth_token found in cookies.');
      return false;
    }

    // Update the token status to 'invalid' in the database (using findOneAndUpdate)
    const updatedToken = await this.tokenModel.findOneAndUpdate(
      { token: token, status: 'valid' }, // Find the valid token
      { $set: { status: 'invalid' } }, // Update its status to 'invalid'
      { new: true, lean: true } // Return the updated token as a plain JavaScript object
    );

    // If the token is not found or is already invalid, log the message and return false
    if (!updatedToken) {
      console.log('Token not found or already invalid.');
      return false;
    }

    // Log the updated token status (only log relevant fields for security reasons)
    console.log('Token status updated to invalid:', updatedToken._id);

    // Clear the auth_token cookie from the response (log out the user)
    res.clearCookie('auth_token', {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production', // Only send the cookie over HTTPS in production
      sameSite: 'strict', // Mitigates CSRF risks by not sending the cookie cross-site
      path: '/', // Cookie is available for all routes in the application
    });

    return true; // Return true to indicate the token was successfully removed
  } catch (error) {
    // Log the error and return false if something goes wrong during the process
    console.error('Error removing token:', error.message);
    return false;
  }
}



}
