import { css } from '@emotion/react';
import { useState } from 'react';
import { Top, Spacing, Border } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getTodayDateString } from 'utils/date';
import { DateSelectSection } from './components/DateSelectSection';
import { ReservationStateSection } from './components/ReservationStateSection';
import { MyReservationSection } from './components/MyReservationSection';
import { ReservationButtonSection } from './components/ReservationButtonSection';

export function ReservationStatusPage() {
  const [date, setDate] = useState(getTodayDateString());

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      {/* 날짜 선택 */}
      <DateSelectSection date={date} setDate={setDate} />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <ReservationStateSection date={date} />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 내 예약 목록 */}
      <MyReservationSection />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <ReservationButtonSection />
      <Spacing size={24} />
    </div>
  );
}