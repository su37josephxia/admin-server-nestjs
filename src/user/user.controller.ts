import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SystemService } from '../shared/services/system.service';

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
