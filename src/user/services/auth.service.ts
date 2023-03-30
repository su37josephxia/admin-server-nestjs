import { JwtService } from "@nestjs/jwt";
import { LoginDTO } from '../dtos/login.dto';
import { User } from "../entities/user.mongo.entity";
import { ObjectID, MongoRepository } from 'typeorm';
import { Inject, NotFoundException } from "@nestjs/common";
import { encryptPassword } from '../../shared/utils/cryptogram.util';
import { UserInfoDto, RegisterCodeDTO } from '../dtos/auth.dto';
import { Role } from "../entities/role.mongo.entity";
import { InjectRedis, Redis } from "@nestjs-modules/ioredis";

export class AuthService {
    constructor(
        private readonly jwtService: JwtService,

        @Inject('USER_REPOSITORY')
        private userRepository: MongoRepository<User>,

        @Inject('ROLE_REPOSITORY')
        private roleRepository: MongoRepository<Role>,

        @InjectRedis()
        private readonly redis: Redis
    ) {

    }

    async certificate(user: User) {
        const payload = {
            id: user._id
        }
        const token = this.jwtService.sign(payload)
        return token
    }

    async checkLoginForm(loginDto: LoginDTO) {
        const { phoneNumber, password } = loginDto
        const user = await this.userRepository.findOneBy({
            phoneNumber
        })
        if (!user) {
            throw new NotFoundException('用户不存在')
        }
        const { password: dbPassword, salt } = user
        const currentHashPassword = encryptPassword(password, salt)
        if (currentHashPassword !== dbPassword) {
            throw new NotFoundException('密码错误')
        }
        return user
    }


    async login(login: LoginDTO) {
        // 校验用户信息
        const user = await this.checkLoginForm(login)

        // 签发token
        const token = await this.certificate(user)

        return {
            data: {
                token
            }
        }
    }

    async info(id: string) {
        // 查询用户并获取权限
        const user = await this.userRepository.findOneBy(id)
        const data: UserInfoDto = Object.assign({}, user)
        if (user.role) {
            const role = await this.roleRepository.findOneBy(user.role)
            if (role) data.permissions = role.permissions
        }

        return data

    }
    /**
     * 获取验证码
     */
    async registerCode(dto: RegisterCodeDTO) {

        const { phoneNumber } = dto
        const redisCode = await this.redis.get('verifyCode' + phoneNumber)
        if (redisCode !== null) {
            // 未过期
            throw new NotFoundException('验证码未过期')
        }

        // 获取随意验证码
        const code = this.generateCode()

        // redis存 手机号： 验证码 附加一个 60s 过期时间
        await this.redis.set('verifyCode' + phoneNumber, code, 'EX', 60)
        console.log('生成验证码:' + code)

        // TODO 调用短信api
        return
    }

    generateCode() {
        // 4位随机码
        return [0, 0, 0, 0].map(() => parseInt(Math.random() * 10 + '')).join('')
    }
}