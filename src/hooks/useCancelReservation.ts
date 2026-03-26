import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelReservation } from "pages/remotes";
// import { useState } from "react";

export function useCancelReservation({ onSuccess, onError }: {
    onSuccess: () => void;
    onError: () => void;
}) {
    const queryClient = useQueryClient();

    const cancelMutation = useMutation((id: string) => cancelReservation(id), {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] });
            queryClient.invalidateQueries({ queryKey: ['myReservations'] });
            onSuccess();
        },
        onError: () => {
            onError();
        },
    });

    const confirmAndCancel = (reservationId: string) => {
        if (!window.confirm('정말 취소하시겠습니까?')) return;
        cancelMutation.mutate(reservationId);
    };

    return { confirmAndCancel };
}