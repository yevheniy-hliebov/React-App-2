/**
 * Function to format time based on the provided template.
 *
 * @param {string | number | Date} inputDate - Date object.
 * @param {string} mask - Time formatting template. Supports the following tokens:
 *                        - yyyy: year (e.g., 2023)
 *                        - MM: month (01-12)
 *                        - MONTH: month abbreviation (e.g., Jan, Feb)
 *                        - dd: day of the month (01-31)
 *                        - HH: hour (00-23)
 *                        - h0: hour in 12-hour format (01-12)
 *                        - hh: hour in 12-hour format (1-12)
 *                        - mm: minute (00-59)
 *                        - ss: second (00-59)
 *                        - AMPM: am or pm
 *                        - DAY: day of the week (e.g., Monday)
 *                        - DD: day of the week (e.g., Mon)
 * @returns {string} A string representing the formatted time according to the provided template.
 */

export function formatDate(inputDate: string | number | Date, mask: string, timezone = 0): string {
  let date = new Date(inputDate);

  let utc = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  let timezonedDate = new Date(utc.getTime() + timezone * 1000);
  date = timezonedDate;

  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek3leter = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const tokens: Record<string, string> = {
    yyyy: date.getFullYear().toString(),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    MONTH: monthAbbr[date.getMonth()],
    dd: String(date.getDate()).padStart(2, '0'),
    HH: String(date.getHours()).padStart(2, '0'),
    h0: String((date.getHours() % 12) || 12).padStart(2, '0'),
    hh: String((date.getHours() % 12) || 12),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
    DAY: dayOfWeek[date.getDay()],
    DD: dayOfWeek3leter[date.getDay()],
    AMPM: date.getHours() >= 12 ? 'pm' : 'am',
  };

  let result = mask;
  for (const token in tokens) {
    result = result.replace(token, tokens[token]);
  }

  return result;
}

export function getISODateString(date: string | Date) {
  return formatDate(date, 'yyyy-MM-dd');
}