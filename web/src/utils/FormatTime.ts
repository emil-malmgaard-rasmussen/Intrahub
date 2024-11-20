import { format, isValid, startOfDay, getTime, formatDistanceToNow } from 'date-fns';

// Define date formats similar to the ones used in the original code
export const formatStr = {
    dateTime: 'dd MMM yyyy h:mm a', // 17 Apr 2022 12:00 am
    date: 'dd MMM yyyy', // 17 Apr 2022
    time: 'h:mm a', // 12:00 am
    split: {
        dateTime: 'dd/MM/yyyy h:mm a', // 17/04/2022 12:00 am
        date: 'dd/MM/yyyy', // 17/04/2022
    },
    paramCase: {
        dateTime: 'dd-MM-yyyy h:mm a', // 17-04-2022 12:00 am
        date: 'dd-MM-yyyy', // 17-04-2022
    },
};

export type DatePickerFormat = Date | string | number | null | undefined;

/** Get today's date in the specified format */
export function today(formatStr?: string) {
    return format(startOfDay(new Date()), formatStr || 'dd MMM yyyy');
}

/** Format date and time */
export function fDateTime(date: DatePickerFormat, formatType?: string) {
    if (!date) return null;
    const parsedDate = new Date(date);
    return isValid(parsedDate) ? format(parsedDate, formatType || formatStr.dateTime) : 'Invalid time value';
}

/** Format date */
export function fDate(date: DatePickerFormat, formatType?: string) {
    if (!date) return null;
    const parsedDate = new Date(date);
    return isValid(parsedDate) ? format(parsedDate, formatType || formatStr.date) : 'Invalid time value';
}

/** Format time */
export function fTime(date: DatePickerFormat, formatType?: string) {
    if (!date) return null;
    const parsedDate = new Date(date);
    return isValid(parsedDate) ? format(parsedDate, formatType || formatStr.time) : 'Invalid time value';
}

/** Get timestamp */
export function fTimestamp(date: DatePickerFormat) {
    if (!date) return null;
    const parsedDate = new Date(date);
    return isValid(parsedDate) ? getTime(parsedDate) : 'Invalid time value';
}

export function fToNow(date: DatePickerFormat) {
    if (!date) return null;
    const parsedDate = new Date(date);
    return isValid(parsedDate) ? formatDistanceToNow(parsedDate, { addSuffix: true }) : 'Invalid time value';
}
