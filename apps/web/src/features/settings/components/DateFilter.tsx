import { useState } from 'react';

export interface DateFilterProps {
    startDate?: string;
    endDate?: string;
    onChange: (startDate?: string, endDate?: string) => void;
}

type DatePreset = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';

export const DateFilter = ({ startDate, endDate, onChange }: DateFilterProps) => {
    const [preset, setPreset] = useState<DatePreset>(() => {
        // Determine current preset based on dates
        if (!startDate && !endDate) return 'all';

        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const yearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        if (startDate === today && endDate === today) return 'today';
        if (startDate === weekAgo && !endDate) return 'week';
        if (startDate === monthAgo && !endDate) return 'month';
        if (startDate === yearAgo && !endDate) return 'year';

        return 'custom';
    });

    const handlePresetChange = (newPreset: DatePreset) => {
        setPreset(newPreset);

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        switch (newPreset) {
            case 'all':
                onChange(undefined, undefined);
                break;
            case 'today':
                onChange(todayStr, todayStr);
                break;
            case 'week':
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                onChange(weekAgo.toISOString().split('T')[0], undefined);
                break;
            case 'month':
                const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                onChange(monthAgo.toISOString().split('T')[0], undefined);
                break;
            case 'year':
                const yearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
                onChange(yearAgo.toISOString().split('T')[0], undefined);
                break;
            case 'custom':
                // Keep current dates when switching to custom
                break;
        }
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
                            onChange={(e) => onChange(e.target.value || undefined, endDate)}
                            className="bg-surface border border-border w-full p-2 rounded"
                        />
                    </label>

                    <label className="block">
                        <span className="block mb-1">End Date</span>
                        <input
                            type="date"
                            value={endDate || ''}
                            onChange={(e) => onChange(startDate, e.target.value || undefined)}
                            className="bg-surface border border-border w-full p-2 rounded"
                        />
                    </label>
                </>
            )}
        </div>
    );
};