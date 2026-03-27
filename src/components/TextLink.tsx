import { css } from "@emotion/react";
import { colors } from "_tosslib/constants/colors";

export function TextLink({ onClick, children, ariaLabel }: { onClick: () => void; children: React.ReactNode; ariaLabel: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            css={css`
                background: none; border: none; padding: 0; cursor: pointer; font-size: 14px;
        color: ${colors.grey600}; &:hover { color: ${colors.grey900}; }
      `}
        >
            {children}
        </button>
    );
}