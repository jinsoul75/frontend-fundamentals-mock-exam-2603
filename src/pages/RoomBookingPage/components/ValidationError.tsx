import { css } from "@emotion/react";
import { Spacing } from "_tosslib/components";
import { colors } from "_tosslib/constants/colors";

export function ValidationError({ validationError }: { validationError: string }) {
    return (
        <div css={css`padding: 0 24px;`}>
            <Spacing size={8} />
            <span css={css`color: ${colors.red500}; font-size: 14px;`} role="alert">{validationError}</span>
        </div>
    );
}