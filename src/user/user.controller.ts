import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserDTO } from 'src/libs/dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('fetchall')
  async fetchAllUsers(
    @Query('roleId', new ParseIntPipe({ optional: true })) roleId?: number,
  ) {
    let filters = {
      isDeleted: false,
    };

    if (roleId) {
      filters['userRole'] = {
        roleId: roleId,
      };
    }

    return await this.userService.fetchAllUsers(filters);
  }

  @Post('create')
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    return await this.userService.createUser(createUserDTO);
  }

  @Patch('update/:userId')
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    return await this.userService.updateUser(updateUserDTO, userId);
  }

  @Delete('delete')
  async deleteUser(@Query('selectedIds') selectedIds: any) {
    const parsed = selectedIds.split(',').map(Number);
    return await this.userService.deleteUser(parsed);
  }
}
