import { DriverRepository } from '@driver/domain/ports/driver-repository';
import { DeleteDriverUseCase } from '@driver/application/use-cases/delete-driver.use-case';
import { CnhCategories } from '@driver/domain/enums/cnh-category';
import { Cnh } from '@driver/domain/value-object/cnh';
import { CnhStatus } from '@driver/domain/enums/cnh-status';
import { Driver } from '@driver/domain/entities/driver';
import { DriverNotFoundError } from '@driver/domain/errors/driver-not-found.error';

describe('Delete Driver use case', () => {
  let driverRepository: DriverRepository;
  let useCase: DeleteDriverUseCase;

  const createMockCnh = (
    cnhNumber: string,
    categories: CnhCategories[],
  ): Cnh => {
    return Cnh.create(
      cnhNumber,
      new Date(new Date().getFullYear() - 5),
      new Date(new Date().getFullYear() - 1),
      categories,
      [],
      CnhStatus.ACTIVE,
    );
  };

  const createMockDriver = (
    id: string,
    name: string,
    cnhNumber: string,
    cnhCategories: CnhCategories[] = [],
  ): Driver => {
    return Driver.create(
      id,
      name,
      new Date('1990-01-01'),
      createMockCnh(cnhNumber, cnhCategories),
    );
  };

  const makeMockDrivers = (): Driver[] => [
    createMockDriver('1', 'João Silva', '12345678900', [
      CnhCategories.A,
      CnhCategories.B,
    ]),
    createMockDriver('2', 'Maria Santos', '12345678901', [CnhCategories.D]),
  ];

  beforeEach(() => {
    driverRepository = {
      delete: jest.fn(),
      save: jest.fn(),
      findMany: jest.fn(),
      findById: jest.fn(),
      findByCnhNumber: jest.fn(),
    };

    useCase = new DeleteDriverUseCase(driverRepository);
  });

  it('should delete a driver', async () => {
    const driverId = '1';

    jest.spyOn(driverRepository, 'findById').mockResolvedValue(makeMockDrivers()[0]);
    jest.spyOn(driverRepository, 'delete').mockResolvedValue();

    await useCase.execute(driverId);

    expect(driverRepository.delete).toHaveBeenCalledTimes(1);
    expect(driverRepository.delete).toHaveBeenCalledWith(driverId);
  });

  it('should throw when driver does not exist', async () => {
    const driverId = '1';

    jest.spyOn(driverRepository, 'findById').mockResolvedValue(null);
    jest.spyOn(driverRepository, 'delete').mockResolvedValue();

    await expect(useCase.execute(driverId)).rejects.toThrow(DriverNotFoundError);

    expect(driverRepository.findById).toHaveBeenCalledWith(driverId);
    expect(driverRepository.delete).not.toHaveBeenCalled();
  });
});
