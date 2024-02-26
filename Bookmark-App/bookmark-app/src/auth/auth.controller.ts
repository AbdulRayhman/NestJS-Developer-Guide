import { Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    this.authService.login();
  }

  @Post('login')
  login() {
    return 'Hello Login';
  }
  @Post('/signup')
  singIn() {
    return "I'm Sing-up";
  }
}
