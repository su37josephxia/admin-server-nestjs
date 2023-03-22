

import { ApiProperty } from "@nestjs/swagger";
import { isString } from "class-validator";

export class UploadDTO {
    @ApiProperty({
        example: 'xxx文件'
    })
    name: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false
    })
    file: Express.Multer.File
}