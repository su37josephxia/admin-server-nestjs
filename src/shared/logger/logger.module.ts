import { AppLogger } from './logger.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [AppLogger],
    exports: [AppLogger]
})
export class AppLoggerModule {

}