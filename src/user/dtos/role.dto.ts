import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { IdDTO } from '../../shared/dtos/id.dto';

export class CreateRoleDto extends IdDTO {
    @ApiProperty({ example: 'admin' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: {
            'dashboard/workplace': [
                'write',
                'read'
            ],
            user: [
                'read',
                'write'
            ],
            course: [
                'write',
                'read'
            ],
            role: [
                'read',
                'write'
            ]
        }
    })
    @IsNotEmpty()
    permissions: object;

}
