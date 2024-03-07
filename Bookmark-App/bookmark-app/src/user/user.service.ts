import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from 'src/user/dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const editedUser: User = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
      },
    });
    delete editedUser.hash;
    return editedUser;
  }
}
