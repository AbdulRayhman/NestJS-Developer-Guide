import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { IUser, UserService } from "src/users/user.service";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get("all")
  finAllUsers(): IUser[] {
    return this.userService.getUsers();
  }

  @Get(":email")
  findUserByEmail(@Param("email") email: string): IUser {
    return this.userService.getUserByEmail(email);
  }

  @Post()
  crateUser(@Body() createUser: IUser) {
    const createdUser: IUser = this.userService.addUser(createUser);
    return { ...createdUser, message: "User created successfully" };
  }

  @Delete(":email")
  deleteUser(@Param("email") email: string): IUser[] {
    const remainingUsers = this.userService.deleteUserByEmail(email);
    return remainingUsers;
  }
}
