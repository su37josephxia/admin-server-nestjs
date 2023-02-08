import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SystemService } from '../shared/services/system.service';

@Injectable()
export class UserService {
  constructor(private readonly systemService: SystemService) {

  }

  create(createUserDto: CreateUserDto) {


    console.log(this.systemService.getEnv())

    // 调用Modle
    return 'This action adds a 🚀 new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
