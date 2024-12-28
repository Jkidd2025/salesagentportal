import { Input } from "@/components/ui/input";

interface AccountSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function AccountSearch({ value, onChange }: AccountSearchProps) {
  return (
    <Input
      placeholder="Search accounts..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-sm"
    />
  );
}