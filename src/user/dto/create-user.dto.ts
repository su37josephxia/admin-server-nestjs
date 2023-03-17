import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, Length } from 'class-validator'
export class CreateUserDto {

    /**
    * 手机号（系统唯一）
    */
    @ApiProperty({ example: '13611177421' })
    @Matches(/^1\d{10}$/g, { message: '请输入手机号' })
    readonly phoneNumber: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    @Length(6, 10)
    password: string;

    @ApiProperty({ example: '15906475@qq.com' })
    email: string;

}