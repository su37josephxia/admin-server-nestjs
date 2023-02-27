import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/module-options';
@Module({
    exports: [SystemService, ConfigModule],
    providers: [SystemService],
    imports: [
        ConfigModule.forRoot(configModuleOptions)
    ]
})
export class ShareModule { }