import { Select } from '_tosslib/components';

export function TimeSelect({ value, label, options, onChange }: { value: string; label: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <Select aria-label={label} value={value} onChange={e => onChange(e.target.value)}>
      <option value="">선택</option>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </Select>
  );
}
