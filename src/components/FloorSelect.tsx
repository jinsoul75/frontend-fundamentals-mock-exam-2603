import { Select } from '_tosslib/components';

export function FloorSelect({ value, floors, onChange, label }: {
  value: number | null;
  floors: number[];
  onChange: (value: number | null) => void;
  label: string;
}) {
  return (
    <Select
      value={value ?? ''}
      onChange={e => {
        const val = e.target.value;
        onChange(val === '' ? null : Number(val));
      }}
      aria-label={label}
    >
      <option value="">전체</option>
      {floors.map(f => (
        <option key={f} value={f}>{f}층</option>
      ))}
    </Select>
  );
}
