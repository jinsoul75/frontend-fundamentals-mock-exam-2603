import { TIMELINE_START } from 'constants/timeSlots';

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h - TIMELINE_START) * 60 + m;
}

export function formatHourForDisplay(timeLabel: string): string {
  const [h, m] = timeLabel.split(':').map(Number);
  return `${h}:${m}`;
}