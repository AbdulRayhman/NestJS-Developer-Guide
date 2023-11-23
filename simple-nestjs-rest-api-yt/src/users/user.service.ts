import { Injectable, NotFoundException } from "@nestjs/common";

export interface IUser {
  email: string;
  name: string;
}

@Injectable()
export class UserService {
  private users: IUser[] = [];

  getUsers(): IUser[] {
    return this.users;
  }

  addUser(user: IUser): IUser {
    this.users.push(user);
    return user;
  }

  getUserByEmail(email: string): IUser {
    const user = this.users.filter((usr) => usr.email === email);
    if (user && Array.isArray(user) && user.length > 1) {
      return user[0];
    }
    throw new NotFoundException("User with email not found!");
  }

  deleteUserByEmail(email: string): IUser[] {
    const user = this.users.filter((usr) => usr.email !== email);
    if (user && Array.isArray(user) && user.length > 1) {
      return user;
    }
    throw new NotFoundException("User with email not found!");
  }

  getHello(): string {
    return "Hello World!";
  }
}
