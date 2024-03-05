import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressReq } from 'express';

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard('jwt1'))
  @Get('me')
  getMe(@Request() req: ExpressReq) {
    return req.user;
  }
}
