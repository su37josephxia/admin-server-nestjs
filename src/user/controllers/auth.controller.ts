import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BaseApiErrorResponse, SwaggerBaseApiResponse } from '../../shared/dtos/base-api-response.dto';
import { LoginDTO } from "../dtos/login.dto";
import { AuthService } from "../services/auth.service";

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

}