import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, Matches, Max, Min, Length, IsEmail } from 'class-validator';


export class CreateUserDto {
    @ApiProperty({ example: '18321312321' })
    @Matches(/^1\d{10}$/g, { message: '请输入手机号' })
    phoneNumber: string;

    @ApiProperty({ example: '111111' })
    @IsNotEmpty()
    @Length(6, 10)
    password: string;

    @ApiProperty({ example: 'aa@qq.com' })
    @IsEmail()
    email: string;
}
