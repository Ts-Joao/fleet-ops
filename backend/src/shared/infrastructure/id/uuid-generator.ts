import { randomUUID } from 'crypto';
import { IdGenerator } from 'src/shared/application/ports/id-generator.port';

export class UuidGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
