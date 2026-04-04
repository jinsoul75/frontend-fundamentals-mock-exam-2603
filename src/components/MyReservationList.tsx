import { useQuery } from "@tanstack/react-query";
import { getMyReservations, getRooms } from "pages/remotes";
import { css } from "@emotion/react";
import { colors } from "_tosslib/constants/colors";
import { Button, ListRow, Text } from "_tosslib/components";
import { EQUIPMENT_LABELS } from "constants/equipment";
import { getRoomName } from "pages/ReservationStatusPage/utils/getRoomName";
import { Equipment } from "_tosslib/server/types";

export function MyReservationList({ onCancel }: { onCancel: (reservationId: string) => void }) {
  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });
  const { data: myReservations = [] } = useQuery({ queryKey: ['myReservations'], queryFn: getMyReservations });

  return (
    myReservations.map((reservation) => (
    <div
      css={css`padding: 14px 16px; border-radius: 14px; background: ${colors.grey50}; border: 1px solid ${colors.grey200};`}
    >
      <ListRow
        contents={
          <ListRow.Text2Rows
            top={getRoomName(rooms, reservation.roomId)}
            topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
            bottom={`${reservation.date} ${reservation.start}~${reservation.end} · ${reservation.attendees}명 · ${reservation.equipment.map((e: string) => EQUIPMENT_LABELS[e as Equipment] ).join(', ') || '장비 없음'}`}
            bottomProps={{ typography: 't7', color: colors.grey600 }}
          />
        }
        right={<Button type="danger" style="weak" size="small" onClick={() => onCancel(reservation.id)}>취소</Button>}
      />
    </div>
    ))
  );
}