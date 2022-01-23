import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.userService.findUserById(id);
  }

  @Get('/users')
  async getUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const temp = await this.userService
      .createUser(createUserDto)
      .catch((err) => {
        if (err.code === 11000) {
          throw new HttpException('email already in use', 400);
        }
        throw new BadRequestException(err);
      });

    return temp;
  }
}
