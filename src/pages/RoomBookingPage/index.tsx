import { css } from '@emotion/react';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Border, Button, Text, Select } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getRooms, getReservations, createReservation } from 'pages/remotes';
import axios from 'axios';
import { EQUIPMENT_LABELS, ALL_EQUIPMENT } from 'constants/equipment';
import { TIME_SLOTS } from 'constants/timeSlots';
import { getTodayDateString } from 'utils/date';
import { ErrorMessage } from '../../components/ErrorMessage';
import { MeetingRoomCard } from '../../components/MeetingRoomCard';
import { ValidationError } from '../../components/ValidationError';
import { bookingConditionSchema, bookingSubmitSchema } from './schemas/bookingSchema';
import { DateInput } from '../../components/DateInput';
import { Section } from 'components/Section';
import { useBookingSearchParams } from 'hooks/useBookingSearchParams';
import { Equipment, Reservation, Room } from '_tosslib/server/types';

export function RoomBookingPage() {
  const navigate = useNavigate();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 필터 변경 시 선택 초기화
  const resetSelection = () => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  const { params, setParams } = useBookingSearchParams({ onFilterChange: resetSelection });
  const { date, startTime, endTime, attendees, equipment, preferredFloor } = params;
  const { createReservationMutation } = useCreateReservation();

  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });
  const { data: reservations = [] } = useQuery({ queryKey: ['reservations', date], queryFn: () => getReservations(date), enabled: !!date });

  // 입력 검증
  const { isComplete: isFilterComplete, validationError } = validateBookingCondition({ startTime, endTime, attendees });

  const availableRooms = isFilterComplete
    ? getAvailableRooms(rooms as Room[], reservations as Reservation[], { date, startTime, endTime, attendees, equipment, preferredFloor }) : [];

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <div css={css`padding: 12px 24px 0;`}>
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none; border: none; padding: 0; cursor: pointer; font-size: 14px;
            color: ${colors.grey600}; &:hover { color: ${colors.grey900}; }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>

      <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
        예약하기
      </Top.Top03>

      {errorMessage && (
        <ErrorMessage errorMessage={errorMessage} />
      )}

      <Spacing size={24} />

      {/* 예약 조건 입력 */}
      <Section>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 조건
        </Text>
        <Spacing size={16} />

        {/* 날짜 */}
        <div css={css`display: flex; flex-direction: column; gap: 6px;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>날짜</Text>
          <DateInput
            value={date}
            min={getTodayDateString()}
            onChange={(value) => setParams({ date: value })}
          />
        </div>
        <Spacing size={14} />

        {/* 시간 */}
        <div css={css`display: flex; gap: 12px;`}>
          <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>시작 시간</Text>
            <TimeSelect
              value={startTime}
              label="시작 시간"
              options={TIME_SLOTS.slice(0, -1)}
              onChange={value => setParams({ startTime: value })}
            />
          </div>
          <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>종료 시간</Text>
            <TimeSelect
              value={endTime}
              label="종료 시간"
              options={TIME_SLOTS.slice(1)}
              onChange={value => setParams({ endTime: value })}
            />
          </div>
        </div>
        <Spacing size={14} />

        {/* 참석 인원 + 선호 층 */}
        <div css={css`display: flex; gap: 12px;`}>
          <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>참석 인원</Text>
            <NumberInput
              value={attendees}
              min={1}
              onChange={e => setParams({ attendees: Math.max(1, Number(e.target.value)) })}
              label="참석 인원"
            />
          </div>
          <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>선호 층</Text>
            <FloorSelect
              value={preferredFloor}
              floors={getFloors(rooms as Room[])}
              onChange={value => setParams({ floor: value })}
              label="선호 층"
            />
          </div>
        </div>
        <Spacing size={14} />

        {/* 장비 */}
        <div>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>필요 장비</Text>
          <Spacing size={8} />
          <div css={css`display: flex; gap: 8px; flex-wrap: wrap;`}>
            {ALL_EQUIPMENT.map(eq => {
              const selected = equipment.includes(eq);

              return (
                <MultiSelectButton
                  key={eq}
                  selected={selected}
                  onClick={() => setParams({ equipment: selected ? equipment.filter(e => e !== eq) : [...equipment, eq] })}
                  label={EQUIPMENT_LABELS[eq]}
                  value={EQUIPMENT_LABELS[eq]}
                />
              );
            })}
          </div>
        </div>
      </Section>

      {validationError && (
        <ValidationError validationError={validationError} />
      )}

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 가능 회의실 목록 */}
      {isFilterComplete && (
        <Section>
          <div css={css`display: flex; align-items: baseline; gap: 6px;`}>
            <Text typography="t5" fontWeight="bold" color={colors.grey900}>
              예약 가능 회의실
            </Text>
            <Text typography="t7" fontWeight="medium" color={colors.grey500}>
              {availableRooms.length}개
            </Text>
          </div>
          <Spacing size={16} />

          {availableRooms.length === 0 ? (
            <div css={css`padding: 40px 0; text-align: center; background: ${colors.grey50}; border-radius: 14px;`}>
              <Text typography="t6" color={colors.grey500}>
                조건에 맞는 회의실이 없습니다.
              </Text>
            </div>
          ) : (
            <div css={css`display: flex; flex-direction: column; gap: 10px;`}>
              {availableRooms.map((room) => {
                const isSelected = selectedRoomId === room.id;
                return (
                  <MeetingRoomCard
                    key={room.id}
                    floor={room.floor}
                    capacity={room.capacity}
                    equipment={room.equipment}
                    name={room.name}
                    isSelected={isSelected}
                    onSelect={() => setSelectedRoomId(room.id)} />
                );
              })}
            </div>
          )}

          <Spacing size={16} />
          <Button display="full" onClick={() => {
            const submitResult = bookingSubmitSchema.safeParse({
              roomId: selectedRoomId ?? '',
              startTime,
              endTime,
            });

            if (!submitResult.success) {
              setErrorMessage(submitResult.error.issues[0].message);
              return;
            }

            const { roomId, startTime: start, endTime: end } = submitResult.data;

            createReservationMutation.mutateAsync({
              roomId,
              date,
              start,
              end,
              attendees,
              equipment,
            })
              .then((result) => {
                if ('ok' in result && result.ok) {
                  navigate('/', { state: { message: '예약이 완료되었습니다!' } });
                  return;
                }
                const errResult = result;
                setErrorMessage(errResult.message ?? '예약에 실패했습니다.');
                setSelectedRoomId(null);
              })
              .catch((err: unknown) => {
                let serverMessage = '예약에 실패했습니다.';
                if (axios.isAxiosError(err)) {
                  const data = err.response?.data as { message?: string } | undefined;
                  serverMessage = data?.message ?? serverMessage;
                }
                setErrorMessage(serverMessage);
                setSelectedRoomId(null);
              });
          }}
            disabled={createReservationMutation.isPending}>
            {createReservationMutation.isPending ? '예약 중...' : '확정'}
          </Button>
        </Section>
      )
      }

      <Spacing size={24} />
    </div >
  );
}

interface BookingFilter {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: string[];
  preferredFloor: number | null;
}

function getFloors(rooms: Room[]): number[] {
  return [...new Set(rooms.map((room) => room.floor))].sort((a, b) => a - b);
}

function hasEnoughCapacity(room: Room, attendees: number) {
  return room.capacity >= attendees;
}

function hasRequiredEquipment(room: Room, equipment: Equipment[]) {
  return equipment.every(eq => room.equipment.includes(eq));
}

function isOnPreferredFloor(room: Room, floor: number | null) {
  return floor === null || room.floor === floor;
}

function hasTimeConflict(room: Room, reservations: Reservation[], filter: BookingFilter) {
  return reservations.some(
    reservation => reservation.roomId === room.id
      && reservation.date === filter.date
      && reservation.start < filter.endTime
      && reservation.end > filter.startTime
  );
}

const byFloorThenName = (a: Room, b: Room) =>
  a.floor !== b.floor ? a.floor - b.floor : a.name.localeCompare(b.name);

export function getAvailableRooms(
  rooms: Room[],
  reservations: Reservation[],
  filter: BookingFilter
): Room[] {
  return rooms
    .filter(room =>
      hasEnoughCapacity(room, filter.attendees)
      && hasRequiredEquipment(room, filter.equipment as Equipment[])
      && isOnPreferredFloor(room, filter.preferredFloor)
      && !hasTimeConflict(room, reservations, filter)
    )
    .sort(byFloorThenName);
}

function NumberInput({ value, min, onChange, label }: { value: number; min: number; onChange: (value: ChangeEvent<HTMLInputElement>) => void; label: string }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      onChange={onChange}
      aria-label={label}
      css={css`
        box-sizing: border-box; font-size: 16px; font-weight: 500; line-height: 1.5; height: 48px;
        background-color: ${colors.grey50}; border-radius: 12px; color: ${colors.grey800};
        width: 100%; border: 1px solid ${colors.grey200}; padding: 0 16px; outline: none;
        transition: border-color 0.15s; &:focus { border-color: ${colors.blue500}; }
      `}
    />
  );
}

function validateBookingCondition(params: {
  startTime: string;
  endTime: string;
  attendees: number;
}): { isComplete: boolean; validationError: string | null } {
  const hasTimeInputs = params.startTime !== '' && params.endTime !== '';
  if (!hasTimeInputs) {
    return { isComplete: false, validationError: null };
  }

  const result = bookingConditionSchema.safeParse(params);
  if (result.success) {
    return { isComplete: true, validationError: null };
  }

  return { isComplete: false, validationError: result.error.issues[0].message };
}

function useCreateReservation() {
  const queryClient = useQueryClient();

  const createReservationMutation = useMutation(
    (data: { roomId: string; date: string; start: string; end: string; attendees: number; equipment: string[] }) =>
      createReservation(data),
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['reservations', variables.date] });
        queryClient.invalidateQueries({ queryKey: ['myReservations'] });
      },
    }
  );

  return { createReservationMutation };
}

function TimeSelect({ value, label, options, onChange }: { value: string; label: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <Select aria-label={label} value={value} onChange={e => onChange(e.target.value)}>
      <option value="">선택</option>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </Select>
  );
}

function FloorSelect({ value, floors, onChange, label }: {
  value: number | null;
  floors: number[];
  onChange: (value: number | null) => void;
  label: string;
}) {
  return (
    <Select
      value={value ?? ''}
      onChange={e => {
        const val = e.target.value;
        onChange(val === '' ? null : Number(val));
      }}
      aria-label={label}
    >
      <option value="">전체</option>
      {floors.map(f => (
        <option key={f} value={f}>{f}층</option>
      ))}
    </Select>
  );
}

function MultiSelectButton({ selected, onClick, label, value }: { selected: boolean; onClick: () => void; label: string; value: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={selected}
      css={css`   
        padding: 8px 16px; border-radius: 20px;
        border: 1px solid ${selected ? colors.blue500 : colors.grey200};
        background: ${selected ? colors.blue50 : colors.grey50};
        color: ${selected ? colors.blue600 : colors.grey700};
        font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.15s;
        &:hover { border-color: ${selected ? colors.blue500 : colors.grey400}; }
      `}
    >
      {value}
    </button>
  );
}