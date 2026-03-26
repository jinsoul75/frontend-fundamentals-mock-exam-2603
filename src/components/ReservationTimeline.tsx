import { css } from "@emotion/react";
import { useQuery } from "@tanstack/react-query";
import { Text } from "_tosslib/components";
import { colors } from "_tosslib/constants/colors";
import { EQUIPMENT_LABELS } from "constants/equipment";
import { HOUR_LABELS, TOTAL_MINUTES } from "constants/timeSlots";
import { getRooms, getReservations } from "pages/remotes";
import { useState } from "react";
import { timeToMinutes } from "utils/time";

export function ReservationTimeline({ targetDate }: { targetDate: string }) {
    const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });
    const { data: reservations = [] } = useQuery({ queryKey: ['reservations', targetDate], queryFn: () => getReservations(targetDate), enabled: !!targetDate });

    const [activeReservation, setActiveReservation] = useState<string | null>(null);

    return (
        <div css={css`background: ${colors.grey50}; border-radius: 14px; padding: 16px;`}>
            {/* 시간 헤더 */}
            <TimelineHeader />

            {/* 방별 예약 바 */}
            {rooms.map((room, index) => (
                <RoomRow key={room.id} name={room.name} isFirst={index === 0}>
                    {reservations
                        .filter(reservation => reservation.roomId === room.id)
                        .map(reservation => {
                            const isMatchedReservation = activeReservation === reservation.id
                            return (
                                <ReservationBar
                                    key={reservation.id}
                                    reservation={reservation}
                                    roomName={room.name}
                                    isActive={isMatchedReservation}
                                    onToggle={() => setActiveReservation(isMatchedReservation ? null : reservation.id)}
                                />
                            )
                        })}
                </RoomRow>
            ))}
        </div>
    )
}

function TimelineHeader() {
    return (
        <div css={css`display: flex; align-items: flex-end; margin-bottom: 8px;`}>
            <div css={css`width: 80px; flex-shrink: 0; padding-right: 8px;`} />
            <div css={css`flex: 1; position: relative; height: 18px;`}>
                {HOUR_LABELS.map(time => {
                    return (
                        <TimeLabel time={time} key={time} />
                    );
                })}
            </div>
        </div>
    );
}

function TimeLabel({ time }: { time: string }) {
    const left = (timeToMinutes(time) / TOTAL_MINUTES) * 100;

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
            {time.slice(0, 2)}
        </Text>
    );
}

function RoomRow({ name, isFirst, children }: { name: string, isFirst: boolean, children: React.ReactNode }) {
    return (
        <div css={css`display: flex; align-items: center; height: 32px; ${!isFirst ? 'margin-top: 4px;' : ''}`}>
            <div css={css`width: 80px; flex-shrink: 0; padding-right: 8px;`}>
                <Text typography="t7" fontWeight="medium" color={colors.grey700}
                    ellipsisAfterLines={1} css={css`font-size: 12px;`}
                >
                    {name}
                </Text>
            </div>
            <div css={css`flex: 1; height: 24px; background: ${colors.white}; border-radius: 6px; position: relative; overflow: visible;`}>
                {children}
            </div>
        </div>
    );
}

function ReservationBar({ reservation, roomName, isActive, onToggle }: { reservation: { id: string; roomId: string; date: string; start: string; end: string; attendees: number; equipment: string[] }, roomName: string, isActive: boolean, onToggle: () => void }) {
    const left = (timeToMinutes(reservation.start) / TOTAL_MINUTES) * 100;
    const width = ((timeToMinutes(reservation.end) - timeToMinutes(reservation.start)) / TOTAL_MINUTES) * 100;
    return (
        <div css={css`position: absolute; left: ${left}%; width: ${width}%; height: 100%;`}>
            <div
                role="button"
                aria-label={`${roomName} ${reservation.start}-${reservation.end} 예약 상세`}
                onClick={onToggle}
                css={css`
            width: 100%; height: 100%; background: ${colors.blue400}; border-radius: 4px;
            opacity: ${isActive ? 1 : 0.75}; cursor: pointer; transition: opacity 0.15s;
            &:hover { opacity: 1; }
          `}
            />
            {isActive && (
                <Tooltip>
                    <div>{reservation.start} ~ {reservation.end}</div>
                    <div>{reservation.attendees}명</div>
                    {reservation.equipment.length > 0 && (
                        <div>{reservation.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ')}</div>
                    )}
                </Tooltip>
            )}
        </div>
    );
}

function Tooltip({ children }: { children: React.ReactNode }) {
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
            {children}
        </div>
    );
}

