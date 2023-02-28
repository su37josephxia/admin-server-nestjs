import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ShareModule } from '../shared/shared.module';
import { UserProviders } from './user.providers';


@Module({
  controllers: [UserController],
  providers: [UserService, ...UserProviders],
  imports: [ShareModule]
})
export class UserModule { }
