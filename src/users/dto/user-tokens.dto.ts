import { ApiProperty } from '@nestjs/swagger';

export class UserTokens {
  @ApiProperty({
    description: 'Bearer token for normal api access',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Bearer token for refreshing api access tokens',
  })
  refreshToken: string;
}
