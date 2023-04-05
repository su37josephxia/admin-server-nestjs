import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Patch,
    Query,
    Res,
    Scope,
    UseGuards,
    HttpStatus,
    UploadedFile,

} from '@nestjs/common';
import { MenuService } from '../services/menu.service';

import { ApiOperation, ApiTags, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';

import {
    BaseApiErrorResponse, BaseApiResponse, SwaggerBaseApiResponse
} from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto'
import { CreateMenuDto, UpdateMenuDto } from '../dtos/menu.dto';
import { ArticleService } from '../services/article.service';

import * as path from 'path'
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDTO } from '@/user/dtos/upload.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('菜单')
@Controller('menus')
export class MenuController {
    constructor(private readonly menuService: MenuService,
        private readonly articleService: ArticleService) { }

    @ApiOperation({
        summary: '更新菜单',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: SwaggerBaseApiResponse(UpdateMenuDto),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseApiErrorResponse,
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() updateMenuDto: UpdateMenuDto) {
        return {
            data: await this.menuService.update(updateMenuDto),
        }
    }

    @ApiOperation({
        summary: '查找所有菜单',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SwaggerBaseApiResponse([CreateMenuDto]),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseApiErrorResponse,
    })
    @Get()
    async find(
    ) {

        const { data } = await this.menuService.find();
        return {
            data,
        }
    }

    @ApiOperation({
        summary: '文章导入',
    })
    @Post('/article/import')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    async articleImport(@UploadedFile() file,
        @Body() uploadDTO: UploadDTO,) {
        // 执行上传
        this.menuService.import(file)
        return {
            ok: 1
        }
    }




}
