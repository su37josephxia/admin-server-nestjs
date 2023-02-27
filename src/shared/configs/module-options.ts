import { ConfigModuleOptions } from "@nestjs/config";
import configration from "./configration";

export const configModuleOptions: ConfigModuleOptions = {
    envFilePath: '.env',
    load: [configration]
}