import { useQuery } from "@tanstack/react-query";
import { getMyReservations, getRooms } from "pages/remotes";
import { css } from "@emotion/react";
import { colors } from "_tosslib/constants/colors";
import { Button, ListRow, Text } from "_tosslib/components";
import { EQUIPMENT_LABELS } from "constants/equipment";



export function MyReservationCard({ reservation, right }: { reservation: { id: string; roomId: string; date: string; start: string; end: string; attendees: number; equipment: string[] }, right: React.ReactNode }) {
  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });

  return (
    <div
      css={css`padding: 14px 16px; border-radius: 14px; background: ${colors.grey50}; border: 1px solid ${colors.grey200};`}
    >
      <ListRow
        contents={
          <ListRow.Text2Rows
            top={getRoomName(rooms, reservation.roomId)}
            topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
            bottom={`${reservation.date} ${reservation.start}~${reservation.end} · ${reservation.attendees}명 · ${reservation.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'}`}
            bottomProps={{ typography: 't7', color: colors.grey600 }}
          />
        }
        right={right}
      />
    </div>
  );
}

function getRoomName(rooms: { id: string; name: string }[], roomId: string) {
  return rooms.find((room) => room.id === roomId)?.name ?? roomId;
}