import type { FilterOperator } from '../../../features/photos/types';
import { SegmentedControl } from '../SegmentedControl';

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
        <SegmentedControl<FilterOperator>
            ariaLabel="Filter match mode"
            className={className}
            disabled={disabled}
            value={value}
            onChange={onChange}
            options={[
                {
                    value: 'AND',
                    label: 'All',
                    title: 'Match all selected items in this group',
                },
                {
                    value: 'OR',
                    label: 'Any',
                    title: 'Match any selected item in this group',
                },
            ]}
        />
    );
}
