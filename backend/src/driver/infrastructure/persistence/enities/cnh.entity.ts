import { DriverEntity } from './driver.entity';
import { CnhRestrictions } from '../../../domain/enums/cnh-restrictions';
import { CnhStatus } from '../../../domain/enums/cnh-status';
import { CnhCategories } from '../../../domain/enums/cnh-category';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cnhs')
export class CnhEntity {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => DriverEntity, driver => driver.cnh)
  driver: DriverEntity;

  @Column({ unique: true })
  number: string;

  @Column({ name: 'issue_date', type: 'date' })
  issueDate: Date;

  @Column({ name: 'expiry_date', type: 'date' })
  expiryDate: Date;

  @Column({ name: 'categories', type: 'json', default: [] })
  categories: CnhCategories[];

  @Column({ name: 'restrictions', type: 'json', default: [] })
  restrictions: CnhRestrictions[];

  @Column({
    name: 'status',
    type: 'enum',
    enum: CnhStatus,
    default: CnhStatus.ACTIVE,
  })
  status: CnhStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
