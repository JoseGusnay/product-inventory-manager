import { ProductMapper } from './product.mapper';
import { ProductDTO, Product } from '../models/product.model';

describe('ProductMapper', () => {
  describe('toDomain', () => {
    it('should map ProductDTO to Product domain model correctly', () => {
      const dto: ProductDTO = {
        id: '123',
        name: 'Product Name',
        description: 'Product Description',
        logo: 'logo.png',
        date_release: '2025-01-01T00:00:00.000Z',
        date_revision: '2026-01-01T00:00:00.000Z',
      };

      const domain = ProductMapper.toDomain(dto);

      expect(domain.id).toBe(dto.id);
      expect(domain.name).toBe(dto.name);
      expect(domain.description).toBe(dto.description);
      expect(domain.logo).toBe(dto.logo);
      expect(domain.dateRelease).toBeInstanceOf(Date);
      expect(domain.dateRelease.toISOString()).toBe(dto.date_release);
      expect(domain.dateRevision).toBeInstanceOf(Date);
      expect(domain.dateRevision.toISOString()).toBe(dto.date_revision);
    });

    it('should handle missing fields with default values', () => {
      const dto: any = {
        id: '123',
      };

      const domain = ProductMapper.toDomain(dto);

      expect(domain.id).toBe('123');
      expect(domain.name).toBe('');
      expect(domain.description).toBe('');
      expect(domain.logo).toBe('');
      expect(domain.dateRelease).toBeInstanceOf(Date);
      expect(domain.dateRevision).toBeInstanceOf(Date);
    });

    it('should use current date if date fields are missing', () => {
      const dto: any = { id: '123' };
      const before = new Date().getTime();
      const domain = ProductMapper.toDomain(dto);
      const after = new Date().getTime();

      expect(domain.dateRelease.getTime()).toBeGreaterThanOrEqual(before);
      expect(domain.dateRelease.getTime()).toBeLessThanOrEqual(after);
    });
  });

  describe('toDTO', () => {
    it('should map Product domain to ProductDTO correctly', () => {
      const domain: Product = {
        id: '123',
        name: 'Product Name',
        description: 'Product Description',
        logo: 'logo.png',
        dateRelease: new Date('2025-01-01T00:00:00.000Z'),
        dateRevision: new Date('2026-01-01T00:00:00.000Z'),
      };

      const dto = ProductMapper.toDTO(domain);

      expect(dto.id).toBe(domain.id);
      expect(dto.name).toBe(domain.name);
      expect(dto.description).toBe(domain.description);
      expect(dto.logo).toBe(domain.logo);
      expect(dto.date_release).toBe(domain.dateRelease.toISOString());
      expect(dto.date_revision).toBe(domain.dateRevision.toISOString());
    });
  });

  describe('fromFormToDTO', () => {
    it('should map form aggregate to ProductDTO with ISO dates', () => {
      const formData = {
        id: '123',
        name: 'Product Name',
        description: 'Product Description',
        logo: 'logo.png',
        date_release: '2025-01-01',
        date_revision: '2026-01-01',
      };

      const dto = ProductMapper.fromFormToDTO(formData);

      expect(dto.id).toBe(formData.id);
      expect(dto.date_release).toContain('2025-01-01');
      expect(new Date(dto.date_release).toISOString()).toBe(new Date('2025-01-01').toISOString());
      expect(dto.date_revision).toContain('2026-01-01');
    });
  });
});
