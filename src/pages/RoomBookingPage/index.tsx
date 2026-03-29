import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getRooms, getReservations } from 'pages/remotes';
import { EQUIPMENT_LABELS, ALL_EQUIPMENT } from 'constants/equipment';
import { TIME_SLOTS } from 'constants/timeSlots';
import { getTodayDateString } from 'utils/date';
import { ErrorMessage, MeetingRoomCard, ValidationError, DateInput, Section, NumberInput, TimeSelect, FloorSelect, MultiSelectButton, TextLink, Flex, EmptyState } from 'components';
import { bookingSubmitSchema, validateBookingCondition } from './schemas/bookingSchema';
import { useBookingSearchParams } from './hooks/useBookingSearchParams';
import { getAvailableRooms, getFloors } from './utils/getAvailableRooms';
import { useCreateReservation } from './hooks/useCreateReservation';
import { PageLayout } from 'pages/PageLayout';

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
  const { createReservationMutation } = useCreateReservation({
    onSuccess: () => {
      navigate('/', { state: { message: '예약이 완료되었습니다!' } });
    },
    onError: (message) => {
      setErrorMessage(message);
      setSelectedRoomId(null);
    },
  });

  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });
  const { data: reservations = [] } = useQuery({ queryKey: ['reservations', date], queryFn: () => getReservations(date), enabled: !!date });

  // 입력 검증
  const { isComplete: isFilterComplete, validationError } = validateBookingCondition({ startTime, endTime, attendees });

  const availableRooms = isFilterComplete
    ? getAvailableRooms(rooms, reservations, { ...params }) : [];

  return (
    <PageLayout>
      <Flex css={css`padding: 12px 24px 0;`}>
        <TextLink onClick={() => navigate('/')} ariaLabel="뒤로가기">
          ← 예약 현황으로
        </TextLink>
      </Flex>

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
        <Flex direction="column" gap={6}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>날짜</Text>
          <DateInput
            value={date}
            min={getTodayDateString()}
            onChange={(value) => setParams({ date: value })}
          />
        </Flex>
        <Spacing size={14} />

        {/* 시간 */}
        <Flex direction="row" gap={12}>
          <Flex direction="column" gap={6} flex={1}>
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>시작 시간</Text>
            <TimeSelect
              value={startTime}
              label="시작 시간"
              options={TIME_SLOTS.slice(0, -1)}
              onChange={value => setParams({ startTime: value })}
            />
          </Flex>
          <Flex direction="column" gap={6} flex={1}>
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>종료 시간</Text>
            <TimeSelect
              value={endTime}
              label="종료 시간"
              options={TIME_SLOTS.slice(1)}
              onChange={value => setParams({ endTime: value })}
            />
          </Flex>
        </Flex>
        <Spacing size={14} />

        {/* 참석 인원 + 선호 층 */}
        <Flex direction="row" gap={12}>
          <Flex direction="column" gap={6} flex={1}>
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>참석 인원</Text>
            <NumberInput
              value={attendees}
              min={1}
              onChange={e => setParams({ attendees: Math.max(1, Number(e.target.value)) })}
              label="참석 인원"
            />
          </Flex>
          <Flex direction="column" gap={6} flex={1}>
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>선호 층</Text>
            <FloorSelect
              value={preferredFloor}
              floors={getFloors(rooms)}
              onChange={value => setParams({ floor: value })}
              label="선호 층"
            />
          </Flex>
        </Flex>
        <Spacing size={14} />

        {/* 장비 */}
        <Flex direction="column" gap={6}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>필요 장비</Text>
          <Spacing size={8} />
          <Flex direction="row" gap={8} wrap>
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
          </Flex>
        </Flex>
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
          <Flex align="baseline" gap={6}>
            <Text typography="t5" fontWeight="bold" color={colors.grey900}>
              예약 가능 회의실
            </Text>
            <Text typography="t7" fontWeight="medium" color={colors.grey500}>
              {availableRooms.length}개
            </Text>
          </Flex>
          <Spacing size={16} />

          {availableRooms.length === 0 ? (
            <EmptyState message="조건에 맞는 회의실이 없습니다." />
          ) : (
            <Flex direction="column" gap={10}>
              {availableRooms.map((room) => {
                const isSelected = selectedRoomId === room.id;
                return (
                  <MeetingRoomCard
                    key={room.id}
                    room={room}
                    isSelected={isSelected}
                    onSelect={() => setSelectedRoomId(room.id)}
                  />
                );
              })}
            </Flex>
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

            createReservationMutation.mutate({
              roomId,
              date,
              start,
              end,
              attendees,
              equipment,
            })
          }}
            disabled={createReservationMutation.isPending}>
            {createReservationMutation.isPending ? '예약 중...' : '확정'}
          </Button>
        </Section>
      )
      }

      <Spacing size={24} />
    </PageLayout >
  );
}