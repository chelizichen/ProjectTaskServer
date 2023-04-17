import { Controller, Get, Post, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    return await this.userService.register(userDto)
  }

  @Post('login')
  async login(@Body() userDto: CreateUserDto) {
    return await this.userService.login(userDto)
  }

  @Get()
  async find() {
    return await this.userService.find()
  }

  @Post()
  async findByIds(@Body() ids) {
    return await this.userService.findByIds(ids)
  }
}
