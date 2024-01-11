import { IsOptional, IsString } from 'class-validator';

export class SearchDto {
  @IsOptional()
  @IsString()
  q: string;

  @IsOptional()
  @IsString()
  tag: string;
}
