import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Top, Spacing, Border, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getTodayDateString } from 'utils/date';
import { DateInput } from './components/DateInput';
import { MyReservationSection } from './components/MyReservationSection';
import { GoToBookingButtonSection } from './components/GoToBookingButtonSection';
import { ReservationStateSection } from './components/ReservationStateSection';
import { useLocation } from 'react-router-dom';
import { MessageBanner } from './components/MessageBanner';

export function ReservationStatusPage() {
  const [date, setDate] = useState(getTodayDateString());

  const location = useLocation();
  const locationState = location.state as { message?: string } | null;

  useEffect(() => {
    if (locationState?.message) {
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    locationState?.message ? { type: 'success', text: locationState.message } : null
  );

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      {/* 날짜 선택 */}
      <div css={css`padding: 0 24px;`}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          날짜 선택
        </Text>
        <Spacing size={16} />
        <div css={css`display: flex; flex-direction: column; gap: 6px;`}>
          <DateInput
            value={date}
            min={getTodayDateString()}
            onChange={setDate}
          />
        </div>
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <ReservationStateSection date={date} />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 메시지 배너 */}
      {message && (
        <MessageBanner message={message} />
      )}

      {/* 내 예약 목록 */}
      <MyReservationSection setMessage={setMessage} />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <GoToBookingButtonSection />
      <Spacing size={24} />
    </div>
  );
}