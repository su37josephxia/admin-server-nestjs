
import { RemoveSensitiveUserInfoInterceptor } from '../remove-sensitive-info.interceptor'
describe('remove-sensitive-info.interceptor', () => {
    it('delValue should run', () => {
        const re = new RemoveSensitiveUserInfoInterceptor()

        expect(re.delValue({ b: 1 }, 'a')).toEqual({ b: 1 })

        expect(re.delValue({ b: 1, a: 2 }, 'a')).toEqual({ b: 1 })


        expect(re.delValue({
            b: 1, c: {
                a: 3
            }
        }, 'a')).toEqual({ b: 1, c: {} })
    })


})