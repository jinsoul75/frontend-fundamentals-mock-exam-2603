import { useQuery } from "@tanstack/react-query";
import { getMyReservations, getRooms } from "pages/remotes";
import { useCancelReservation } from "hooks/useCancelReservation";
import { css } from "@emotion/react";
import { colors } from "_tosslib/constants/colors";
import { Button, ListRow, Spacing, Text } from "_tosslib/components";
import { EQUIPMENT_LABELS } from "constants/equipment";

export function MyReservationSection({ setMessage }: { setMessage: (message: { type: 'success' | 'error'; text: string } | null) => void }) {
    const { data: myReservationList = [] } = useQuery({ queryKey: ['myReservations'], queryFn: getMyReservations });
  
    const { handleCancel } = useCancelReservation(setMessage);

    return (
      <> 
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
                  key={reservation.id}
                  reservation={reservation}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </div>
      </>
    )
  }
  
  function MyReservationCard({ reservation, onCancel }: { reservation: { id: string; roomId: string; date: string; start: string; end: string; attendees: number; equipment: string[] }, onCancel: (reservationId: string) => void }) {
    const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });
  
    const getRoomName = (roomId: string) => rooms.find((r: { id: string; name: string }) => r.id === roomId)?.name ?? roomId;
  
    return (
      <div
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
            <Button
              type="danger"
              style="weak"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onCancel(reservation.id);
              }}
            >
              취소
            </Button>
          }
        />
      </div>
    );
  }