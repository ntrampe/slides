import type { FilterOperator } from '../../../features/photos/types';

const btn = (active: boolean) =>
    `px-2 py-1 rounded transition-colors text-xs ${
        active
            ? 'bg-primary-500 text-white'
            : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
    }`;

export interface FilterOperatorToggleProps {
    value: FilterOperator;
    onChange: (op: FilterOperator) => void;
    className?: string;
}

export function FilterOperatorToggle({ value, onChange, className = '' }: FilterOperatorToggleProps) {
    return (
        <div className={`flex gap-1 ${className}`.trim()}>
            <button
                type="button"
                className={btn(value === 'AND')}
                onClick={() => onChange('AND')}
                title="Photos must be in ALL selected items"
            >
                ALL
            </button>
            <button
                type="button"
                className={btn(value === 'OR')}
                onClick={() => onChange('OR')}
                title="Photos can be in ANY of the selected items"
            >
                ANY
            </button>
        </div>
    );
}
