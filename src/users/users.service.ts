import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, InviteUserDto, UpdateUserDto } from './dto';
import { User } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import {
  USER_OPS_TOKEN_TYPE_INVITE,
  UserSecurityService,
} from './user-security.service';
import { MailService } from '../mail/mail.service';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Role } from '../roles/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private userSecurityService: UserSecurityService,
    private mailService: MailService,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const existingUser = await this.findOneByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException(
        'User with that email already exists.',
        'Bad Request',
      );
    }

    if (data?.roleId) {
      const role = await this.roleRepository.findOne({
        where: { id: data.roleId },
      });

      if (!role) {
        throw new BadRequestException('Role not found', 'Bad request');
      }

      data.role = role;
    }
    delete data.roleId;

    // Hash the user's password before saving it
    const hashedPassword = await this.userSecurityService.hashSecret(
        data.password,
    );


    const newUser = this.userRepository.create({
      ...data,
      password: hashedPassword,
      email: data.email.toLowerCase().trim(),
    });


    return this.userRepository.save(newUser);
  }

  findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepository, {
      sortableColumns: ['id', 'name', 'email', 'isActive'],
      // nullSort: 'last', //postgresql only
      searchableColumns: ['name', 'email'],
      defaultSortBy: [['id', 'ASC']],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterOperator.ILIKE],
        email: [FilterOperator.EQ, FilterOperator.ILIKE],
      },
      maxLimit: 50,
      relations: ['role'],
    });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({
      email: email.toLowerCase().trim(),
    });
  }

  findOne(id?: number): Promise<User> {
    return this.userRepository.findOneBy({
      id,
    });
  }

  findOneWithOptions(
    where: FindOptionsWhere<User>,
    options: FindOneOptions<User>,
  ) {
    return this.userRepository.findOne({
      where,
      ...options,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneWithOptions(
      { id },
      {
        relations: ['role'],
      },
    );

    if (updateUserDto?.roleId && user?.role?.id !== updateUserDto?.roleId) {
      const role = await this.roleRepository.findOne({
        where: { id: updateUserDto.roleId },
      });

      if (!role) {
        throw new BadRequestException('Role not found', 'Bad request');
      }

      user.role = role;
    }
    delete updateUserDto.roleId;

    if (updateUserDto.password) {
      updateUserDto.password = await this.userSecurityService.hashSecret(
        updateUserDto.password,
      );
    }

    if (updateUserDto.email) {
      updateUserDto.email = updateUserDto.email.toLowerCase().trim();
    }

    return this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.softRemove(user);
  }

  count() {
    return this.userRepository.count();
  }

  async invite(data: InviteUserDto) {
    const existingUser = await this.findOneByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException(
        'User with that email already exists.',
        'Bad Request',
      );
    }

    const inviteToken = this.userSecurityService.generateUserOpsToken(
      {
        sub: data.email,
        type: USER_OPS_TOKEN_TYPE_INVITE,
      },
      'invite',
    );

    await this.mailService.sendUserInvite(
      data.email,
      data.signupUrl.replace('$TOKEN$', inviteToken),
    );
  }
}
