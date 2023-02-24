import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
@Module({
    exports: [SystemService],
    providers: [SystemService]
})
export class ShareModule { }