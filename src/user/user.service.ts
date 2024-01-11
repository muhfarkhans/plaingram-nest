import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create.dto';
import { User } from './user.entity';
import { hashData } from 'src/common/utilities/argon';
import { UpdateUserDto } from './dto/update.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private cloudinary: CloudinaryService,
  ) {}

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const findByEmail = await this.userRepository.findByEmail(dto.email);
    if (findByEmail != null) {
      const errorMessages = {
        email: ['email already exists'],
      };
      const errorResponse = {
        statusCode: 400,
        error: 'validation error',
        message: errorMessages,
      };

      throw new BadRequestException(errorResponse);
    }

    const passwordHash = await hashData(dto.password);
    const user: User = {
      name: dto.name,
      email: dto.email,
      password: passwordHash,
      about: dto.about,
    };

    const create = await this.userRepository.create(user);
    delete create.password;

    return create;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const findById = await this.userRepository.findById(id);
    let passwordHash = findById.password;

    console.log('findById', findById);
    console.log('id', id);

    if (dto.password != undefined && dto.password != '') {
      passwordHash = await hashData(dto.password);
    }

    const user: User = {
      name: dto.name,
      email: dto.email,
      password: passwordHash,
      about: dto.about,
    };

    const update = await this.userRepository.update(id, user);
    delete update.password;

    return update;
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findByEmail(email);
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<User> {
    return await this.userRepository.updateRefreshToken(id, refreshToken);
  }
}
