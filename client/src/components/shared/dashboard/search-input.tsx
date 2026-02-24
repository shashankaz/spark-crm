import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="relative w-1/3">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4.5 text-secondary-foreground dark:text-secondary" />
    </div>
  );
};
