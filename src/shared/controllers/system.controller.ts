import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { spawnSync } from "child_process";
import * as moment from "moment";
import { BackupDto } from "../dtos/backup.dto";

@ApiTags('系统维护')
@Controller('system')
export class SystemController {
    constructor() {

    }

    @ApiOperation({
        description: '数据库备份列表'
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get('/database')
    async list() {
        // docker-compose exec -T mongo ls /dump
        const ret = await this.spawn('docker-compose', ['exec', '-T', 'mongo', 'ls', '/dump'], { cwd: './' })
        const data = ("" + ret).split('\n')
        data.pop()
        return {
            ok: 1,
            data
        }

    }


    @ApiOperation({
        summary: '数据库备份',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('/database/dump')
    async dump(@Body() data) {
        const ret = await this.spawn('docker-compose', ['exec', '-T', 'mongo', 'mongodump', '--db', 'nest-server', '--out', '/dump/' + moment().format('YYYYMMDDhhmmss')], { cwd: './' })
        return {
            ok: 1
        }
    }


    @ApiOperation({
        summary: '数据库恢复',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('/database/restore')
    async restore(@Body() dto: BackupDto) {
        console.log('恢复数据', dto.file)
        const ret = await this.spawn('docker-compose', ['exec', '-T', 'mongo', 'mongorestore', '--db', 'nest-server', `/dump/${dto.file}/nest-server`], { cwd: './' })

        return {
            ok: 1
        }
    }


    async spawn(...args) {
        const { spawn } = require('child_process');
        return new Promise(resolve => {
            const proc = spawn(...args)
            // proc.on('data', data => {
            //     console.log('>:' + data.toString())
            // })

            proc.stdout.pipe(process.stdout)
            proc.stderr.pipe(process.stderr)
            let ret = ''
            proc.stdout.on('data', data => {
                ret += data.toString()
            })
            proc.on('close', () => {
                resolve(ret)
            })
        })
    }

    getTime() {
        //转毫秒
        var n = new Date();
        return n.getFullYear() + (n.getMonth() + 1) + n.getDate() + n.getHours() + n.getMinutes() + n.getSeconds();
    }
}