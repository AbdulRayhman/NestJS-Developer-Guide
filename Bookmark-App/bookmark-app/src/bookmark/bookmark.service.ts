import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    try {
      const createdBookmark = await this.prisma.bookmark.create({
        data: {
          userId: userId,
          ...dto,
        },
      });
      return createdBookmark;
    } catch (err) {
      console.log(err);
      throw new ForbiddenException(err);
    }
  }

  async getAllBookmarks(userId: number) {
    try {
      return await this.prisma.bookmark.findMany({ where: { userId: userId } });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    try {
      return await this.prisma.bookmark.findFirst({
        where: { id: bookmarkId, userId: userId },
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    bookmarkDto: EditBookmarkDto,
  ) {
    try {
      const isBookmark = await this.prisma.bookmark.findUnique({
        where: { id: bookmarkId },
      });

      if (!isBookmark || isBookmark.userId !== userId)
        throw new ForbiddenException('Access Deined');

      return await this.prisma.bookmark.update({
        where: { id: bookmarkId, userId: userId },
        data: { ...bookmarkDto },
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    try {
      const isBookmark = await this.prisma.bookmark.findUnique({
        where: { id: bookmarkId },
      });

      if (!isBookmark || isBookmark.userId !== userId)
        throw new ForbiddenException('Access Deined');
      
      return await this.prisma.bookmark.delete({
        where: { id: bookmarkId, userId: userId },
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
