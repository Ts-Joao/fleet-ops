import { Driver } from '../entities/driver';

export abstract class DriverRepository {
  abstract save(driver: Driver): Promise<Driver>;
  abstract findById(id: string): Promise<Driver | null>;
}
