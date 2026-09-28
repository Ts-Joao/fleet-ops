import { DriverRepository, DriverSearchFilters } from '@driver/domain/ports/driver-repository';
import { SearchDriversUseCase } from '@driver/application/use-cases/search-drivers.use-case';
import { Driver } from '@driver/domain/entities/driver';
import { Cnh } from '@driver/domain/value-object/cnh';
import { CnhCategories } from '@driver/domain/enums/cnh-category';
import { CnhStatus } from '@driver/domain/enums/cnh-status';

describe('Search Driver use case', () => {
  let driverRepository: DriverRepository;
  let useCase: SearchDriversUseCase;
  
  const createMockCnh = (cnhNumber: string, categories: CnhCategories[]): Cnh => {
    return Cnh.create(
      cnhNumber,
      new Date(new Date().getFullYear() - 5),
      new Date(new Date().getFullYear() - 1),
      categories,
      [],
      CnhStatus.ACTIVE,
    );
  };

  const createMockDriver = (name: string, cnhNumber: string, cnhCategories: CnhCategories[] = []): Driver => {
    return Driver.create(
      '1',
      name,
      new Date('1990-01-01'),
      createMockCnh(cnhNumber, cnhCategories),
    );
  };

  const makeMockDrivers = (): Driver[] => [
    createMockDriver('João Silva', '12345678900', [CnhCategories.A, CnhCategories.B]),
    createMockDriver('Maria Santos', '12345678901', [CnhCategories.D]),
  ];

  beforeEach(() => {
    driverRepository = {
      findMany: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByCnhNumber: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new SearchDriversUseCase(driverRepository);

    jest.spyOn(driverRepository, 'findMany').mockResolvedValue(makeMockDrivers());
  });

  it('should return matching drivers', async () => {
    const drivers = await useCase.execute({});

    expect(driverRepository.findMany).toHaveBeenCalledTimes(1);
    expect(driverRepository.findMany).toHaveBeenCalledWith({});
    expect(drivers).toEqual(makeMockDrivers());
  });

  it('should return an empty list when no driver matches', async () => {
    const input: DriverSearchFilters = { name: 'Nonexistent driver' };
    jest.spyOn(driverRepository, 'findMany').mockResolvedValue([]);

    const drivers = await useCase.execute(input);

    expect(driverRepository.findMany).toHaveBeenCalledTimes(1);
    expect(driverRepository.findMany).toHaveBeenCalledWith(input);
    expect(drivers).toEqual([]);
  });

  it('should apply the provided filters', async () => {
    const drivers = await useCase.execute({name: 'João Silva', cnhCategories: [CnhCategories.B]});

    expect(driverRepository.findMany).toHaveBeenCalledTimes(1);
    expect(driverRepository.findMany).toHaveBeenCalledWith({name: 'João Silva', cnhCategories: [CnhCategories.B]});
    expect(drivers).toEqual(makeMockDrivers());
  });
});
