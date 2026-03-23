import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Border, Button, Text, ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getRooms, getReservations, getMyReservations, cancelReservation } from 'pages/remotes';
import { EQUIPMENT_LABELS } from 'constants/equipment';
import { HOUR_LABELS, TOTAL_MINUTES } from 'constants/timeSlots';
import { formatDate } from 'utils/date';
import { timeToMinutes } from 'utils/time';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(formatDate(new Date()));

  const locationState = location.state as { message?: string } | null;
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    locationState?.message ? { type: 'success', text: locationState.message } : null
  );

  useEffect(() => {
    if (locationState?.message) {
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  const { data: myReservationList = [] } = useQuery(['myReservations'], getMyReservations);

  const cancelMutation = useMutation((id: string) => cancelReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations']);
      queryClient.invalidateQueries(['myReservations']);
    },
  });

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
    }
  };

  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  const { data: rooms = [] } = useQuery(['rooms'], getRooms);
  const { data: reservations = [] } = useQuery(['reservations', date], () => getReservations(date), { enabled: !!date });

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
        <DatePicker value={date} onChange={setDate} />
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <div css={css`padding: 0 24px;`}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 현황
        </Text>
        <Spacing size={16} />

        <div css={css`background: ${colors.grey50}; border-radius: 14px; padding: 16px;`}>
          <ReservationStatusTimeHeader />

          {rooms.map((room: { id: string; name: string }, index: number) => {
            const roomReservations = reservations.filter((r: { roomId: string }) => r.roomId === room.id);

            return (
              <div
                key={room.id}
                css={css`display: flex; align-items: center; height: 32px; ${index > 0 ? 'margin-top: 4px;' : ''}`}
              >
                <div css={css`width: 80px; flex-shrink: 0; padding-right: 8px;`}>
                  <Text typography="t7" fontWeight="medium" color={colors.grey700} ellipsisAfterLines={1}
                    css={css`font-size: 12px;`}
                  >
                    {room.name}
                  </Text>
                </div>
                <div css={css`flex: 1; height: 24px; background: ${colors.white}; border-radius: 6px; position: relative; overflow: visible;`}>
                  {roomReservations.map((res: { id: string; start: string; end: string; attendees: number; equipment: string[] }) => {
                    const left = (timeToMinutes(res.start) / TOTAL_MINUTES) * 100;
                    const width = ((timeToMinutes(res.end) - timeToMinutes(res.start)) / TOTAL_MINUTES) * 100;
                    const isActive = activeReservation === res.id;
                    return (
                      <div key={res.id} css={css`position: absolute; left: ${left}%; width: ${width}%; height: 100%;`}>
                        <div
                          role="button"
                          aria-label={`${room.name} ${res.start}-${res.end} 예약 상세`}
                          onClick={() => setActiveReservation(isActive ? null : res.id)}
                          css={css`
                      width: 100%; height: 100%; background: ${colors.blue400}; border-radius: 4px;
                      opacity: ${isActive ? 1 : 0.75}; cursor: pointer; transition: opacity 0.15s;
                      &:hover { opacity: 1; }
                    `}
                        />
                        {isActive && (
                          <ReservationDetailTooltip reservation={res} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 메시지 배너 */}
      {message && (
        <MessageBanner message={message} />
      )}

      {/* 내 예약 목록 */}
      <div css={css`padding: 0 24px;`}>
        <div css={css`display: flex; align-items: baseline; gap: 6px;`}>
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            내 예약
          </Text>
          {myReservationList.length > 0 && (
            <Text typography="t7" fontWeight="medium" color={colors.grey500}>
              {myReservationList.length}건
            </Text>
          )}
        </div>
        <Spacing size={16} />

        {myReservationList.length === 0 ? (
          <div css={css`padding: 40px 0; text-align: center; background: ${colors.grey50}; border-radius: 14px;`}>
            <Text typography="t6" color={colors.grey500}>
              예약 내역이 없습니다.
            </Text>
          </div>
        ) : (
          <div css={css`display: flex; flex-direction: column; gap: 10px;`}>
            {myReservationList.map((reservation: { id: string; roomId: string; date: string; start: string; end: string; attendees: number; equipment: string[] }) => (
              <MyReservationCard
                reservation={reservation}
                renderCancelButton={() => (
                  <Button
                    type="danger"
                    style="weak"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('정말 취소하시겠습니까?')) {
                        handleCancel(reservation.id);
                      }
                    }}
                  >
                    취소
                  </Button>
                )}
              />
            ))}
          </div>
        )}
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <div css={css`padding: 0 24px;`}>
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}

function DatePicker({ value, onChange }: { value: string, onChange: (date: string) => void }) {
  return (
    <div css={css`display: flex; flex-direction: column; gap: 6px;`}>
      <input
        type="date"
        value={value}
        min={formatDate(new Date())}
        onChange={e => onChange(e.target.value)}
        aria-label="날짜"
        css={css`
        box-sizing: border-box; font-size: 16px; font-weight: 500; line-height: 1.5; height: 48px;
        background-color: ${colors.grey50}; border-radius: 12px; color: ${colors.grey800};
        width: 100%; border: 1px solid ${colors.grey200}; padding: 0 16px; outline: none;
        transition: border-color 0.15s; &:focus { border-color: ${colors.blue500}; }
      `}
      />
    </div>
  );
}

function ReservationStatusTimeHeader() {
  return (
    <div css={css`display: flex; align-items: flex-end; margin-bottom: 8px;`}>
      <div css={css`width: 80px; flex-shrink: 0; padding-right: 8px;`} />
      <div css={css`flex: 1; position: relative; height: 18px;`}>
        {HOUR_LABELS.map(t => {
          const left = (timeToMinutes(t) / TOTAL_MINUTES) * 100;
          return (
            <Text
              key={t}
              typography="t7"
              fontWeight="regular"
              color={colors.grey400}
              css={css`
            position: absolute; left: ${left}%; transform: translateX(-50%);
            font-size: 10px; letter-spacing: -0.3px;
          `}
            >
              {t.slice(0, 2)}
            </Text>
          );
        })}
      </div>
    </div>
  )
}

function MyReservationCard({ reservation, renderCancelButton }: { reservation: { id: string; roomId: string; date: string; start: string; end: string; attendees: number; equipment: string[] }, renderCancelButton: () => React.ReactNode }) {
  const { data: rooms = [] } = useQuery(['rooms'], getRooms);
  const getRoomName = (roomId: string) => rooms.find((r: { id: string; name: string }) => r.id === roomId)?.name ?? roomId;

  return (
    <div
      key={reservation.id}
      css={css`padding: 14px 16px; border-radius: 14px; background: ${colors.grey50}; border: 1px solid ${colors.grey200};`}
    >
      <ListRow
        contents={
          <ListRow.Text2Rows
            top={getRoomName(reservation.roomId)}
            topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
            bottom={`${reservation.date} ${reservation.start}~${reservation.end} · ${reservation.attendees}명 · ${reservation.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'}`}
            bottomProps={{ typography: 't7', color: colors.grey600 }}
          />
        }
        right={
          renderCancelButton()
        }
      />
    </div>
  );
}

function MessageBanner({ message }: { message: { type: 'success' | 'error'; text: string } }) {
  return (
    <div css={css`padding: 0 24px;`}>
      <div
        css={css`
        padding: 10px 14px; border-radius: 10px;
        background: ${message.type === 'success' ? colors.blue50 : colors.red50};
        display: flex; align-items: center; gap: 8px;
      `}
      >
        <Text
          typography="t7"
          fontWeight="medium"
          color={message.type === 'success' ? colors.blue600 : colors.red500}
        >
          {message.text}
        </Text>
      </div>
      <Spacing size={12} />
    </div>
  );
}

function ReservationDetailTooltip({ reservation }: { reservation: { start: string; end: string; attendees: number; equipment: string[] } }) {
  return (
    <div
      role="tooltip"
      css={css`
        position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 6px;
        background: ${colors.grey900}; color: ${colors.white}; padding: 8px 12px;
        border-radius: 8px; font-size: 12px; white-space: nowrap; z-index: 10;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); line-height: 1.6;
      `}
    >
      <div>{reservation.start} ~ {reservation.end}</div>
      <div>{reservation.attendees}명</div>
      {reservation.equipment.length > 0 && (
        <div>{reservation.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ')}</div>
      )}
    </div>
  );
}
