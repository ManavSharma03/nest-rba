import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsEnum,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { UserRoles } from '../../../common/types';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (min 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    example: 'user',
    description: 'User role (admin/user)',
    default: 'user',
  })
  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'admin',
    description: 'User role (admin/editor/viewer/user)',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles;
}
