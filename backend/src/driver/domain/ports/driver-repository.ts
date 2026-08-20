import { Driver } from '../entities/driver';
import { CnhCategories } from '../enums/cnh-category';

export abstract class DriverRepository {
  abstract save(driver: Driver): Promise<Driver>;

  abstract findMany(filters?: DriverSearchFilters): Promise<Driver[]>;

  abstract findById(id: string): Promise<Driver | null>;

  abstract findByCnhNumber(cnhNumber: string): Promise<Driver | null>;

  abstract delete(id: string): Promise<void>;
}

export interface DriverSearchFilters {
  name?: string;
  cnhCategories?: CnhCategories[];
}
