import {IsArray, IsNotEmpty, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Permission} from "../entities";

export class CreateRoleDto {
  @ApiProperty({
    description: "Role's name",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  permissions?: Permission[];
}
