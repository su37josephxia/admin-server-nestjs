import { join } from 'path'
import { ensureDir, outputFile } from 'fs-extra'
import { encryptFileMD5 } from '../utils/cryptogram.util';
export class UploadService {
    /**
     * 上传
     * @param file 
     */
    async upload(file) {
        // 存储文件夹的位置
        const uploadDir = (!!process.env.UPLOAD_DIR && process.env.UPLOAD_DIR !== '') ? process.env.UPLOAD_DIR : join(__dirname, '../../..', 'static/upload')
        await ensureDir(uploadDir)

        const sign = encryptFileMD5(file.buffer)
        // 去扩展名   xxx.jpg
        const arr = file.originalname.split('.')
        const fileType = arr[arr.length - 1]
        const fileName = sign + '.' + fileType
        const uploadPath = uploadDir + '/' + fileName

        await outputFile(uploadPath, file.buffer)

        return {
            url: '/static/upload/' + fileName,
            path: uploadPath
        }


    }
}