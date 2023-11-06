import { Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities';
import { Repository } from 'typeorm';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    const newRole = this.roleRepository.create({ ...createRoleDto });

    return this.roleRepository.save(newRole);
  }

  findAll(query: PaginateQuery): Promise<Paginated<Role>> {
    return paginate(query, this.roleRepository, {
      sortableColumns: ['id', 'name'],
      // nullSort: 'last', //postgresql only
      searchableColumns: ['name'],
      defaultSortBy: [['id', 'ASC']],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterOperator.ILIKE],
      },
      relations: ['permissions'],
      maxLimit: 100,
    });
  }

  findOne(id: number) {
    return this.roleRepository.findOne({
      where: {
        id,
      },
      relations: ['permissions'],
    });
  }

  fineOneByName(name: string) {
    return this.roleRepository.findOne({
      where: {
        name,
      },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    return this.roleRepository.save({ ...role, ...updateRoleDto });
  }

  count() {
    return this.roleRepository.count();
  }
}
