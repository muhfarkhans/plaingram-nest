import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostShareDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
