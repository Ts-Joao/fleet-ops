import { CnhCategories } from '@driver/domain/enums/cnh-category';
import { CnhStatus } from '@driver/domain/enums/cnh-status';
import { DriverRepository } from '@driver/domain/ports/driver-repository';
import { RegisterDriverUseCase } from '@driver/application/use-cases/register-driver.use-case';
import { IdGenerator } from '@shared/application/ports/id-generator.port';
import { CnhAlreadyExistsError } from '@driver/domain/errors/cnh-already-exist.error';
import { InvalidDriverError } from '@driver/domain/errors/invalid-driver.error';

describe('Register Driver use case', () => {
  let driverRepository: DriverRepository;
  let idGenerator: IdGenerator;
  let useCase: RegisterDriverUseCase;

  const input = {
    name: 'John Doe',
    birthDate: new Date('1990-01-01'),
    cnh: {
      number: '12345678901',
      issueDate: new Date('2020-01-01'),
      expiryDate: new Date('2030-01-01'),
      categories: [CnhCategories.B],
      restrictions: [],
      status: CnhStatus.ACTIVE,
    },
  };

  beforeEach(() => {
    driverRepository = {
      findByCnhNumber: jest.fn(),
      save: jest.fn(),
      findMany: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    idGenerator = {
      generate: jest.fn().mockReturnValue('driver-id'),
    };

    useCase = new RegisterDriverUseCase(driverRepository, idGenerator);
  });

  it('should register a driver', async () => {
    await useCase.execute(input);

    expect(driverRepository.save).toHaveBeenCalledTimes(1);
    expect(idGenerator.generate).toHaveBeenCalledTimes(1);
  });

  it('should throw when CNH already exists', async () => {
    (driverRepository.findByCnhNumber as jest.Mock).mockResolvedValue({});
    await expect(useCase.execute(input)).rejects.toThrow(CnhAlreadyExistsError);

    expect(driverRepository.save).toHaveBeenCalledTimes(0);
    expect(idGenerator.generate).toHaveBeenCalledTimes(0);
  });

  it('should propagate domain validation errors', async () => {
    await expect(
      useCase.execute({
        ...input,
        birthDate: new Date(),
      }),
    ).rejects.toThrow(InvalidDriverError);
  });
});
