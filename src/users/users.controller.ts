import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { InviteUserDto, UserPaginateQueryDto } from './dto';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckPolicies } from '../ability/decorator';
import { Action } from '../roles/type';
import { User } from './entities';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Serialize } from '../interceptor';
import {
  UserTransformer,
  UserWithoutRolePermissionTransformer,
  UserWithoutRoleTransformer,
} from './transformer';
import { RequestUser } from '../auth/decorator';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { ApiOkResponsePaginated } from '../types';

@ApiTags('admin')
@ApiBearerAuth('Access Token')
@Serialize(UserTransformer)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @CheckPolicies((ability) => ability.can(Action.Create, 'User'))
  @Post('/invite')
  invite(@Body() inviteUserDto: InviteUserDto) {
    return this.usersService.invite(inviteUserDto);
  }

  @CheckPolicies((ability) => ability.can(Action.Create, 'User'))
  @Post()
  @ApiResponse({
    type: UserWithoutRolePermissionTransformer,
  })
  create(@Body() createUserRequestDto: CreateUserRequestDto): Promise<User> {
    return this.usersService.create(createUserRequestDto);
  }

  @CheckPolicies((ability) => ability.can(Action.Read, 'User'))
  @ApiQuery({
    type: UserPaginateQueryDto,
  })
  @ApiOkResponsePaginated(UserWithoutRolePermissionTransformer)
  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return this.usersService.findAll(query);
  }

  @CheckPolicies((ability) => ability.can(Action.Read, 'User'))
  @ApiResponse({
    type: UserWithoutRolePermissionTransformer,
  })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOneWithOptions(
      { id },
      { relations: ['role'] },
    );
  }

  @CheckPolicies((ability) => ability.can(Action.Update, 'User'))
  @ApiResponse({
    type: UserWithoutRolePermissionTransformer,
  })
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserRequestDto: UpdateUserRequestDto,
    @RequestUser() currentUser: User,
  ): Promise<User> {
    if (currentUser.id === id) {
      updateUserRequestDto = {
        name: updateUserRequestDto.name,
        email: updateUserRequestDto.email,
      };
    }

    return this.usersService.update(id, updateUserRequestDto);
  }

  @CheckPolicies((ability) => ability.can(Action.Delete, 'User'))
  @ApiResponse({
    type: UserWithoutRoleTransformer,
  })
  @Delete(':id')
  remove(@Param('id') id: number, @RequestUser() user: User) {
    if (user.id == id) {
      throw new ForbiddenException('Cannot delete yourself');
    }
    return this.usersService.remove(id);
  }
}
