import { DriverNotFoundError } from '@driver/domain/errors/driver-not-found.error';
import { DriverRepository } from '@driver/domain/ports/driver-repository';
import { FindDriverByCnhNumberUseCase } from '@driver/application/use-cases/find-driver-by-cnh-number.use-case';

describe('Find Driver by CNH number use case', () => {
  let driverRepository: DriverRepository;
  let useCase: FindDriverByCnhNumberUseCase;

  beforeEach(() => {
    driverRepository = {
      findByCnhNumber: jest.fn(),
      save: jest.fn(),
      findMany: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindDriverByCnhNumberUseCase(driverRepository);
  });

  it('should find a driver by CNH number', async () => {
    const driver = { id: 'driver-id', cnh: { number: '12345678901' } };
    (driverRepository.findByCnhNumber as jest.Mock).mockResolvedValue(driver);

    const result = await useCase.execute('12345678901');

    expect(driverRepository.findByCnhNumber).toHaveBeenCalledTimes(1);
    expect(driverRepository.findByCnhNumber).toHaveBeenCalledWith('12345678901');
    expect(result).toEqual(driver);
  });

  it('should throw when driver not found', async () => {
    (driverRepository.findByCnhNumber as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute('12345678901')).rejects.toThrow(
      DriverNotFoundError,
    );

    expect(driverRepository.findByCnhNumber).toHaveBeenCalledTimes(1);
    expect(driverRepository.findByCnhNumber).toHaveBeenCalledWith('12345678901');
  });
});