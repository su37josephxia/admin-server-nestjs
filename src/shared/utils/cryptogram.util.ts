import * as crypto from 'crypto'
/**
 * 随机盐  产生随机字符串
 * @param len 
 */
export function makeSalt(len = 3) {
    return crypto.randomBytes(len).toString('base64')
}

export function encryptPassword(password: string, salt: string): string {
    if (!password || !salt) {
        return ''
    }
    const tempSalt = Buffer.from(salt, 'base64')
    return (
        crypto.pbkdf2Sync(password, tempSalt, 10000, 16, 'sha1').toString('base64')
    )
}
/**
 * 获取文件哈希值
 * @param buffer 
 */
export function encryptFileMD5(buffer: Buffer) {
    const md5 = crypto.createHash('md5')
    return md5.update(buffer).digest('hex')
}