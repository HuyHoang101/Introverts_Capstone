import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';

dayjs.extend(relativeTime);
dayjs.locale('en');

/**
 * Format timestamp (Firebase or JS Date) to "dd/mm/yyyy hh:mm"
 */
export const formatVietnamTime = (timestamp: any): string => {
  const date = timestamp?._seconds
    ? dayjs.unix(timestamp._seconds)
    : dayjs(timestamp);

  return date.format('DD MMM YYYY - HH:mm');
};

/**
 * Format timestamp (Firebase or JS Date) to "dd/mm/yyyy hh:mm"
 */
export const formatMonthYear = (timestamp: any): string => {
  const date = timestamp?._seconds
    ? dayjs.unix(timestamp._seconds)
    : dayjs(timestamp);

  return date.format('MMM YYYY');
};

/**
 * Format timestamp (Firebase or JS Date) to "dd/mm/yyyy hh:mm"
 */
export const formatHourDate = (timestamp: any): string => {
  const date = timestamp?._seconds
    ? dayjs.unix(timestamp._seconds)
    : dayjs(timestamp);

  return date.format('DD/MM  HH:mm');
};

/**
 * Format timestamp (Firebase or JS Date) to "dd/mm/yyyy hh:mm"
 */
export const formatDate = (timestamp: any): string => {
  const date = timestamp?._seconds
    ? dayjs.unix(timestamp._seconds)
    : dayjs(timestamp);

  return date.format('DD/MM');
};

/**
 * Show relative time like "3 hours ago"
 */
export const timeAgo = (timestamp: any): string => {
  const date = timestamp?._seconds
    ? dayjs.unix(timestamp._seconds)
    : dayjs(timestamp);

  return date.fromNow();
};

