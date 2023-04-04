import { NestInterceptor, Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class RemoveSensitiveUserInfoInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        // console.log('RemoveSensitiveUserInfoInterceptor ...')
        // console.log(`${context.getClass().name} ${context.getHandler().name}`)
        const request = context.switchToHttp().getRequest()
        // console.log('request', request.body)
        return next.handle().pipe(
            map(res => {
                res = JSON.parse(JSON.stringify(res))
                // 全局消除
                this.delValue(res, 'password')
                this.delValue(res, 'salt')
                return res
            })
        )
    }

    delValue(data, targetKey) {
        for (let key in data) {
            if (key === targetKey) {
                delete data[key]
            } else if (typeof data[key] === 'object') {
                this.delValue(data[key], targetKey)
            }
        }
        return data
    }

}