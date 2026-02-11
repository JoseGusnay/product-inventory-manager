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

  /**
   * Special mapper for the form data which uses YYYY-MM-DD strings
   * but needs to be sent as ISO strings to the API.
   */
  static fromFormToDTO(formData: any): ProductDTO {
    return {
      ...formData,
      // Ensure dates are in the correct format for the API
      date_release: new Date(formData.date_release).toISOString(),
      date_revision: new Date(formData.date_revision).toISOString(),
    };
  }
}
