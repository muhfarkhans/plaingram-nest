import { User } from './user.entity';

export interface IUserRepository {
  create(data: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  update(id: string, data: User): Promise<User>;
  updateRefreshToken(id: string, refreshToken: string): Promise<User>;
  delete(id: string): Promise<User>;
}
