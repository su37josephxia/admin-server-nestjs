import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { SystemService } from '../../shared/system.service';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { AppLogger } from 'src/shared/logger/logger.service';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { makeSalt } from 'src/shared/utils/cryptogram.util';
import { encryptPassword } from '../../shared/utils/cryptogram.util';
import { UploadService } from '@/shared/upload/upload.service';


@Injectable()
export class UserService {
  constructor(private readonly systemService: SystemService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
    private readonly logger: AppLogger,
    private readonly uploadService: UploadService
  ) {
    this.logger.setContext(UserService.name)
  }

  create(user: CreateUserDto) {
    // 调用Modle
    // return 'This action adds a 🚀 new user';

    // 加密处理
    if (user.password) {
      const { salt, hashPassword } = this.getPassword(user.password)
      user.salt = salt
      user.password = hashPassword
    }

    return this.userRepository.save(user)
  }

  async findAll({ pageSize, page }: PaginationParamsDto): Promise<{ data: User[], count: number }> {

    const [data, count] = await this.userRepository.findAndCount({
      order: { name: 'DESC' },
      skip: (page - 1) * pageSize,
      take: (pageSize * 1),
      cache: true
    })

    // 100 => 第二页 5 6-10
    return {
      data, count
    }
  }

  async findOne(id: string) {
    return await this.userRepository.findOneBy(id)

  }

  async update(id: string, user: CreateUserDto) {
    if (user.password) {
      const { salt, hashPassword } = this.getPassword(user.password)
      user.salt = salt
      user.password = hashPassword
    }
    return await this.userRepository.update(id, user)
  }

  async remove(id: string): Promise<any> {
    return await this.userRepository.delete(id)
  }

  async uploadAvatar(file) {
    const { url } = await this.uploadService.upload(file)
    return { data: url }
  }


  getPassword(password) {
    const salt = makeSalt()
    const hashPassword = encryptPassword(password, salt)
    return { salt, hashPassword }
  }
}
