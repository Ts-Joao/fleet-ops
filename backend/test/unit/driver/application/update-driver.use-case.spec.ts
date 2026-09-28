import { DriverNotFoundError } from '@driver/domain/errors/driver-not-found.error';
import { DriverRepository } from '@driver/domain/ports/driver-repository';
import { UpdateDriverUseCase } from '@driver/application/use-cases/update-driver.use-case';
import { Driver } from '@driver/domain/entities/driver';
import { Cnh } from '@driver/domain/value-object/cnh';
import { CnhCategories } from '@driver/domain/enums/cnh-category';
import { CnhStatus } from '@driver/domain/enums/cnh-status';
import { UpdateDriverInput } from '@driver/application/dto/update-driver.input';
import { CnhAlreadyExistsError } from '@driver/domain/errors/cnh-already-exist.error';

describe('Update Driver use case', () => {
  let driverRepository: DriverRepository;
  let useCase: UpdateDriverUseCase;

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
  
    const createMockDriver = (id: string, name: string, cnhNumber: string, cnhCategories: CnhCategories[] = []): Driver => {
      return Driver.create(
        id,
        name,
        new Date('1990-01-01'),
        createMockCnh(cnhNumber, cnhCategories),
      );
    };
  
    const makeMockDrivers = (): Driver[] => [
      createMockDriver('1', 'João Silva', '12345678900', [CnhCategories.A, CnhCategories.B]),
      createMockDriver('2', 'Maria Santos', '12345678901', [CnhCategories.D]),
    ];

  beforeEach(() => {
    driverRepository = {
      findMany: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByCnhNumber: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new UpdateDriverUseCase(driverRepository);
  });

  it('should update a driver', async () => {
    const driverId = '1';
    const updatedDriver: UpdateDriverInput = {
      id: driverId,
      name: 'Updated Driver',
      birthDate: new Date('1991-01-01'),
      cnh: {
        number: '12345678910',
        issueDate: new Date(new Date().getFullYear() - 5),
        expiryDate: new Date(new Date().getFullYear() + 5),
        categories: [CnhCategories.A, CnhCategories.B],
        restrictions: [],
        status: CnhStatus.ACTIVE,
      },
    };
    
    jest.spyOn(driverRepository, 'findById').mockResolvedValue(makeMockDrivers()[0]);
    jest.spyOn(driverRepository, 'save').mockResolvedValue(makeMockDrivers()[0]);
    
    const result = await useCase.execute(updatedDriver);
    
    expect(driverRepository.findById).toHaveBeenCalledWith(driverId);
    expect(driverRepository.save).toHaveBeenCalledWith(updatedDriver);
    expect(result).toEqual(makeMockDrivers()[0]);
  });

  it('should throw when driver does not exist', async () => {
    const driverId = '1';
    const updatedDriver: UpdateDriverInput = {
      id: driverId,
      name: 'Updated Driver',
      birthDate: new Date('1991-01-01'),
      cnh: {
        number: '12345678910',
        issueDate: new Date(new Date().getFullYear() - 5),
        expiryDate: new Date(new Date().getFullYear() + 5),
        categories: [CnhCategories.A, CnhCategories.B],
        restrictions: [],
        status: CnhStatus.ACTIVE,
      },
    };
    
    jest.spyOn(driverRepository, 'findById').mockResolvedValue(null);
    jest.spyOn(driverRepository, 'save').mockResolvedValue(makeMockDrivers()[0]);
    
    await expect(useCase.execute(updatedDriver)).rejects.toThrow(DriverNotFoundError);
    
    expect(driverRepository.findById).toHaveBeenCalledWith(driverId);
    expect(driverRepository.save).not.toHaveBeenCalled();
  });

  it('should throw when new CNH already exists', async () => {
    const driverId = '1';
    const updatedDriver: UpdateDriverInput = {
      id: driverId,
      name: 'Updated Driver',
      birthDate: new Date('1991-01-01'),
      cnh: {
        number: '12345678901',
        issueDate: new Date(new Date().getFullYear() - 5),
        expiryDate: new Date(new Date().getFullYear() + 5),
        categories: [CnhCategories.A, CnhCategories.B],
        restrictions: [],
        status: CnhStatus.ACTIVE,
      },
    };
  
  jest.spyOn(driverRepository, 'findById').mockResolvedValue(makeMockDrivers()[0]);
  jest.spyOn(driverRepository, 'save').mockResolvedValue(makeMockDrivers()[0]);
  jest.spyOn(driverRepository, 'findByCnhNumber').mockResolvedValue(makeMockDrivers()[0]);
  
  await expect(useCase.execute(updatedDriver)).rejects.toThrow(CnhAlreadyExistsError);
  
  expect(driverRepository.findById).toHaveBeenCalledWith(driverId);
  expect(driverRepository.save).not.toHaveBeenCalled();
  expect(driverRepository.findByCnhNumber).toHaveBeenCalledWith(updatedDriver.cnh?.number);
  });
});