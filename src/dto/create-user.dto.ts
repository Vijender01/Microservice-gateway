import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enums';

export class CreateUserDto {
  @ApiProperty({
    uniqueItems: true,
    example: 'test1@denrox.com',
  })
  email: string;
  @ApiProperty({
    minLength: 6,
    example: 'test11',
  })
  password: string;

  @ApiProperty({
    enum: Role,
    enumName: 'Role',
    description: 'Role of the user (Admin, Customer, Employee)',
    example: Role.Admin,
  })
  role: Role;
}
