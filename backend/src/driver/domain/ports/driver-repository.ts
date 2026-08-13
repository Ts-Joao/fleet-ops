import { Driver } from "../entities/driver";

export interface DriverRepository {
  save(driver: Driver): Promise<void>
  findById(id: string): Promise<Driver | null>
}