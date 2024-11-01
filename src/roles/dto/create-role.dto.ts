import { Permissions } from '../entities/role.entity';
import { IsNotEmpty, IsObject, IsString, MaxLength } from 'class-validator';
import { IsValidPermission } from '../utils/is-valid-permission.decorator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsObject()
  @IsValidPermission()
  permissions: Permissions;
}
