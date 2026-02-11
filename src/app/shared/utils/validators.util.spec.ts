import { FormControl } from '@angular/forms';
import { CustomValidators } from './validators.util';

describe('CustomValidators', () => {
  describe('minDateToday', () => {
    it('should return null for empty value', () => {
      const control = new FormControl('');
      expect(CustomValidators.minDateToday(control)).toBeNull();
    });

    it('should return null for today', () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');

      const control = new FormControl(`${year}-${month}-${day}`);
      expect(CustomValidators.minDateToday(control)).toBeNull();
    });

    it('should return null for future date', () => {
      const today = new Date();
      const future = new Date(today.getFullYear() + 1, 0, 1);
      const year = future.getFullYear();
      const month = String(future.getMonth() + 1).padStart(2, '0');
      const day = String(future.getDate()).padStart(2, '0');

      const control = new FormControl(`${year}-${month}-${day}`);
      expect(CustomValidators.minDateToday(control)).toBeNull();
    });

    it('should return error for past date', () => {
      const control = new FormControl('2000-01-01');
      const result = CustomValidators.minDateToday(control);
      expect(result).toEqual({ dateInvalid: true });
    });
  });
});
