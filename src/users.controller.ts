import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import {Request, Response } from 'express';
import { IAuthorizedRequest } from 'src/interfaces/common/authorized-request.interface';
import { GetUserByTokenResponseDto } from 'src/interfaces/user/dto/get-user-by-token-response.dto';
import { IServiceUserGetByIdResponse } from 'src/interfaces/user/dto/service-user-get-by-id-response.interface';
import { LoginUserResponseDto } from './interfaces/user/dto/login-user-response.dto';
import { LoginUserDto } from './interfaces/user/dto/login-user-dto';
import { IServiceUserSearchResponse } from './interfaces/user/dto/service-user-search-response.interface';
import { IServiveTokenCreateResponse } from './token/service-token-create-response.interface';
import { Authorization } from './decorators/authorization.decorator';
import { CreateUserResponseDto } from './interfaces/user/dto/create-user-response.dto';
import { CreateUserDto } from './interfaces/user/dto/create-user.dto';
import { IServiceUserCreateResponse } from './interfaces/user/dto/service-user-create-response.interface';
import { TokenService } from './services/token.service';
import { RolesGuard } from './services/guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './common/enums/role.enums';

@Controller('users')
export class UsersController {
    constructor(
        @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
        private readonly tokenService: TokenService,
    ) { }

    @UseGuards(RolesGuard)
    @Get('getUserByEmail')   //test route to check if the middle ware to verify token is working
    @Roles(Role.Admin)
    public async getUserByEmail(
      @Body() email: string
    ) {
      return email;
    }
    


    @Post()
    @ApiCreatedResponse({
      type: CreateUserResponseDto,
    })
    public async createUser(
      @Body() userRequest: CreateUserDto,
      @Res({ passthrough: true }) res: Response
    ): Promise<CreateUserResponseDto> {
      console.log('userRequest?????',userRequest);
      
      const createUserResponse: IServiceUserCreateResponse = await firstValueFrom(
        this.userServiceClient.send('user_create', userRequest),
      );
      console.log('createUserResponse????',createUserResponse);
      
      if (createUserResponse.status !== HttpStatus.CREATED) {
        throw new HttpException(
          {
            message: createUserResponse.message,
            data: null,
            errors: createUserResponse.errors,
          },
          createUserResponse.status,
        );
      }
  
    //   const createTokenResponse: IServiveTokenCreateResponse = await firstValueFrom(
    //     this.tokenServiceClient.send('token_create', {
    //       userId: createUserResponse.user.id,
    //     }),
    //   );

    console.log('createUserResponse222222222222222????',createUserResponse.user.id);


      const createTokenResponse = await this.tokenService.createToken(createUserResponse.user.id, createUserResponse.user.role);

      console.log('createtokenresponse',createTokenResponse);

      this.tokenService.setTokenInRes(res, createTokenResponse)

      // res.cookie('auth_token', createTokenResponse.token, {
      //   httpOnly: true, // Ensures the cookie is accessible only by the web server
      //   secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
      //   maxAge: 30 * 24 * 60 * 60 * 1000, // Expiration time in milliseconds (30 days)
      //   sameSite: 'strict', // Helps mitigate CSRF attacks
      //   path: '/', // Cookie available for all routes
      // });
      
  
      return {
        message: createUserResponse.message,
        data: {
          user: createUserResponse.user,
          token: createTokenResponse.token,
        },
        errors: null,
      };
    }
    @Post('/signout')
    public async signout(
      @Res({ passthrough: true }) res: Response,
      @Req() req: Request
    ) {
      const isTokenRemoved = await this.tokenService.removeToken(req, res);
      console.log('isToken removed????',isTokenRemoved);
      
    
      // Respond with a simple message
      // if (!isTokenRemoved) {
      //   console.log('Failed to invalidate the token.');
        // return res.status(400).json({ message: 'Failed to sign out. Token not found or already invalid.' });
        // return {
        //   message: 'Failed to sign out. Token not found or already invalid.'
        // }
      // }
    
      // console.log('Token successfully invalidated.');
      // return res.status(200).json({ message: 'User signed out successfully.' });
      return {
        message: 'User signed out successfully.'
      }
    }
    
    

    




    @Post('/login')
    @ApiCreatedResponse({
      type: LoginUserResponseDto,
    })
    public async loginUser(
      @Body() loginRequest: LoginUserDto,
      @Res({ passthrough: true }) res: Response
    ): Promise<LoginUserResponseDto> {
      console.log('login>>>>>>>>>>>>>>>>>>>',loginRequest);

      this.userServiceClient.send('test', {});
      
      const getUserResponse: IServiceUserSearchResponse = await firstValueFrom(
        this.userServiceClient.send('user_search_by_credentials', loginRequest),
      );

    
  
      console.log('1getUserResponse??',getUserResponse);
      
  
      if (getUserResponse.status !== HttpStatus.OK) {
        throw new HttpException(
          {
            message: getUserResponse.message,
            data: null,
            errors: null,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
  
      console.log('2??',getUserResponse);
  
      const createTokenResponse = await this.tokenService.createToken(getUserResponse.user.id, getUserResponse.user.role);
      this.tokenService.setTokenInRes(res, createTokenResponse)
      
  
      console.log('3??',createTokenResponse);
  
      
  
      return {
        message: getUserResponse.message,
        data: {
          token: createTokenResponse.token,
        },
        errors: null,
        //  message: 'createTokenResponse.message',
        // data: {
        //   token: 'createTokenResponse.token',
        // },
        // errors: null,
      };
    }
  
}
