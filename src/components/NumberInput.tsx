import { css } from '@emotion/react';
import { ChangeEvent } from 'react';
import { colors } from '_tosslib/constants/colors';

export function NumberInput({ value, min, onChange, label }: { value: number; min: number; onChange: (value: ChangeEvent<HTMLInputElement>) => void; label: string }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      onChange={onChange}
      aria-label={label}
      css={css`
        box-sizing: border-box; font-size: 16px; font-weight: 500; line-height: 1.5; height: 48px;
        background-color: ${colors.grey50}; border-radius: 12px; color: ${colors.grey800};
        width: 100%; border: 1px solid ${colors.grey200}; padding: 0 16px; outline: none;
        transition: border-color 0.15s; &:focus { border-color: ${colors.blue500}; }
      `}
    />
  );
}
