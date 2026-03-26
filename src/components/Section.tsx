import { css } from "@emotion/react";

export function Section({ children }: { children: React.ReactNode }) {
    return (
        <div css={css`padding: 0 24px;`}>
            {children}
        </div>
    )
}