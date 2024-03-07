import { IsNotEmpty, IsOptional } from 'class-validator';

export class EditBookmarkDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  link: string;
}
