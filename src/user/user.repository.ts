import { Injectable } from '@nestjs/common';
import { IUserRepository } from './user.repository.interface';
import { User } from './user.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  create(data: User): Promise<User> {
    return this.prisma.user.create({ data });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findById(id: string): Promise<User> {
    return this.prisma.user.findFirst({ where: { id } });
  }

  findByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({ where: { email } });
  }

  update(id: string, data: User): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  updateRefreshToken(id: string, refreshToken: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        refreshToken,
      },
    });
  }

  delete(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
