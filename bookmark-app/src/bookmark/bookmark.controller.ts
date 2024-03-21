import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { getUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from 'src/bookmark/bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createBookmark(
    @getUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }
  @Get()
  getAllBookmarks(@getUser('id') userId: number) {
    return this.bookmarkService.getAllBookmarks(userId);
  }
  @Get(':id')
  getBookmarkById(
    @getUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  editBookmarkById(
    @getUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() bookmarkDto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(
      userId,
      bookmarkId,
      bookmarkDto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(
    @getUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
