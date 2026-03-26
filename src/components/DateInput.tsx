import { colors } from "_tosslib/constants/colors";
import { css } from "@emotion/react";

// 고민1: datepicker인데 value가 date타입이 아니라면 당황스럽나?
// 고민2: value, min이 Date라는걸 알 수 있나? -> 컴포넌트 이름에서 알 수 있다.
interface DateInputProps {
    value: string;
    min: string;
    onChange: (date: string) => void;
}

export function DateInput({ value, min, onChange }: DateInputProps) {
    return (
        <input
            type="date"
            value={value}
            min={min}
            onChange={e => onChange(e.target.value)}
            aria-label="날짜"
            css={css`
          box-sizing: border-box; font-size: 16px; font-weight: 500; line-height: 1.5; height: 48px;
          background-color: ${colors.grey50}; border-radius: 12px; color: ${colors.grey800};
          width: 100%; border: 1px solid ${colors.grey200}; padding: 0 16px; outline: none;
          transition: border-color 0.15s; &:focus { border-color: ${colors.blue500}; }
        `}
        />
    )
}
