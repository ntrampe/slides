import type { QuerySettings } from '../../photos/types';

export type DatePreset = NonNullable<QuerySettings['datePreset']>;

export type DateFilterChange = Partial<Pick<QuerySettings, 'datePreset' | 'startDate' | 'endDate'>> &
    Pick<QuerySettings, 'datePreset'>;

export interface DateFilterProps {
    datePreset?: QuerySettings['datePreset'];
    startDate?: string;
    endDate?: string;
    onChange: (update: DateFilterChange) => void;
}

export const DateFilter = ({ datePreset, startDate, endDate, onChange }: DateFilterProps) => {
    const preset: DatePreset = datePreset ?? 'all';

    const handlePresetChange = (newPreset: DatePreset) => {
        onChange({ datePreset: newPreset });
    };

    const handleStartChange = (value: string | undefined) => {
        onChange({
            datePreset: 'custom',
            startDate: value,
        });
    };

    const handleEndChange = (value: string | undefined) => {
        onChange({
            datePreset: 'custom',
            endDate: value,
        });
    };

    return (
        <div className="space-y-4">
            <label className="block">
                <span className="block mb-1">Date Range</span>
                <select
                    value={preset}
                    onChange={(e) => handlePresetChange(e.target.value as DatePreset)}
                    className="bg-surface border border-border w-full p-2 rounded"
                >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Past 7 Days</option>
                    <option value="month">Past 30 Days</option>
                    <option value="year">Past Year</option>
                    <option value="custom">Custom Range</option>
                </select>
            </label>

            {preset === 'custom' && (
                <>
                    <label className="block">
                        <span className="block mb-1">Start Date</span>
                        <input
                            type="date"
                            value={startDate || ''}
                            onChange={(e) => handleStartChange(e.target.value || undefined)}
                            className="bg-surface border border-border w-full p-2 rounded"
                        />
                    </label>

                    <label className="block">
                        <span className="block mb-1">End Date</span>
                        <input
                            type="date"
                            value={endDate || ''}
                            onChange={(e) => handleEndChange(e.target.value || undefined)}
                            className="bg-surface border border-border w-full p-2 rounded"
                        />
                    </label>
                </>
            )}
        </div>
    );
};
