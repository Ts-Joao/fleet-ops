import { UpdateCnhInput } from './update-cnh.input'

export interface UpdateDriverInput {
  id: string
  name?: string
  birthDate?: Date
  cnh?: UpdateCnhInput
}
