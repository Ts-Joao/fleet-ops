import { Cnh } from "src/driver/domain/value-object/cnh";
import { DriverEntity } from "../enities/driver.entity";
import { Driver } from "src/driver/domain/entities/driver";

export class DriverMapper {
  static toDomain(entity: DriverEntity) {
    const cnh = Cnh.create(
      entity.cnh.number,
      entity.cnh.issueDate,
      entity.cnh.expiryDate,
      entity.cnh.categories,
      entity.cnh.restrictions,
      entity.cnh.status,
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
    entity.cnh.number = domain.getCnh().getNumber();
    entity.cnh.issueDate = domain.getCnh().getIssueDate();
    entity.cnh.expiryDate = domain.getCnh().getExpiryDate();
    entity.cnh.categories = domain.getCnh().getCategories();
    entity.cnh.restrictions = domain.getCnh().getRestrictions();
    entity.cnh.status = domain.getCnh().getStatus();

    return entity;
  }
}