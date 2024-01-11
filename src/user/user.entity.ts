export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  about: string;
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserWithoutPassword = Omit<User, 'password'>;
