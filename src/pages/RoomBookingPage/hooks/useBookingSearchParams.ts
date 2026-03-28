import { Equipment } from '_tosslib/server/types';
import { parseAsInteger, useQueryStates, parseAsString, parseAsArrayOf } from 'nuqs';
import { getTodayDateString } from 'utils/date';

export function useBookingSearchParams({ onFilterChange }: { onFilterChange: () => void }) {
  const [{ date, startTime, endTime, attendees, equipment, floor: preferredFloor }, setRawParams] = useQueryStates(
    {
      date: parseAsString.withDefault(getTodayDateString()),
      startTime: parseAsString.withDefault(''),
      endTime: parseAsString.withDefault(''),
      attendees: parseAsInteger.withDefault(1),
      equipment: parseAsArrayOf(parseAsString, ',').withDefault([]),
      floor: parseAsInteger,
    },
    { history: 'replace' }
  );

  const setParams: typeof setRawParams = (updates) => {
    onFilterChange();
    return setRawParams(updates);
  };

  return { params: { date, startTime, endTime, attendees, equipment: equipment as unknown as Equipment[], preferredFloor }, setParams };
};
