import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { log } from 'console';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { config } from 'process';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    // this.prisma.$connect()
  }
  async signup(dto: AuthDto) {
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
  async signin(dto: AuthDto) {
    try {
      //Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      // if not throw exception
      if (!user) {
        throw new ForbiddenException('Credentials Invalid!');
      }
      // check if password match
      const isPasswordMatches = await argon.verify(user.hash, dto.password);
      // if not throw exception
      if (!isPasswordMatches) {
        throw new ForbiddenException('Credentials Invalid!');
      }

      return this.signToken(user.id, user.email);
    } catch (err) {
      return err;
    }
  }
  async signToken(
    userId: number,
    email: String,
  ): Promise<{ access_token: string }> {
    const payload = { userId, email };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '10m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
