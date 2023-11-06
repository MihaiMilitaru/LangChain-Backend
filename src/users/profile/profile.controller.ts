import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Header,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  StreamableFile,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PublicRoute, RequestUser } from '../../auth/decorator';
import { User } from '../entities';
import { UsersService } from '../users.service';
import {
  DeleteOwnAccountDto,
  UpdateProfileDto,
  UpdateProfilePasswordDto,
} from '../dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { Serialize } from '../../interceptor';
import { UserTransformer, UserWithoutRoleTransformer } from '../transformer';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UserSecurityService } from '../user-security.service';
import { constants } from 'http2';

@ApiBearerAuth('Access Token')
@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userSecurityService: UserSecurityService,
  ) {}

  @Get()
  @Serialize(UserTransformer)
  @ApiOkResponse({
    description: 'User profile info',
    type: [UserTransformer],
    schema: {
      $ref: getSchemaPath(UserTransformer),
    },
  })
  userProfile(@RequestUser() user: User): User {
    return user;
  }

  @Patch()
  @Serialize(UserWithoutRoleTransformer)
  @ApiOkResponse({
    description: 'User profile info',
    type: [UserWithoutRoleTransformer],
    schema: {
      $ref: getSchemaPath(UserWithoutRoleTransformer),
    },
  })
  async updateUserProfile(
    @RequestUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.update(user.id, updateProfileDto);
  }

  @PublicRoute()
  @ApiResponse({
    description: 'Requested profile picture',
  })
  @Get('photo/:profilePhoto')
  @Header('Content-Type', '*/*')
  @Header('Content-Disposition', 'inline')
  userProfilePhoto(@Param('profilePhoto') profilePhoto: string) {
    const filePath = join(process.cwd(), `storage/avatars/${profilePhoto}`);

    if (fs.existsSync(filePath)) {
      const file = createReadStream(filePath);
      return new StreamableFile(file);
    }

    throw new NotFoundException('Not found');
  }

  @Post('photo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profilePhoto: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['profilePhoto'],
    },
  })
  @UseInterceptors(
    FileInterceptor('profilePhoto', {
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
      storage: diskStorage({
        destination: 'storage/avatars',
        filename: (req, file, callback) => {
          const ext: string = path.extname(file.originalname);
          const filename: string = uuidv4();

          callback(null, `${filename}${ext}`);
        },
      }),
    }),
  )
  @Serialize(UserWithoutRoleTransformer)
  @ApiCreatedResponse({
    description: 'Profile picture uploaded',
    type: [UserWithoutRoleTransformer],
    schema: {
      $ref: getSchemaPath(UserWithoutRoleTransformer),
    },
  })
  async uploadUserProfilePhoto(
    @RequestUser() user: User,
    @UploadedFile()
    profilePhoto: Express.Multer.File,
  ) {
    if (!profilePhoto) {
      throw new BadRequestException('Profile photo must be provided');
    }
    const { fileTypeFromFile } = await (eval('import("file-type")') as Promise<
      typeof import('file-type')
    >);

    const meta = await fileTypeFromFile(profilePhoto.path);
    if (
      !meta ||
      !['image/gif', 'image/png', 'image/jpeg', 'image/jpg'].includes(meta.mime)
    ) {
      await fs.unlink(profilePhoto.path, (err) => console.log(err));
      throw new UnprocessableEntityException('File type not allowed');
    }

    return this.usersService.update(user.id, {
      profilePhoto: profilePhoto.filename,
    });
  }

  @Delete('photo')
  @Serialize(UserWithoutRoleTransformer)
  @ApiOkResponse({
    description: 'User profile picture removed',
    type: [UserWithoutRoleTransformer],
    schema: {
      $ref: getSchemaPath(UserWithoutRoleTransformer),
    },
  })
  async deleteUserProfilePhoto(@RequestUser() user: User) {
    fs.unlink('storage/avatars/' + user.profilePhoto, (err) =>
      console.log(err),
    );

    return this.usersService.update(user.id, {
      profilePhoto: null,
    });
  }

  @Patch('password')
  @Serialize(UserWithoutRoleTransformer)
  @ApiOkResponse({
    description: 'User profile info',
    type: [UserWithoutRoleTransformer],
    schema: {
      $ref: getSchemaPath(UserWithoutRoleTransformer),
    },
  })
  async updateUserProfilePassword(
    @RequestUser() user: User,
    @Body() data: UpdateProfilePasswordDto,
  ) {
    if (
      !(await this.userSecurityService.validateSecret(
        data.currentPassword,
        user.password,
      ))
    ) {
      throw new ForbiddenException();
    }

    return this.usersService.update(user.id, {
      password: data.newPassword,
    });
  }

  @Post('delete')
  @ApiNoContentResponse()
  @HttpCode(constants.HTTP_STATUS_NO_CONTENT)
  async deleteOwnAccount(
    @RequestUser() user: User,
    @Body() data: DeleteOwnAccountDto,
  ) {
    if (
      !(await this.userSecurityService.validateSecret(
        data.currentPassword,
        user.password,
      ))
    ) {
      throw new ForbiddenException();
    }

    await this.usersService.remove(user.id);
  }
}
