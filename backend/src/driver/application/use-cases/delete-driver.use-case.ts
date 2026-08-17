import { DriverNotFoundError } from "src/driver/domain/errors/driver-not-found.error";
import { DriverRepository } from "src/driver/domain/ports/driver-repository";

export class DeleteDriverUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(id: string): Promise<void> {
    const driver = await this.driverRepository.findById(id);

    if (!driver) {
      throw new DriverNotFoundError();
    }

    await this.driverRepository.delete(id);
  }
}