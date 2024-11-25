import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IAuthorizedRequest } from 'src/interfaces/common/authorized-request.interface';
import { GetUserByTokenResponseDto } from 'src/interfaces/user/dto/get-user-by-token-response.dto';
import { IServiceUserGetByIdResponse } from 'src/interfaces/user/dto/service-user-get-by-id-response.interface';

@Controller('users')
export class UsersController {
    constructor(
        @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    ) { }

    @Get()
    public async getUserByToken(
        @Req() request: IAuthorizedRequest,
    ): Promise<GetUserByTokenResponseDto> {
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
}
