import { Driver } from '@driver/domain/entities/driver';
import { CnhCategories } from '@driver/domain/enums/cnh-category';
import { CnhStatus } from '@driver/domain/enums/cnh-status';
import { InvalidDriverError } from '@driver/domain/errors/invalid-driver.error';
import { Cnh } from '@driver/domain/value-object/cnh';

function makeCnh(categories: CnhCategories[] = [CnhCategories.B]): Cnh {
  return Cnh.create(
    '12345678901',
    new Date(2020, 0, 1),
    new Date(2030, 0, 1),
    categories,
    [],
    CnhStatus.ACTIVE,
  );
}

function makeDriver(categories: CnhCategories[] = [CnhCategories.B]): Driver {
  return Driver.create(
    '12345678-1234-5678-1234-567812345678',
    'John Doe',
    new Date('1990-01-01'),
    makeCnh(categories),
  );
}

describe('Driver', () => {
  describe('create', () => {
    it('should create a valid driver', () => {
      const driver = makeDriver();

      expect(driver).toBeInstanceOf(Driver);
    });

    it('should reject a driver without an id', () => {
      expect(() => {
        Driver.create(
          '',
          'John Doe',
          new Date('1990-01-01'),
          makeCnh(),
        );
      }).toThrow(InvalidDriverError);
    });

    it('should reject a driver with an invalid name', () => {
      expect(() => {
        Driver.create(
          '12345678-1234-5678-1234-567812345678',
          '',
          new Date('1990-01-01'),
          makeCnh(),
        );
      }).toThrow(InvalidDriverError);
    });

    it('should reject a driver with an invalid birth date', () => {
      expect(() => {
        Driver.create(
          '12345678-1234-5678-1234-567812345678',
          'John Doe',
          new Date('2026-01-01'),
          makeCnh(),
        );
      }).toThrow(InvalidDriverError);
    });

    it('should reject a driver without a CNH', () => {
      expect(() => {
        Driver.create(
          '12345678-1234-5678-1234-567812345678',
          'John Doe',
          new Date('1990-01-01'),
          null as unknown as Cnh,
        );
      }).toThrow(InvalidDriverError);
    });

    it('should reject a driver with a future birth date', () => {
      expect(() => {
        Driver.create(
          '12345678-1234-5678-1234-567812345678',
          'John Doe',
          new Date(new Date().getFullYear() + 1, 0, 1),
          makeCnh(),
        );
      }).toThrow(InvalidDriverError);
    });
  });

  describe('age validation', () => {

    it('should allow category A for driver aged 18+', () => {
      const driver = Driver.create(
        '12345678-1234-5678-1234-567812345678',
        'John Doe',
        new Date(new Date().getFullYear() - 18, 0, 1),
        makeCnh([CnhCategories.A]),
      );

      expect(driver).toBeInstanceOf(Driver);
    });

    it('should allow category B for driver aged 18+', () => {
      const driver = Driver.create(
        '12345678-1234-5678-1234-567812345678',
        'John Doe',
        new Date(new Date().getFullYear() - 18, 0, 1),
        makeCnh([CnhCategories.B]),
      );

      expect(driver).toBeInstanceOf(Driver);
    });

    it('should allow category C for driver aged 19+', () => {
      const driver = Driver.create(
        '12345678-1234-5678-1234-567812345678',
        'John Doe',
        new Date(new Date().getFullYear() - 19, 0, 1),
        makeCnh([CnhCategories.C]),
      );

      expect(driver).toBeInstanceOf(Driver);
    });

    it('should allow category D for driver aged 21+', () => {
      const driver = Driver.create(
        '12345678-1234-5678-1234-567812345678',
        'John Doe',
        new Date(new Date().getFullYear() - 21, 0, 1),
        makeCnh([CnhCategories.D]),
      );

      expect(driver).toBeInstanceOf(Driver);
    });

    it('should allow category E for driver aged 21+', () => {
      const driver = Driver.create(
        '12345678-1234-5678-1234-567812345678',
        'John Doe',
        new Date(new Date().getFullYear() - 21, 0, 1),
        makeCnh([CnhCategories.E]),
      );

      expect(driver).toBeInstanceOf(Driver);
    });

    it('should reject category A for driver under 18', () => {
      expect(() => {
        Driver.create(
          '12345678-1234-5678-1234-567812345678',
          'John Doe',
          new Date(new Date().getFullYear() - 17, 0, 1),
          makeCnh([CnhCategories.A]),
        );
      }).toThrow(InvalidDriverError);
    });

    it('should reject category B for driver under 18', () => {
      expect(() => {
        Driver.create(
          '12345678-1234-5678-1234-567812345678',
          'John Doe',
          new Date(new Date().getFullYear() - 17, 0, 1),
          makeCnh([CnhCategories.B]),
        );
      }).toThrow(InvalidDriverError);
    });

    it('should reject category C for driver under 19', () => {
      expect(() => {
        Driver.create(
          '12345678-1234-5678-1234-567812345678',
          'John Doe',
          new Date(new Date().getFullYear() - 18, 0, 1),
          makeCnh([CnhCategories.C]),
        );
      }).toThrow(InvalidDriverError);
    });

    it('should reject category D for driver under 21', () => {
      expect(() => {
        Driver.create(
          '12345678-1234-5678-1234-567812345678',
          'John Doe',
          new Date(new Date().getFullYear() - 20, 0, 1),
          makeCnh([CnhCategories.D]),
        );
      }).toThrow(InvalidDriverError);
    });

    it('should reject category E for driver under 21', () => {
      expect(() => {
        Driver.create(
          '12345678-1234-5678-1234-567812345678',
          'John Doe',
          new Date(new Date().getFullYear() - 20, 0, 1),
          makeCnh([CnhCategories.E]),
        );
      }).toThrow(InvalidDriverError);
    });
  })

  describe('changeName', () => {
    it('should change the driver name', () => {
      const driver = makeDriver();

      driver.changeName('Jane Doe');

      expect(driver.getName()).toBe('Jane Doe');
    });

    it('should reject an invalid name', () => {
      const driver = makeDriver();

      expect(() => {
        driver.changeName('');
      }).toThrow(InvalidDriverError);
    });
  });

  describe('changeBirthDate', () => {
    it('should change the driver birth date', () => {
      const driver = makeDriver();

      driver.changeBirthDate(new Date('1991-01-01'));

      expect(driver.getBirthDate()).toStrictEqual(new Date('1991-01-01'));
    });

    it('should reject a future birth date', () => {
      const driver = makeDriver();

      expect(() => {
        driver.changeBirthDate(new Date(new Date().getFullYear() + 1, 0, 1));
      }).toThrow(InvalidDriverError);
    });

    it('should reject a birth date incompatible with CNH categories', () => {
      const driver = makeDriver();

      expect(() => {
        driver.changeBirthDate(new Date(new Date().getFullYear() - 17, 0, 1));
      }).toThrow(InvalidDriverError);
    });
  });

  describe('changeCnh', () => {
    it('should change the driver CNH', () => {
      const driver = makeDriver();

      const newCnh = Cnh.create(
        '12345678901',
        new Date(2020, 0, 1),
        new Date(2030, 0, 1),
        [CnhCategories.A, CnhCategories.B],
        [],
        CnhStatus.ACTIVE,
      );

      driver.changeCnh(newCnh);

      expect(driver.getCnh()).toBe(newCnh);
    });

    it('should reject an invalid CNH', () => {
      const driver = makeDriver();

      expect(() => {
        driver.changeCnh(null as unknown as Cnh);
      }).toThrow(InvalidDriverError);
    });

    it('should reject a CNH incompatible with driver age', () => {
      const driver = Driver.create(
        '12345678-1234-5678-1234-567812345678',
        'John Doe',
        new Date(new Date().getFullYear() - 20, 0, 1),
        makeCnh([CnhCategories.A, CnhCategories.B]),
      );

      expect(() => {
        driver.changeCnh(makeCnh([CnhCategories.D]));
      }).toThrow(InvalidDriverError);
    });
  });
});
