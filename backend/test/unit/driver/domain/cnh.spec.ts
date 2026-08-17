import { CnhStatus } from '@driver/domain/enums/cnh-status';
import { CnhCategories } from '@driver/domain/enums/cnh-category';
import { Cnh } from '@driver/domain/value-object/cnh';
import { InvalidCnhError } from '@driver/domain/errors/invalid-cnh.error';
import { CnhRestrictions } from '@driver/domain/enums/cnh-restrictions';

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

describe('CNH', () => {

  describe('create', () => {
    it('should create a valid CNH', () => {
      const cnh = makeCnh();

      expect(cnh).toBeTruthy();
    });

    it('should reject invalid CNH number', () => {
      expect(() => {
        Cnh.create(
          '123',
          new Date(2020, 0, 1),
          new Date(2030, 0, 1),
          [CnhCategories.B],
          [],
          CnhStatus.ACTIVE,
        );
      }).toThrow(InvalidCnhError);
    });

    it('should reject an invalid issue date', () => {
      expect(() => {
        Cnh.create(
          '12345678901',
          new Date(2030, 0, 1),
          new Date(2020, 0, 1),
          [CnhCategories.B],
          [],
          CnhStatus.ACTIVE,
        );
      }).toThrow(InvalidCnhError);
    });

    it('should reject an invalid date in the future', () => {
      expect(() => {
        Cnh.create(
          '12345678901',
          new Date(new Date().getFullYear() + 1, 0, 1),
          new Date(2030, 0, 1),
          [CnhCategories.B],
          [],
          CnhStatus.ACTIVE,
        );
      }).toThrow(InvalidCnhError);
    });

    it('should reject an expiry date before issue date', () => {
      expect(() => {
        Cnh.create(
          '12345678901',
          new Date(2026, 10, 1),
          new Date(2026, 9, 30),
          [CnhCategories.B],
          [],
          CnhStatus.ACTIVE,
        );
      }).toThrow(InvalidCnhError);
    });

    it('should reject an expiry date in the past', () => {
      expect(() => {
        Cnh.create(
          '12345678901',
          new Date(2022, 10, 1),
          new Date(2010, 0, 1),
          [CnhCategories.B],
          [],
          CnhStatus.ACTIVE,
        );
      }).toThrow(InvalidCnhError);
    });

    it('should reject expiry date equals to the issue date', () => {
      expect(() => {
        Cnh.create(
          '12345678901',
          new Date(2022, 10, 1),
          new Date(2022, 10, 1),
          [CnhCategories.B],
          [],
          CnhStatus.ACTIVE,
        );
      }).toThrow(InvalidCnhError);
    });

    it('should reject duplicate categories', () => {
      expect(() => {
        Cnh.create(
          '12345678901',
          new Date(2022, 10, 1),
          new Date(2032, 10, 1),
          [CnhCategories.B, CnhCategories.B],
          [],
          CnhStatus.ACTIVE,
        );
      }).toThrow(InvalidCnhError);
    });

    it('should reject duplicate restrictions', () => {
      expect(() => {
        Cnh.create(
          '12345678901',
          new Date(2022, 10, 1),
          new Date(2032, 10, 1),
          [CnhCategories.B],
          [
            CnhRestrictions.CORRECTIVE_LENSES,
            CnhRestrictions.CORRECTIVE_LENSES,
          ],
          CnhStatus.ACTIVE,
        );
      }).toThrow(InvalidCnhError);
    });

    it('should reject an invalid status', () => {
      expect(() => {
        Cnh.create(
          '12345678901',
          new Date(2022, 10, 1),
          new Date(2032, 10, 1),
          [CnhCategories.B],
          [],
          'invalid_status' as CnhStatus,
        );
      }).toThrow(InvalidCnhError);
    });
  });

  describe('isExpired() method', () => {
    it('should return true when the CNH is expired', () => {
      const expiredCnh = Cnh.create(
        '12345678901',
        new Date(2022, 10, 1),
        new Date(2024, 10, 1),
        [CnhCategories.B],
        [],
        CnhStatus.EXPIRED,
      );

      expect(expiredCnh.isExpired()).toBe(true);
    });

    it('should return false when the CNH is valid', () => {
      const cnh = makeCnh();

      expect(cnh.isExpired()).toBe(false);
    });
  });
});
