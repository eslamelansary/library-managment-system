import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Entities } from '../utils/permissions';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'json', nullable: false })
  permissions: Permissions;
}

export type Permissions = {
  [value in keyof typeof Entities]?: string[];
};

