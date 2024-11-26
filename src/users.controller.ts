import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
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

@Controller('users')
export class UsersController {
    constructor(
        @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
        private readonly tokenService: TokenService,
    ) { }

    @Get()
    @Authorization(true)
    public async getUserByToken(
        @Req() request: IAuthorizedRequest,
    ): Promise<GetUserByTokenResponseDto> {
        console.log('i am in userssss?????????',request.user);
        
        const userInfo = request.user;
        console.log(request.user);
        const userResponse: IServiceUserGetByIdResponse = await firstValueFrom(
            this.userServiceClient.send('user_get_by_id', userInfo.id),
        );

        return {
            message: userResponse.message,
            data: {
                user: userResponse.user,
            },
            errors: null,
        };
    }

    @Post()
    @ApiCreatedResponse({
      type: CreateUserResponseDto,
    })
    public async createUser(
      @Body() userRequest: CreateUserDto,
    ): Promise<CreateUserResponseDto> {
      const createUserResponse: IServiceUserCreateResponse = await firstValueFrom(
        this.userServiceClient.send('user_create', userRequest),
      );
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

      const createTokenResponse = await this.tokenService.createToken(createUserResponse.user.id);

      console.log('createtokenresponse',createTokenResponse);
      
  
      return {
        message: createUserResponse.message,
        data: {
          user: createUserResponse.user,
          token: createTokenResponse.token,
        },
        errors: null,
      };
    }




    @Post('/login')
    @ApiCreatedResponse({
      type: LoginUserResponseDto,
    })
    public async loginUser(
      @Body() loginRequest: LoginUserDto,
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
  
    //   const createTokenResponse: IServiveTokenCreateResponse = await firstValueFrom(
    //     this.tokenServiceClient.send('token_create', {
    //       userId: getUserResponse.user.id,
    //     }),
    //   );
      
  
    //   console.log('3??',createTokenResponse);
  
      
  
      return {
        // message: createTokenResponse.message,
        // data: {
        //   token: createTokenResponse.token,
        // },
        // errors: null,
         message: 'createTokenResponse.message',
        data: {
          token: 'createTokenResponse.token',
        },
        errors: null,
      };
    }
  
}
