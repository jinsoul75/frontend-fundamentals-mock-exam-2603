import { z } from 'zod';

export const bookingConditionSchema = z
  .object({
    startTime: z.string(),
    endTime: z.string(),
    attendees: z.number().int().min(1, '참석 인원은 1명 이상이어야 합니다.'),
  })
  .refine(data => data.endTime > data.startTime, {
    message: '종료 시간은 시작 시간보다 늦어야 합니다.',
    path: ['endTime'],
  });

export type BookingCondition = z.infer<typeof bookingConditionSchema>;

export const bookingSubmitSchema = z
  .object({
    roomId: z.string().min(1, '회의실을 선택해주세요.'),
    startTime: z.string().min(1, '시작 시간과 종료 시간을 선택해주세요.'),
    endTime: z.string().min(1, '시작 시간과 종료 시간을 선택해주세요.'),
  })
  .refine(data => data.endTime > data.startTime, {
    message: '종료 시간은 시작 시간보다 늦어야 합니다.',
    path: ['endTime'],
  });

export type BookingSubmit = z.infer<typeof bookingSubmitSchema>;
