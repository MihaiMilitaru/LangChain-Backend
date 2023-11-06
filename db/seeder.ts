import { Injectable } from '@nestjs/common';
import { UsersService } from '../src/users/users.service';
import { CreateUserDto } from '../src/users/dto';
import { RolesService } from '../src/roles/roles.service';
import { CreateRoleDto, CreatePermissionDto } from '../src/roles/dto';
import { PermissionsService } from '../src/roles/permissions/permissions.service';
import { Action } from '../src/roles/type';
// import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class Seeder {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async run() {
    console.log(`Start seeding...`);

    if (!(await this.rolesService.count())) {
      const defaultRoles: Array<CreateRoleDto> = [
        {
          name: 'Super Admin',
        },
        {
          name: 'Admin',
        },
        {
          name: 'User',
        },
      ];

      for (const roleData of defaultRoles) {
        await this.rolesService.create(roleData);
      }
    }

    const superAdminRole = await this.rolesService.fineOneByName('Super Admin');
    const adminRole = await this.rolesService.fineOneByName('Admin');
    const userRole = await this.rolesService.fineOneByName('User');

    if (!(await this.permissionsService.count())) {
      const defaultPermissions: Array<CreatePermissionDto> = [
        {
          action: Action.Manage,
          subject: 'all',
          roles: [superAdminRole],
        },
        {
          action: Action.Manage,
          subject: 'User',
          roles: [adminRole],
        },
        // TODO implement a way for the builder to handle dynamic conditions
        // {
        //   action: Action.Update,
        //   subject: 'User',
        //   fields: ['name', 'email', 'password'],
        //   conditions: {
        //     id: '$user$.id',
        //   },
        //   roles: [adminRole, userRole],
        // },
        {
          action: Action.Read,
          subject: 'Role',
          roles: [adminRole],
        },
        {
          action: Action.Read,
          subject: 'Permission',
          roles: [adminRole],
        },
        {
          action: Action.Manage,
          subject: 'Chapter',
          roles: [adminRole],
        },
        {
          action: Action.Manage,
          subject: 'Document',
          roles: [adminRole],
        },
        {
          action: Action.Read,
          subject: 'Chapter FE',
          roles: [adminRole],
        },
        {
          action: Action.Read,
          subject: 'Chapter BE',
          roles: [adminRole],
        },
        {
          action: Action.Read,
          subject: 'Chapter PM',
          roles: [adminRole],
        },
      ];

      for (const permissionData of defaultPermissions) {
        await this.permissionsService.create(permissionData);
      }
    }

    if (!(await this.usersService.count())) {
      const defaultUsers: Array<CreateUserDto> = [
        {
          name: 'Admin',
          email: 'admin@beecoded.ro',
          password: 'parolaadmin2022',
          isActive: true,
          role: superAdminRole,
        },
      ];

      // Generate random test user

      // for (let i = 0; i < 200; i++) {
      //   defaultUsers.push({
      //     name: randomStringGenerator(),
      //     email: `test${i}@example.com`,
      //     password: 'P@ssw0rd!',
      //     isActive: !!Math.floor(Math.random() * 1),
      //     role: !!Math.floor(Math.random() * 1) ? adminRole : userRole,
      //   });
      // }

      for (const userData of defaultUsers) {
        await this.usersService.create(userData);
      }
    }

    console.log(`Finished seeding...`);
  }
}
