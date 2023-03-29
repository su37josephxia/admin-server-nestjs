import { Body, Controller, Get, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BaseApiErrorResponse, SwaggerBaseApiResponse } from '../../shared/dtos/base-api-response.dto';
import { LoginDTO } from "../dtos/login.dto";
import { AuthService } from "../services/auth.service";
import { UserInfoDto } from '../dtos/auth.dto';
import { AuthGuard } from "@nestjs/passport";

@ApiTags('认证鉴权')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @ApiOperation({
        summary: '用户登录',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(LoginDTO),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseApiErrorResponse,
    })
    @Post('login')
    async login(
        @Body() loginDTO: LoginDTO
    ): Promise<any> {
        return this.authService.login(loginDTO)
    }

    @ApiOperation({
        summary: '用户当前信息',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse(UserInfoDto),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseApiErrorResponse,
    })
    @ApiBearerAuth()
    @Get('info')
    @UseGuards(AuthGuard('jwt'))
    async info(@Req() req: any): Promise<any> {
        const data = await this.authService.info(req.user.id)
        // delete data.password
        // delete data.salt
        return { data }
    }

}