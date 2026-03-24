import { css } from "@emotion/react";
import { Spacing, Text } from "_tosslib/components";
import { colors } from "_tosslib/constants/colors";

export function ErrorMessage({ errorMessage }: { errorMessage: string }) {
    return (
        <div css={css`padding: 0 24px;`}>
            <Spacing size={12} />
            <div
                css={css`
          padding: 10px 14px; border-radius: 10px; background: ${colors.red50};
          display: flex; align-items: center; gap: 8px;
        `}
            >
                <Text typography="t7" fontWeight="medium" color={colors.red500}>{errorMessage}</Text>
            </div>
        </div>
    );
}
