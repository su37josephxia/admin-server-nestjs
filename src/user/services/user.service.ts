import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { SystemService } from '../../shared/system.service';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { AppLogger } from 'src/shared/logger/logger.service';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';


@Injectable()
export class UserService {
  constructor(private readonly systemService: SystemService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(UserService.name)
  }

  create(createUserDto: CreateUserDto) {
    // this.logger.info(null, 'User Create ....', {
    //   a: 123
    // })

    // this.logger.debug(null, 'Debug User Create ....', {
    //   a: 123
    // })
    // console.log('Env:', this.systemService.getEnv())

    // 调用Modle
    // return 'This action adds a 🚀 new user';
    return this.userRepository.save({
      name: 'haha',
      email: '1@1.com'
    })
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
    return await this.userRepository.update(id, user)
  }

  async remove(id: string): Promise<any> {
    return await this.userRepository.delete(id)
  }
}
