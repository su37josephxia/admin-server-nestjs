import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('用户管理')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({
    summary: '新增用户'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserDto
  })
  create(@Body() createUserDto: CreateUserDto) {
    throw new HttpException('自定义异常冲突', HttpStatus.CONFLICT)

    return this.userService.create(createUserDto);
  }

  // GET : 
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // /user/123
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
