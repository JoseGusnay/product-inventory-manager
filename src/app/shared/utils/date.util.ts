export class DateUtils {
  static calculateOneYearLater(dateStr: string): string {
    if (!dateStr) return '';

    const [year, month, day] = dateStr.split('-').map(Number);

    const releaseDate = new Date(year, month - 1, day);

    const revisionDate = new Date(
      releaseDate.getFullYear() + 1,
      releaseDate.getMonth(),
      releaseDate.getDate(),
    );

    const y = revisionDate.getFullYear();
    const m = String(revisionDate.getMonth() + 1).padStart(2, '0');
    const d = String(revisionDate.getDate()).padStart(2, '0');

    return `${y}-${m}-${d}`;
  }
}
