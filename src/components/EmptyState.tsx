import { css } from "@emotion/react";
import { colors } from "_tosslib/constants/colors";
import { Text } from "_tosslib/components";

export function EmptyState({ message }: { message: string }) {
    return (
        <div css={css`
        padding: 40px 0; text-align: center;
        background: ${colors.grey50}; border-radius: 14px;
      `}>
            <Text typography="t6" color={colors.grey500}>{message}</Text>
        </div>
    );
}