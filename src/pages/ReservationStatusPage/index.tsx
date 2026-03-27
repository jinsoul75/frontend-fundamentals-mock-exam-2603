import { css } from '@emotion/react';
import { useState } from 'react';
import { Top, Spacing, Border, Text, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getTodayDateString } from 'utils/date';
import { DateInput } from '../../components/DateInput';
import { MyReservationCard } from '../../components/MyReservationList';
import { ReservationTimeline } from '../../components/ReservationTimeline';
import { MessageBanner } from '../../components/MessageBanner';
import { Section } from 'components/Section';
import { useCancelReservation } from './hooks/useCancelReservation';
import { useLocationStateMessage } from './hooks/useLocationStateMessage';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyReservations, getRooms } from 'pages/remotes';
import { getRoomName } from './utils/utils';

export function ReservationStatusPage() {
  const navigate = useNavigate();

  const [date, setDate] = useState(getTodayDateString());

  const { data: myReservations = [] } = useQuery({ queryKey: ['myReservations'], queryFn: getMyReservations });
  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });

  const { message, setMessage } = useLocationStateMessage();

  const { confirmAndCancel } = useCancelReservation({
    onSuccess: () => setMessage({ type: 'success', text: '예약이 취소되었습니다.' }),
    onError: () => setMessage({ type: 'error', text: '예약 취소에 실패했습니다.' }),
  });

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      {/* 날짜 선택 */}
      <Section >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>날짜 선택</Text>
        <Spacing size={16} />
        <DateInput
          value={date}
          min={getTodayDateString()}
          onChange={setDate}
        />
      </Section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <Section >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>예약 현황</Text>
        <Spacing size={16} />
        <ReservationTimeline targetDate={date} />
      </Section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 메시지 배너 */}
      {message && (
        <MessageBanner message={message} />
      )}

      {/* 내 예약 목록 */}
      <Section>
        <div css={css`display: flex; align-items: baseline; gap: 6px;`}>
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            내 예약
          </Text>
          {myReservations.length > 0 && (
            <Text typography="t7" fontWeight="medium" color={colors.grey500}>
              {myReservations.length}건
            </Text>
          )}
        </div>
        <Spacing size={16} />

        {myReservations.length === 0 ? (
          <div css={css`padding: 40px 0; text-align: center; background: ${colors.grey50}; border-radius: 14px;`}>
            <Text typography="t6" color={colors.grey500}>
              예약 내역이 없습니다.
            </Text>
          </div>
        ) : (
          <div css={css`display: flex; flex-direction: column; gap: 10px;`}>
            {myReservations.map((reservation) => (
              <MyReservationCard
                key={reservation.id}
                roomName={getRoomName(rooms, reservation.roomId)}
                date={reservation.date}
                startTime={reservation.start}
                endTime={reservation.end}
                attendees={reservation.attendees}
                equipment={reservation.equipment}
                onCancel={() => confirmAndCancel(reservation.id)}
              />
            ))}
          </div>
        )}
      </Section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <Section>
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </Section>
      <Spacing size={24} />
    </div>
  );
}
