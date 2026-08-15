import { DriverRepository } from 'src/driver/domain/ports/driver-repository'
import { UpdateDriverInput } from '../dto/update-driver.input'
import { Driver } from 'src/driver/domain/entities/driver'

export class UpdateDriverUseCase {
  constructor(private readonly repository: DriverRepository) {}

  async execute(id: string, input: UpdateDriverInput): Promise<Driver> {
    const driver = await this.repository.findById(id)

    if (!driver) {
      throw new Error('Driver not found')
    }

    driver.update(input)
    await this.repository.save(driver)
    return driver
  }
}