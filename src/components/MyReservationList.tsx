import { useQuery } from "@tanstack/react-query";
import { getMyReservations, getRooms } from "pages/remotes";
import { css } from "@emotion/react";
import { colors } from "_tosslib/constants/colors";
import { Button, ListRow, Text } from "_tosslib/components";
import { EQUIPMENT_LABELS } from "constants/equipment";



export function MyReservationCard({ roomName, date, startTime, endTime, attendees, equipment, onCancel }: { roomName: string; date: string; startTime: string; endTime: string; attendees: number; equipment: string[]; onCancel: () => void }) {
  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });

  return (
    <div
      css={css`padding: 14px 16px; border-radius: 14px; background: ${colors.grey50}; border: 1px solid ${colors.grey200};`}
    >
      <ListRow
        contents={
          <ListRow.Text2Rows
            top={roomName}
            topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
            bottom={`${date} ${startTime}~${endTime} · ${attendees}명 · ${equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'}`}
            bottomProps={{ typography: 't7', color: colors.grey600 }}
          />
        }
        right={<Button type="danger" style="weak" size="small" onClick={onCancel}>취소</Button>}
      />
    </div>
  );
}