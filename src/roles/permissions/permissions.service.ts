import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../entities';
import { Repository } from 'typeorm';
import { CreatePermissionDto, UpdatePermissionDto } from '../dto';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  create(permissionData: CreatePermissionDto): Promise<Permission> {
    const newPermission = this.permissionRepository.create({
      ...permissionData,
    });

    return this.permissionRepository.save(newPermission);
  }

  findAll(query: PaginateQuery): Promise<Paginated<Permission>> {
    return paginate(query, this.permissionRepository, {
      sortableColumns: ['id', 'action', 'subject'],
      // nullSort: 'last', //postgresql only
      searchableColumns: ['action', 'subject', 'roles.name'],
      defaultSortBy: [['id', 'ASC']],
      filterableColumns: {
        'roles.id': [FilterOperator.EQ],
        'roles.name': [FilterOperator.EQ, FilterOperator.ILIKE],
      },
      relations: ['roles'],
      maxLimit: 100,
    });
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.findOne(id);
    return this.permissionRepository.save({
      ...permission,
      ...updatePermissionDto,
    });
  }

  findOne(id: number) {
    return this.permissionRepository.findOne({
      where: {
        id,
      },
    });
  }

  count() {
    return this.permissionRepository.count();
  }
}
