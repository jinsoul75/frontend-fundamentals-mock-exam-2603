import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useLocationStateMessage() {
    const location = useLocation();
    const navigate = useNavigate();

    const locationState = location.state as { message?: string } | null;

    useEffect(() => {
        if (locationState?.message) {
            window.history.replaceState({}, '');
        }
    }, [locationState]);

    const message = locationState?.message
        ? { type: 'success' as const, text: locationState.message }
        : null;

    const setMessage = (msg: { type: 'success' | 'error'; text: string }) => {
        navigate('.', {
            replace: true,
            state: { message: msg.text, type: msg.type },
        });
    };

    return { message, setMessage };
}
