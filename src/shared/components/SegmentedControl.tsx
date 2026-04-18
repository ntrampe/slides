import { useId, type ReactNode } from 'react';

export type SegmentedOption<T extends string> = {
    value: T;
    label: ReactNode;
    icon?: ReactNode;
    title?: string;
    disabled?: boolean;
};

export type SegmentedSemantics = 'group' | 'tabs';

/** `hug` = shrink to content; `stretch` = grow to fill the row (use with `className` e.g. `w-full max-w-md`). */
export type SegmentedLayout = 'hug' | 'stretch';

export interface SegmentedControlProps<T extends string> {
    options: SegmentedOption<T>[];
    value: T;
    onChange: (value: T) => void;
    ariaLabel: string;
    className?: string;
    disabled?: boolean;
    /** `sm` matches dense pickers; `md` is the same chrome, larger tap targets and type. */
    size?: 'sm' | 'md';
    /** How the control sizes in the flex/grid parent. */
    layout?: SegmentedLayout;
    semantics?: SegmentedSemantics;
    /** Required for external tab panels: must match `aria-labelledby` on the panel (`${tabsIdPrefix}-${value}`). */
    tabsIdPrefix?: string;
}

const segmentClasses = (active: boolean, size: 'sm' | 'md') => {
    const dims =
        size === 'sm'
            ? 'px-3 py-1.5 text-xs gap-1.5'
            : 'px-4 py-2.5 text-sm gap-2';
    return `flex-1 ${dims} font-medium rounded transition-colors flex items-center justify-center ${
        active
            ? 'bg-primary-500 text-white shadow-sm'
            : 'text-text-secondary hover:text-text-primary'
    }`;
};

export function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
    ariaLabel,
    className = '',
    disabled = false,
    size = 'sm',
    layout = 'hug',
    semantics = 'group',
    tabsIdPrefix: tabsIdPrefixProp,
}: SegmentedControlProps<T>) {
    const autoTabId = useId();
    const tabsIdPrefix = semantics === 'tabs' ? (tabsIdPrefixProp ?? autoTabId) : '';

    const layoutClass =
        layout === 'stretch' ? 'flex w-full min-w-0' : 'inline-flex';

    const containerClass =
        `${layoutClass} rounded-lg border border-border bg-surface p-0.5 gap-0.5 ${className}`.trim();

    const containerRole = semantics === 'tabs' ? 'tablist' : 'group';

    return (
        <div className={containerClass} role={containerRole} aria-label={ariaLabel}>
            {options.map((option) => {
                const isActive = option.value === value;
                const segmentDisabled = disabled || option.disabled;
                const tabId = semantics === 'tabs' ? `${tabsIdPrefix}-${option.value}` : undefined;

                return (
                    <button
                        key={option.value}
                        id={tabId}
                        type="button"
                        role={semantics === 'tabs' ? 'tab' : undefined}
                        aria-selected={semantics === 'tabs' ? isActive : undefined}
                        disabled={segmentDisabled}
                        title={option.title}
                        className={`${segmentClasses(isActive, size)} ${
                            segmentDisabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => onChange(option.value)}
                    >
                        {option.icon}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
