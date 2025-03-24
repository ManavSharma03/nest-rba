import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoles } from '../../../common/types';
import { Permission } from '../../../modules/permissions/entity/permission.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.user })
  role: UserRoles;

  @Column({ nullable: true })
  refreshToken?: string; // Store hashed refresh token for security

  @OneToMany(() => Permission, (permission) => permission.user)
  permissions?: Permission[];
}
