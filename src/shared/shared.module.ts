import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/module-options';
import { DatabaseProviders } from './database.providers';
import { AppLoggerModule } from './logger/logger.module';
import { UploadService } from './upload/upload.service';
@Module({
    exports: [
        SystemService,
        ConfigModule,
        AppLoggerModule,
        ...DatabaseProviders,
        UploadService
    ],
    providers: [SystemService, ...DatabaseProviders,
        UploadService

    ],
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        AppLoggerModule
    ]
})
export class ShareModule { }