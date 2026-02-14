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
                            className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded text-sm"
                        >
                            <span className="font-mono">{value}</span>
                            <button
                                onClick={() => handleRemove(index)}
                                className="hover:bg-slate-600 rounded p-0.5"
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
                    className="bg-slate-800 flex-1 p-2 rounded"
                />
                <button
                    onClick={handleAdd}
                    disabled={!inputValue.trim()}
                    className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 rounded flex items-center gap-1"
                >
                    <Plus size={16} />
                    Add
                </button>
            </div>
            
            {values.length === 0 && (
                <p className="text-xs text-slate-400 mt-1">
                    No values configured. Leave empty to show all photos.
                </p>
            )}
        </div>
    );
};
