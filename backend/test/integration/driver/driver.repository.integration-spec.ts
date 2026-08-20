import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cnh } from '@driver/domain/value-object/cnh';
import { CnhCategories } from '@driver/domain/enums/cnh-category';
import { CnhStatus } from '@driver/domain/enums/cnh-status';
import { DriverEntity } from '@driver/infrastructure/persistence/entities/driver.entity';
import { CnhEntity } from '@driver/infrastructure/persistence/entities/cnh.entity';
import { Driver } from '@driver/domain/entities/driver';
import { TypeOrmDriverRepository } from '@driver/infrastructure/persistence/repositories/typeorm-driver.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('TypeOrmDriverRepository (Integration)', () => {
  let repository: TypeOrmDriverRepository;
  let dataSource: DataSource;
  let driverOrmRepository: Repository<DriverEntity>;

  const createDomainDriver = (id = '59553fe9-3a0f-4af0-bb76-f9cbbd9c5312', cnhNumber = '12345678901') => {
    const cnh = Cnh.create(
      cnhNumber,
      new Date('2024-01-01'),
      new Date('2029-01-01'),
      [CnhCategories.A, CnhCategories.B],
      [],
      CnhStatus.ACTIVE,
    );
    return Driver.create(id, 'João da Silva', new Date('1990-01-01'), cnh);
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env'
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: 'postgres' as const,
            host: config.get<string>('POSTGRES_HOST') || 'localhost',
            port: Number(config.get('POSTGRES_TEST_PORT')) || 5432,
            username: config.get<string>('POSTGRES_USER') || 'postgres',
            password: String(config.get('POSTGRES_PASSWORD') ?? 'postgres'),
            database: config.get<string>('POSTGRES_DB_TEST') || 'fleet_ops_test',
            entities: [DriverEntity, CnhEntity],
            dropSchema: true,
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([DriverEntity, CnhEntity]),
      ],
      providers: [TypeOrmDriverRepository],
    }).compile();

    repository = moduleRef.get<TypeOrmDriverRepository>(TypeOrmDriverRepository);
    dataSource = moduleRef.get<DataSource>(DataSource);
    driverOrmRepository = dataSource.getRepository(DriverEntity);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE "drivers", "cnhs" CASCADE;');
  });

  describe('save', () => {
    it('deve persistir um novo Driver e sua CNH no PostgreSQL', async () => {
      const driver = createDomainDriver();

      const savedDriver = await repository.save(driver);

      expect(savedDriver).toBeInstanceOf(Driver);
      expect(savedDriver.getId()).toBe(driver.getId());

      const entityInDb = await driverOrmRepository.findOne({
        where: { id: driver.getId() },
        relations: { cnh: true },
      });

      expect(entityInDb).not.toBeNull();
      expect(entityInDb?.name).toBe('João da Silva');
      expect(entityInDb?.cnh.number).toBe('12345678901');
    });

    it('deve atualizar um Driver e CNH existentes sem violar a constraint UNIQUE', async () => {
      const driver = createDomainDriver();
      await repository.save(driver);

      const updatedDriver = Driver.create(
        driver.getId(),
        'João da Silva Alterado',
        driver.getBirthDate(),
        driver.getCnh(),
      );

      const result = await repository.save(updatedDriver);

      expect(result.getName()).toBe('João da Silva Alterado');

      const count = await driverOrmRepository.count();
      expect(count).toBe(1);
    });
  });

  describe('findMany', () => {
    it('deve filtrar corretamente usando ILIKE e o operador ::jsonb @> do Postgres', async () => {
      const driver1 = createDomainDriver('59553fe9-3a0f-4af0-bb76-f9cbbd9c5312', '11111111111');
      const driver2 = Driver.create(
        'a98db68c-1e94-4e1e-b355-d1c8b5dd90e6',
        'Maria Souza',
        new Date('1995-05-05'),
        Cnh.create(
          '22222222222',
          new Date('2024-01-01'),
          new Date('2029-01-01'),
          [CnhCategories.D],
          [],
          CnhStatus.ACTIVE,
        ),
      );

      await repository.save(driver1);
      await repository.save(driver2);

      const results = await repository.findMany({
        cnhCategories: [CnhCategories.D],
      });

      expect(results).toHaveLength(1);
      expect(results[0].getName()).toBe('Maria Souza');
    });
  });

  describe('findById e findByCnhNumber', () => {
    it('deve buscar e mapear corretamente o relacionamento da CNH', async () => {
      const driver = createDomainDriver();
      await repository.save(driver);

      const foundById = await repository.findById(driver.getId());
      const foundByCnh = await repository.findByCnhNumber('12345678901');

      expect(foundById?.getCnh().getNumber()).toBe('12345678901');
      expect(foundByCnh?.getId()).toBe(driver.getId());
    });
  });

  describe('delete', () => {
    it('deve remover o motorista da base de dados', async () => {
      const driver = createDomainDriver();
      await repository.save(driver);

      await repository.delete(driver.getId());

      const found = await repository.findById(driver.getId());
      expect(found).toBeNull();
    });
  });
});