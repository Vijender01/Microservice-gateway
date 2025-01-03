import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { Request, Response } from 'express';
import { LoginUserResponseDto } from './dto/login-user-response.dto';
import { LoginUserDto } from './dto/login-user-dto';
import { IServiceUserSearchResponse } from './interfaces/user/service-user-search-response.interface';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { IServiceUserCreateResponse } from './interfaces/user/service-user-create-response.interface';
import { TokenService } from './services/token.service';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './common/enums/role.enums';
import { ERROR_MESSAGES } from './common/constants/error-messages';
import { SUCCESS_MESSAGES } from './common/constants/success-messages';
import { user_service } from './common/constants/user-services';

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
    try {

      // Call the user service to create the user
      const createUserResponse: IServiceUserCreateResponse = await firstValueFrom(
        this.userServiceClient.send(user_service.CREATE_USER, userRequest),
      );

      // Check if the user creation was successful (status CREATED)
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
      // Generate a token for the newly created user
      const createTokenResponse = await this.tokenService.createToken(
        createUserResponse.user.id,
        createUserResponse.user.role
      );
      // Store the generated token in the response headers
      this.tokenService.setTokenInRes(res, createTokenResponse);

      return {
        message: createUserResponse.message,
        data: {
          user: createUserResponse.user,
          token: createTokenResponse.token,
        },
        errors: null,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        // If the error is already an HttpException, throw it as is
        throw error;
      }

      throw new HttpException(
        {
          // Handle any thrown errors during the execution
          message: ERROR_MESSAGES.CREATE_USER_FAILED,
          data: null,
          errors: error instanceof Error ? error.message : error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,  // Set HTTP status to 500 (Internal Server Error)
      );
    }
  }


  @Post('/signout')
  public async signout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ) {
    try {
      // Call the token service to remove the token (log out the user)
      await this.tokenService.removeToken(req, res);

      // Return a success message after the user has been signed out
      return {
        message: SUCCESS_MESSAGES.SIGNOUT_SUCCESS
      };
    } catch (error) {
      // Handle any errors that occur during the sign-out process
      throw new HttpException(
        {
          message: ERROR_MESSAGES.SIGNOUT_ERROR,
          data: null,
          errors: error instanceof Error ? error.message : error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @Post('/login')   // Endpoint to log in a user
  @ApiCreatedResponse({
    type: LoginUserResponseDto,
  })
  public async loginUser(
    @Body() loginRequest: LoginUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginUserResponseDto> {
    try {
      // Call the user service to search for the user by provided credentials (username and password)
      const getUserResponse: IServiceUserSearchResponse = await firstValueFrom(
        this.userServiceClient.send(user_service.SEARCH_USER_BY_CREDENTIALS, loginRequest),
      );

      // If the user was not found or the credentials are incorrect, throw an unauthorized exception
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

      // If credentials are valid, generate a token for the user (authentication token)
      const createTokenResponse = await this.tokenService.createToken(
        getUserResponse.user.id,
        getUserResponse.user.role
      );

       // Set the token in the response headers (for the client to use in future requests)
      this.tokenService.setTokenInRes(res, createTokenResponse);

       // Return the response with a success message and the generated token
      return {
        message: getUserResponse.message,
        data: {
          token: createTokenResponse.token,
        },
        errors: null,
      };
    } catch (error) {
      // Handle any errors that occur during the login process
      if (error instanceof HttpException) {
        throw error;
      }

       // For any unexpected errors, return a generic internal server error response
      throw new HttpException(
        {
          message: ERROR_MESSAGES.LOGIN_UNAUTHORIZED,
          data: null,
          errors: error instanceof Error ? error.message : error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


}
