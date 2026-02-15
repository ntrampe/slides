import { Search } from 'lucide-react';
import type { SearchInputProps } from './types';

export const SearchInput = ({
    value,
    onChange,
    onFocus,
    placeholder,
    disabled
}: SearchInputProps) => {
    return (
        <div className="relative">
            <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary"
                size={16}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
                placeholder={placeholder}
                className="bg-surface border border-border text-text-primary w-full p-2 pl-10 rounded"
                disabled={disabled}
            />
        </div>
    );
};
