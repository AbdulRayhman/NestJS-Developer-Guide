import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { log } from 'console';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {
    // this.prisma.$connect()
  }
  async signin(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: { hash, email: dto.email },
      });
      delete user.hash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials must be unique!');
        }
      }
      log(`TEST`, error);
      return error;
    }
  }
  signup() {
    return { data: 'sing-up' };
  }
}
