import { Cnh } from "src/driver/domain/value-object/cnh";
import { DriverEntity } from "@driver/infrastructure/persistence/entities/driver.entity";
import { Driver } from "src/driver/domain/entities/driver";
import { CnhEntity } from "@driver/infrastructure/persistence/entities/cnh.entity";

export class DriverMapper {
  static toDomain(entity: DriverEntity): Driver {
    if (!entity.cnh) {
      throw new Error('Driver CNH relation is not loaded');
    }

    const cnh = Cnh.create(
      entity.cnh.number,
      new Date(entity.cnh.issueDate),
      new Date(entity.cnh.expiryDate),
      entity.cnh.categories,
      entity.cnh.restrictions,
      entity.cnh.status,
    );

    return Driver.create(
      entity.id,
      entity.name,
      new Date(entity.birthDate),
      cnh,
    );
  }

  static toEntity(domain: Driver, existingCnhId?: string): DriverEntity {
    const entity = new DriverEntity();
    const cnhEntity = new CnhEntity();

    cnhEntity.id = existingCnhId ?? crypto.randomUUID();
    cnhEntity.number = domain.getCnh().getNumber();
    cnhEntity.issueDate = domain.getCnh().getIssueDate();
    cnhEntity.expiryDate = domain.getCnh().getExpiryDate();
    cnhEntity.categories = domain.getCnh().getCategories();
    cnhEntity.restrictions = domain.getCnh().getRestrictions();
    cnhEntity.status = domain.getCnh().getStatus();

    entity.id = domain.getId();
    entity.name = domain.getName();
    entity.birthDate = domain.getBirthDate();
    entity.cnh = cnhEntity;

    return entity;
  }
}