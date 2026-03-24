import { css } from "@emotion/react";
import { useQuery } from "@tanstack/react-query";
import { Spacing, Text } from "_tosslib/components";
import { colors } from "_tosslib/constants/colors";
import { EQUIPMENT_LABELS } from "constants/equipment";
import { HOUR_LABELS, TOTAL_MINUTES } from "constants/timeSlots";
import { getRooms, getReservations } from "pages/remotes";
import { useState } from "react";
import { formatHourForDisplay, timeToMinutes } from "utils/time";

export function ReservationStateSection({ date }: { date: string }) {
    const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });
    const { data: reservations = [] } = useQuery({ queryKey: ['reservations', date], queryFn: () => getReservations(date), enabled: !!date });

    const [activeReservation, setActiveReservation] = useState<string | null>(null);

    return (
        <div css={css`padding: 0 24px;`}>
            <Text typography="t5" fontWeight="bold" color={colors.grey900}>
                예약 현황
            </Text>
            <Spacing size={16} />

            <div css={css`background: ${colors.grey50}; border-radius: 14px; padding: 16px;`}>
                <div css={css`display: flex; align-items: flex-end; margin-bottom: 8px;`}>
                    <div css={css`width: 80px; flex-shrink: 0; padding-right: 8px;`} />
                    <div css={css`flex: 1; position: relative; height: 18px;`}>
                        {HOUR_LABELS.map(timeLabel => {
                            return (
                                <TimeLabels timeLabel={timeLabel} key={timeLabel} />
                            );
                        })}
                    </div>
                </div>
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

    )
}

function TimeLabels({ timeLabel }: { timeLabel: string }) {
    const left = (timeToMinutes(timeLabel) / TOTAL_MINUTES) * 100;

    return (
        <Text
            typography="t7"
            fontWeight="regular"
            color={colors.grey400}
            css={css`
              position: absolute; left: ${left}%; transform: translateX(-50%);
              font-size: 10px; letter-spacing: -0.3px;
            `}
        >
            {formatHourForDisplay(timeLabel)}
        </Text>
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

