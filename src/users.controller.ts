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

@Controller('users')
export class UsersController {
    constructor(
        @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    ) { }

    @Get()
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
