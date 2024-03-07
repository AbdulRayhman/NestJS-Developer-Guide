import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@getUser() user: User, @getUser('email') email: string) {
    console.log({ email });
    return user;
  }

  @Patch('edit')
  editUser(@getUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
