import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])], 
  providers: [PermissionsService],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
