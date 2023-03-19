import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { ShareModule } from '../shared/shared.module';
import { UserProviders } from './user.providers';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';

@Module({
  controllers: [UserController, RoleController],
  providers: [UserService, ...UserProviders, RoleService],
  imports: [ShareModule]
})
export class UserModule { }
