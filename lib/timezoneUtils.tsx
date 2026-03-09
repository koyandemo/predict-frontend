import { format, toZonedTime, fromZonedTime } from "date-fns-tz";

export const convertUtcToTimezone = (
  utcDate: string,
  timezone: string
): Date => {
  const date = new Date(utcDate);
  return toZonedTime(date, timezone);
};

export const convertTimezoneToUtc = (date: Date, timezone: string): Date => {
  return fromZonedTime(date, timezone);
};

export const formatUtcDateForTimezone = (
  utcDate: string,
  timezone: string,
  dateFormat: string = "yyyy-MM-dd",
  timeFormat: string = "HH:mm"
): { formattedDate: string; formattedTime: string } => {
  const date = new Date(utcDate);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const zonedDate = toZonedTime(date, timezone);

  return {
    formattedDate: format(zonedDate, dateFormat, { timeZone: timezone }),
    formattedTime: format(zonedDate, timeFormat, { timeZone: timezone }),
  };
};

export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatMatchDateForUser = (
  matchDate: string
): { date: string; time: string } => {
  const userTimezone = getUserTimezone();

  try {
    const { formattedDate, formattedTime } = formatUtcDateForTimezone(
      matchDate,
      userTimezone
    );

    return { date: formattedDate, time: formattedTime };
  } catch {
    const { formattedDate, formattedTime } = formatUtcDateForTimezone(
      matchDate,
      "UTC"
    );

    return { date: formattedDate, time: formattedTime };
  }
};

export const formatCombinedMatchDateTimeForUser = (
  matchDate: string
): { date: string; time: string } => {
  const userTimezone = getUserTimezone();
  try {
    const { formattedDate, formattedTime } = formatUtcDateForTimezone(
      matchDate,
      userTimezone
    );

    return { date: formattedDate, time: formattedTime };
  } catch {
    const { formattedDate, formattedTime } = formatUtcDateForTimezone(
      matchDate,
      "UTC"
    );

    return { date: formattedDate, time: formattedTime };
  }
};
