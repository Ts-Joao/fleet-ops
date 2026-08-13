import { Driver } from "../entities/driver";

export interface DriverRepository {
  save(driver: Driver): Promise<Driver>
  findById(id: string): Promise<Driver | null>
}