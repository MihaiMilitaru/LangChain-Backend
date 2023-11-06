import { Controller, Get, Body, Patch, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckPolicies } from '../ability/decorator';
import { Action } from './type';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Serialize } from '../interceptor';
import {
  RoleTransformer,
  RoleWithoutPermissionTransformer,
} from './transformer';
import { ApiOkResponsePaginated } from '../types';

@ApiTags('admin')
@ApiBearerAuth('Access Token')
@Serialize(RoleTransformer)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @CheckPolicies((ability) => ability.can(Action.Create, 'Role'))
  @ApiResponse({
    type: RoleWithoutPermissionTransformer,
  })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @CheckPolicies((ability) => ability.can(Action.Read, 'Role'))
  @ApiOkResponsePaginated(RoleTransformer)
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.rolesService.findAll(query);
  }

  @CheckPolicies((ability) => ability.can(Action.Read, 'Role'))
  @ApiResponse({
    type: RoleTransformer,
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rolesService.findOne(id);
  }

  @CheckPolicies((ability) => ability.can(Action.Update, 'Role'))
  @ApiResponse({
    type: RoleWithoutPermissionTransformer,
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }
}
