import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface StringArrayEditorProps {
    values: string[];
    onChange: (values: string[]) => void;
    label: string;
    placeholder?: string;
}

export const StringArrayEditor = ({
    values,
    onChange,
    label,
    placeholder = "Enter value..."
}: StringArrayEditorProps) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !values.includes(trimmed)) {
            onChange([...values, trimmed]);
            setInputValue('');
        }
    };

    const handleRemove = (index: number) => {
        onChange(values.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="mb-4">
            <span className="block mb-2">{label}</span>

            {/* Display existing values */}
            {values.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-1 bg-surface px-2 py-1 rounded text-sm text-text-primary"
                        >
                            <span className="font-mono">{value}</span>
                            <button
                                onClick={() => handleRemove(index)}
                                className="hover:bg-surface-hover rounded p-0.5"
                                aria-label="Remove"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input for adding new values */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="bg-background border border-border text-text-primary flex-1 p-2 rounded"
                />
                <button
                    onClick={handleAdd}
                    disabled={!inputValue.trim()}
                    className="bg-surface hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed px-3 rounded flex items-center gap-1 text-text-primary"
                >
                    <Plus size={16} />
                    Add
                </button>
            </div>

            {values.length === 0 && (
                <p className="text-xs text-text-tertiary mt-1">
                    No values configured. Leave empty to show all photos.
                </p>
            )}
        </div>
    );
};
