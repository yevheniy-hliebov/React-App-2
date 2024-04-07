export function isDate(dateString: any): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}