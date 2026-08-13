import { CnhCategories } from "src/driver/domain/enums/cnh-category"
import { CnhRestrictions } from "src/driver/domain/enums/cnh-restrictions"
import { CnhStatus } from "src/driver/domain/enums/cnh-status"

export interface RegisterDriverInput {
  name: string
  birthDate: Date
  cnh: {
    number: string
    issueDate: Date
    expiryDate: Date
    categories: CnhCategories[]
    restrictions: CnhRestrictions[]
    status: CnhStatus
  }
}