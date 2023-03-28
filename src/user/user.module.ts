import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { ShareModule } from '../shared/shared.module';
import { UserProviders } from './user.providers';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [UserController, RoleController, AuthController],
  providers: [UserService, AuthService, ...UserProviders, RoleService, JwtStrategy],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ShareModule],
      useFactory: (configService: ConfigService) => (configService.get('jwt'))
    }),
    ShareModule]
})
export class UserModule { }
