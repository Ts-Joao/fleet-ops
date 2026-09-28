import { CnhCategories } from '@driver/domain/enums/cnh-category';
import { CnhRestrictions } from '@driver/domain/enums/cnh-restrictions';
import { CnhStatus } from '@driver/domain/enums/cnh-status';

export interface RegisterDriverInput {
  name: string;
  birthDate: Date;
  cnh: {
    number: string;
    issueDate: Date;
    expiryDate: Date;
    categories: CnhCategories[];
    restrictions: CnhRestrictions[];
    status: CnhStatus;
  }
}
