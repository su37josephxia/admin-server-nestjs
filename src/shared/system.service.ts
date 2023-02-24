import { Injectable } from '@nestjs/common';
@Injectable()
export class SystemService {
    constructor() { }
    getEnv() {
        return {
            a: 1
        }
    }
}