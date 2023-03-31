import * as svgCaptcha from 'svg-captcha'
import { Injectable } from '@nestjs/common';

@Injectable()
export class CaptchaService {
    async captcha(size = 4) {
        const captcha = svgCaptcha.create({
            size,
            fontSize: 50,
            width: 100,
            height: 34,
            background: '#cc9966'
        })
        return captcha
    }
}