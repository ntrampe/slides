import type { FilterOperator } from '../../../features/photos/types';

const segment = (active: boolean) =>
    `flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
        active
            ? 'bg-primary-500 text-white shadow-sm'
            : 'text-text-secondary hover:text-text-primary'
    }`;

export interface FilterOperatorToggleProps {
    value: FilterOperator;
    onChange: (op: FilterOperator) => void;
    className?: string;
    disabled?: boolean;
}

export function FilterOperatorToggle({
    value,
    onChange,
    className = '',
    disabled = false,
}: FilterOperatorToggleProps) {
    return (
        <div
            className={`inline-flex rounded-lg border border-border bg-surface p-0.5 gap-0.5 ${className}`.trim()}
            role="group"
            aria-label="Filter match mode"
        >
            <button
                type="button"
                disabled={disabled}
                className={`${segment(value === 'AND')} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => onChange('AND')}
                title="Match all selected items in this group"
            >
                All
            </button>
            <button
                type="button"
                disabled={disabled}
                className={`${segment(value === 'OR')} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => onChange('OR')}
                title="Match any selected item in this group"
            >
                Any
            </button>
        </div>
    );
}
