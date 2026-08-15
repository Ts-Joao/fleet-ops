import { UpdateCnhInput } from './update-cnh.input'

export interface UpdateDriverInput {
  name?: string
  birthDate?: Date
  cnh?: UpdateCnhInput
}
