import { CnhEntity } from './cnh.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('drivers')
export class DriverEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @OneToOne(() => CnhEntity, cnh => cnh.driver, {
    cascade: true,
    eager: true
  })
  @JoinColumn({ name: 'cnh_id' })
  cnh: CnhEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
