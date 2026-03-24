import { css } from "@emotion/react";
import { ListRow, Text } from "_tosslib/components";
import { colors } from "_tosslib/constants/colors";
import { EQUIPMENT_LABELS } from "constants/equipment";

export function MeetingRoomCard({ room, isSelected, setSelectedRoomId }: { room: { id: string; name: string; floor: number; capacity: number; equipment: string[] }, isSelected: boolean, setSelectedRoomId: (id: string) => void }) {
    return (
        <div
            onClick={() => setSelectedRoomId(room.id)}
            role="button"
            aria-pressed={isSelected}
            aria-label={room.name}
            css={css`
        cursor: pointer; padding: 14px 16px; border-radius: 14px;
        border: 2px solid ${isSelected ? colors.blue500 : colors.grey200};
        background: ${isSelected ? colors.blue50 : colors.white};
        transition: all 0.15s;
        &:hover { border-color: ${isSelected ? colors.blue500 : colors.grey300}; }
      `}
        >
            <ListRow
                contents={
                    <ListRow.Text2Rows
                        top={room.name}
                        topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                        bottom={`${room.floor}층 · ${room.capacity}명 · ${room.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ')}`}
                        bottomProps={{ typography: 't7', color: colors.grey600 }}
                    />
                }
                right={
                    isSelected ? (
                        <Text typography="t7" fontWeight="bold" color={colors.blue500}>선택됨</Text>
                    ) : undefined
                }
            />
        </div>
    );
}