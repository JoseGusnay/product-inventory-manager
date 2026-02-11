import { Product, ProductDTO } from '../models/product.model';

export class ProductMapper {
  static toDomain(dto: ProductDTO): Product {
    return {
      id: dto.id || '',
      name: dto.name || '',
      description: dto.description || '',
      logo: dto.logo || '',
      dateRelease: dto.date_release ? new Date(dto.date_release) : new Date(),
      dateRevision: dto.date_revision ? new Date(dto.date_revision) : new Date(),
    };
  }

  static toDTO(domain: Product): ProductDTO {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      logo: domain.logo,
      date_release: domain.dateRelease.toISOString(),
      date_revision: domain.dateRevision.toISOString(),
    };
  }

  static fromFormToDTO(formData: any): ProductDTO {
    return {
      ...formData,

      date_release: new Date(formData.date_release).toISOString(),
      date_revision: new Date(formData.date_revision).toISOString(),
    };
  }
}
