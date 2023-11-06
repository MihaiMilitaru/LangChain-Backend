import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  GoogleAuthGuard,
  LocalAuthGuard,
  JwtRtAuthGuard,
  JwtUserOpsAuthGuard,
} from './guard';
import { PublicRoute, RequestUser } from './decorator';
import { User } from '../users/entities';
import { constants } from 'http2';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  InvitedUserRequestDto,
  InvitedUserDto,
  LoginDto,
  PasswordResetDto,
  PasswordResetRequestDto,
} from './dto';
import { CreateUserDto, UserTokens } from '../users/dto';
import { USER_OPS_TOKEN_TYPE_PASSWORD_RESET } from '../users/user-security.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post('accept-invite')
  @UseGuards(JwtUserOpsAuthGuard)
  @ApiResponse({
    type: UserTokens,
  })
  register(
    @RequestUser() user: InvitedUserDto,
    @Body() data: InvitedUserRequestDto,
  ): Promise<UserTokens> {
    const userData: CreateUserDto = {
      name: data.name,
      email: user.email,
      password: data.password,
      isActive: true,
    };
    return this.authService.register(userData);
  }

  @PublicRoute()
  @Get('google-login')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@RequestUser() user: User) {
    return this.authService.login(user.id);
  }

  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    type: UserTokens,
  })
  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@RequestUser() user: User): Promise<UserTokens> {
    return this.authService.login(user.id);
  }

  @ApiBearerAuth('Access Token')
  @Post('logout')
  @HttpCode(constants.HTTP_STATUS_NO_CONTENT)
  async logout(@RequestUser() user: User) {
    await this.authService.logout(user.id);
  }

  @ApiBearerAuth('Refresh Token')
  @ApiResponse({
    type: UserTokens,
  })
  @PublicRoute()
  @UseGuards(JwtRtAuthGuard)
  @Post('refresh')
  refreshToken(@RequestUser() user: User): Promise<UserTokens> {
    return this.authService.login(user.id);
  }

  @HttpCode(constants.HTTP_STATUS_NO_CONTENT)
  @PublicRoute()
  @Post('password-reset-request')
  async passwordResetRequest(@Body() data: PasswordResetRequestDto) {
    await this.authService.passwordResetRequest(data);
  }

  @PublicRoute()
  @Post('password-reset')
  @UseGuards(JwtUserOpsAuthGuard)
  @ApiResponse({
    type: UserTokens,
  })
  async passwordReset(
    @RequestUser() user: User & { tokenType: number },
    @Body() data: PasswordResetDto,
  ): Promise<UserTokens> {
    const { tokenType, ...userData } = user;

    if (tokenType !== USER_OPS_TOKEN_TYPE_PASSWORD_RESET) {
      throw new UnauthorizedException();
    }
    await this.authService.passwordReset(userData, data);
    return this.authService.login(user.id);
  }
}
