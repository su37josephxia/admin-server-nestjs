import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ShareModule } from '../shared/shared.module';


@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [ShareModule]
})
export class UserModule { }
