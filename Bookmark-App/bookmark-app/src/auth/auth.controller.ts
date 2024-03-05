import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthDto } from 'src/auth/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    console.log({ dto });
    return this.authService.signin(dto);
  }
  @Post('/signup')
  singIn(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
}
