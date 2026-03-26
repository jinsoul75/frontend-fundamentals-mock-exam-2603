import { getMyReservations } from "pages/remotes";
import { useQuery } from "@tanstack/react-query";
import { Text } from "_tosslib/components";
import { colors } from "_tosslib/constants/colors";

export function MyReservationCount() {
    const { data: myReservationList = [] } = useQuery({
        queryKey: ['myReservations'],
        queryFn: getMyReservations,
    });

    if (myReservationList.length === 0) return null;

    return (
        <Text typography="t7" fontWeight="medium" color={colors.grey500}>
            {myReservationList.length}건
        </Text>
    );
}