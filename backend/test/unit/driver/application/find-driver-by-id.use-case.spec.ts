import { FindDriverByIdUseCase } from '@driver/application/use-cases/find-driver-by-id.use-case';
import { DriverNotFoundError } from '@driver/domain/errors/driver-not-found.error';
import { DriverRepository } from '@driver/domain/ports/driver-repository';

describe('Find Driver by id use case', () => {
  let driverRepository: DriverRepository;
  let useCase: FindDriverByIdUseCase;

  beforeEach(() => {
    driverRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      findMany: jest.fn(),
      findByCnhNumber: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindDriverByIdUseCase(driverRepository);
  });

  it('should find a driver by id', async () => {
    const driver = { id: 'driver-id', name: 'John Doe' };
    (driverRepository.findById as jest.Mock).mockResolvedValue(driver);

    const result = await useCase.execute('driver-id');

    expect(driverRepository.findById).toHaveBeenCalledTimes(1);
    expect(driverRepository.findById).toHaveBeenCalledWith('driver-id');
    expect(result).toEqual(driver);
  });

  it('should throw when driver not found', async () => {
    (driverRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute('driver-id')).rejects.toThrow(
      DriverNotFoundError,
    );

    expect(driverRepository.findById).toHaveBeenCalledTimes(1);
    expect(driverRepository.findById).toHaveBeenCalledWith('driver-id');
  });
});