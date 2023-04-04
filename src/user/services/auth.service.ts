import { JwtService } from "@nestjs/jwt";
import { LoginDTO } from '../dtos/login.dto';
import { User } from "../entities/user.mongo.entity";
import { ObjectID, MongoRepository } from 'typeorm';
import { Inject, NotFoundException } from "@nestjs/common";
import { encryptPassword, makeSalt } from '../../shared/utils/cryptogram.util';
import { UserInfoDto, RegisterCodeDTO, RegisterDTO, RegisterSMSDTO } from '../dtos/auth.dto';
import { Role } from "../entities/role.mongo.entity";
import { InjectRedis, Redis } from "@nestjs-modules/ioredis";
import { CaptchaService } from '../../shared/captcha/captcha.service';
import { UserService } from "./user.service";

export class AuthService {
    constructor(
        private readonly jwtService: JwtService,

        @Inject('USER_REPOSITORY')
        private userRepository: MongoRepository<User>,

        @Inject('ROLE_REPOSITORY')
        private roleRepository: MongoRepository<Role>,

        @InjectRedis()
        private readonly redis: Redis,

        private readonly captchaService: CaptchaService,

        private userService: UserService
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


        const { phoneNumber, captchaCode, captchaId } = dto

        // 校验图形验证码
        const captcha = await this.redis.get('captcha' + captchaId)
        if (!captcha || captcha.toLocaleLowerCase() !== captchaCode.toLocaleLowerCase()) {
            throw new NotFoundException('图形验证错误')
        }

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

    async getCaptcha() {
        const { text, data } = await this.captchaService.captcha()

        const id = makeSalt(4)

        console.log('图形验证码:', text)

        this.redis.set('captcha' + id, text, "EX", 600)

        const image = `data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}`

        return { id, image }

    }

    /**
   * 短信注册
   * @param registerDTO 
   * @returns 
   */
    async registerBySMS(
        registerDTO: RegisterSMSDTO
    ): Promise<any> {


        const { phoneNumber, smsCode } = registerDTO;

        // 短信验证码校验
        const code = await this.getMobileVerifyCode(phoneNumber)
        if (smsCode !== code) {
            throw new NotFoundException('验证码不一致，或已过期')
        }

        let user = await this.userRepository
            .findOneBy({ phoneNumber })
        if (!user) {
            // 用户不存在匿名注册
            const password = makeSalt(8)
            user = await this.register({
                phoneNumber,
                name: `手机用户${makeSalt(8)}`,
                password,
                passwordRepeat: password
            })
        }

        const token = await this.certificate(user)
        return {
            data: {
                token
            }
        }

    }

    async getMobileVerifyCode(mobile) {
        return await this.redis.get('verifyCode' + mobile);
    }

    /**
   * 注册
   * @param registerDTO 
   * @returns 
   */
    async register(
        registerDTO: RegisterDTO
    ): Promise<any> {

        await this.checkRegisterForm(registerDTO)

        const { name, password, phoneNumber } = registerDTO;
        // const salt = makeSalt(); // 制作密码盐
        // const hashPassword = encryptPassword(password, salt);  // 加密密码

        const { salt, hashPassword } = this.userService.getPassword(password)

        const newUser: User = new User()
        newUser.name = name
        newUser.phoneNumber = phoneNumber
        newUser.password = hashPassword
        newUser.salt = salt
        const data = await this.userRepository.save(newUser)
        delete data.password
        delete data.salt
        return {
            data
        }
    }

    /**
   * 校验注册信息
   * @param registerDTO 
   */
    async checkRegisterForm(
        registerDTO: RegisterDTO,
    ): Promise<any> {

        if (registerDTO.password !== registerDTO.passwordRepeat) {
            throw new NotFoundException('两次输入的密码不一致，请检查')
        }
        const { phoneNumber } = registerDTO
        const hasUser = await this.userRepository
            .findOneBy({ phoneNumber })
        if (hasUser) {
            throw new NotFoundException('用户已存在')
        }
    }



}