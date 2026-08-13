import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { CnhStatus } from 'src/driver/domain/enums/cnh-status';
import { CnhCategories } from 'src/driver/domain/enums/cnh-category';
import { CnhRestrictions } from 'src/driver/domain/enums/cnh-restrictions';

@Entity('drivers')
export class DriverEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ name: 'cnh_number' })
  cnhNumber: string;

  @Column({ name: 'cnh_issue_date', type: 'date' })
  cnhIssueDate: Date;

  @Column({ name: 'cnh_expiry_date', type: 'date' })
  cnhExpiryDate: Date;

  @Column({ name: 'cnh_categories', type: 'json', default: [] })
  cnhCategories: CnhCategories[];

  @Column({ name: 'cnh_restrictions', type: 'json', default: [] })
  cnhRestrictions: CnhRestrictions[];

  @Column({
    name: 'cnh_status',
    type: 'enum',
    enum: CnhStatus,
    default: CnhStatus.ACTIVE,
  })
  cnhStatus: CnhStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
