import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/module-options';
import { DatabaseProviders } from './database.providers';
@Module({
    exports: [SystemService, ConfigModule, ...DatabaseProviders],
    providers: [SystemService, ...DatabaseProviders],
    imports: [
        ConfigModule.forRoot(configModuleOptions)
    ]
})
export class ShareModule { }