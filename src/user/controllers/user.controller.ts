import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Query, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { UploadDTO } from '../dtos/upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { encryptFileMD5 } from '../../shared/utils/cryptogram.util';

@Controller('user')
@ApiTags('用户管理')
export class UserController {
  constructor(
    private readonly userService: UserService,
    // 注入环境变量
    private readonly configService: ConfigService
  ) { }

  @Post()
  @ApiOperation({
    summary: '新增用户'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserDto
  })
  create(@Body() createUserDto: CreateUserDto) {
    // throw new HttpException('自定义异常冲突', HttpStatus.CONFLICT)

    // console.log('环境变量:', this.configService.get<string>('database.url'))

    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: '查找所有用户',
  })
  @Get()
  async findAll(
    @Query() query: PaginationParamsDto
  ) {
    const { data, count } = await this.userService.findAll(query);
    return {
      data,
      meta: { total: count }
    }
  }

  @ApiOperation({
    summary: '查找单个用户',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.userService.findOne(id)
    }
  }

  @ApiOperation({
    summary: '更新单个用户',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCourseDto: CreateUserDto) {
    return {
      data: await this.userService.update(id, updateCourseDto)
    }
  }

  @ApiOperation({
    summary: '删除单个用户',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Req() req: any,
    @Body() uploadDto: UploadDTO,
    @UploadedFile() file
  ) {
    return this.userService.uploadAvatar(file)
  }


}
