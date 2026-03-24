import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { Button } from "_tosslib/components";

export function ReservationButtonSection() {
    const navigate = useNavigate();

    return (
        <div css={css`padding: 0 24px;`}>
            <Button display="full" onClick={() => navigate('/booking')}>
                예약하기
            </Button>
        </div>
    );
}