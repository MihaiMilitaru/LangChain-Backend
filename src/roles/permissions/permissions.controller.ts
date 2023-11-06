import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CheckPolicies } from '../../ability/decorator';
import { Action } from '../type';
import { PermissionsService } from './permissions.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Serialize } from '../../interceptor';
import { PermissionTransformer } from '../transformer';
import { CreatePermissionRequestDto } from '../dto/create-permission-request.dto';
import { UpdatePermissionRequestDto } from '../dto/update-permission-request.dto';
import { ApiOkResponsePaginated } from '../../types';

@ApiTags('admin')
@ApiBearerAuth('Access Token')
@Serialize(PermissionTransformer)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}
  @CheckPolicies((ability) => ability.can(Action.Create, 'Permission'))
  @ApiResponse({
    type: PermissionTransformer,
  })
  @Post()
  create(@Body() createPermissionDto: CreatePermissionRequestDto) {
    return this.permissionsService.create({
      ...createPermissionDto,
      roles: null,
    });
  }

  @CheckPolicies((ability) => ability.can(Action.Read, 'Permission'))
  @ApiOkResponsePaginated(PermissionTransformer)
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.permissionsService.findAll(query);
  }

  @CheckPolicies((ability) => ability.can(Action.Read, 'Permission'))
  @ApiResponse({
    type: PermissionTransformer,
  })
  @Get(':id')
  findOne(@Param(':id') id: number) {
    return this.permissionsService.findOne(id);
  }

  @CheckPolicies((ability) => ability.can(Action.Update, 'Permission'))
  @ApiResponse({
    type: PermissionTransformer,
  })
  @Patch(':id')
  update(
    @Param(':id') id: number,
    @Body() updatePermissionDto: UpdatePermissionRequestDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }
}
