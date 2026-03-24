import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelReservation } from "pages/remotes";

export function useCancelWithConfirm(setMessage: (message: { type: 'success' | 'error'; text: string } | null) => void) {
    const queryClient = useQueryClient();

    const cancelMutation = useMutation((id: string) => cancelReservation(id), {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] });
            queryClient.invalidateQueries({ queryKey: ['myReservations'] });
            setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
        },
        onError: () => {
            setMessage({ type: 'error', text: '취소에 실패했습니다.' });
        },
    });

    const handleCancel = (reservationId: string) => {
        if (!window.confirm('정말 취소하시겠습니까?')) return;
        cancelMutation.mutate(reservationId);
    };

    return { handleCancel };
}