import { ApiProperty } from "@nestjs/swagger";


export class CreateUserDto {
    @ApiProperty({ example: '12321312321' })
    phoneNumber: string;

    @ApiProperty({ example: '111111' })
    password: string;

    @ApiProperty({ example: 'aa@qq.com' })
    email: string;


}
