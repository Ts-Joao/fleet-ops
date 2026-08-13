import { Cnh } from "src/driver/domain/value-object/cnh";
import { DriverEntity } from "../enities/driver.entity";
import { Driver } from "src/driver/domain/entities/driver";

export class DriverMapper {
  static toDomain(entity: DriverEntity) {
    const cnh = Cnh.create(
      entity.cnhNumber,
      entity.cnhIssueDate,
      entity.cnhExpiryDate,
      entity.cnhCategories,
      entity.cnhRestrictions,
      entity.cnhStatus,
    )

    return Driver.create(
      entity.id,
      entity.name,
      entity.birthDate,
      cnh
    )
  }

  static toEntity(domain: Driver): DriverEntity {
    const entity = new DriverEntity();

    entity.id = domain.getId();
    entity.name = domain.getName();
    entity.birthDate = domain.getBirthDate();
    entity.cnhNumber = domain.getCnh().getNumber();
    entity.cnhIssueDate = domain.getCnh().getIssueDate();
    entity.cnhExpiryDate = domain.getCnh().getExpiryDate();
    entity.cnhCategories = domain.getCnh().getCategories();
    entity.cnhRestrictions = domain.getCnh().getRestrictions();
    entity.cnhStatus = domain.getCnh().getStatus();

    return entity;
  }
}