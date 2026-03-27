import { css } from "@emotion/react";
import { colors } from "_tosslib/constants/colors";

export function PageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
            {children}
        </div>
    );
}