import type { QuerySettings } from '@slides/api-contract';
import type { DomainQuerySettings } from './settings.js';

export type DatePreset = NonNullable<QuerySettings['datePreset']>;

export interface DateRangeInput {
    datePreset?: DatePreset | null;
    startDate?: string;
    endDate?: string;
}

export interface ResolvedDateRange {
    startDate?: string;
    endDate?: string;
}

/** Format a Date as YYYY-MM-DD in local calendar (matches HTML date inputs). */
export function toLocalDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function subtractDaysLocal(date: Date, days: number): string {
    return toLocalDateString(new Date(date.getTime() - days * 24 * 60 * 60 * 1000));
}

/**
 * Resolve a date preset (and optional custom bounds) to absolute local calendar dates.
 */
export function resolveDateRange(
    input: DateRangeInput,
    now: Date = new Date()
): ResolvedDateRange {
    const preset = input.datePreset ?? 'all';
    const today = toLocalDateString(now);

    switch (preset) {
        case 'all':
            return {};
        case 'today':
            return { startDate: today, endDate: today };
        case 'week':
            return { startDate: subtractDaysLocal(now, 7), endDate: today };
        case 'month':
            return { startDate: subtractDaysLocal(now, 30), endDate: today };
        case 'year':
            return { startDate: subtractDaysLocal(now, 365), endDate: today };
        case 'custom':
            return {
                startDate: input.startDate ?? today,
                endDate: input.endDate ?? today,
            };
        default:
            return {};
    }
}

/**
 * Apply preset resolution to query settings for API responses and Immich queries.
 */
export function applyResolvedQueryDates<T extends DateRangeInput>(
    query: T,
    now: Date = new Date()
): T & ResolvedDateRange & { datePreset: DatePreset } {
    const datePreset = query.datePreset ?? 'all';
    const resolved = resolveDateRange({ ...query, datePreset }, now);

    if (datePreset === 'all') {
        return { ...query, datePreset, startDate: undefined, endDate: undefined };
    }

    return { ...query, datePreset, ...resolved };
}

/**
 * Normalize persisted query settings after a PATCH.
 * Relative presets store intent only; custom stores explicit bounds (seeded when missing).
 */
export function normalizeQuerySettingsForPersist(query: DomainQuerySettings): DomainQuerySettings {
    const datePreset = query.datePreset ?? 'all';
    const normalized: DomainQuerySettings = { ...query, datePreset };

    if (datePreset === 'all') {
        delete normalized.startDate;
        delete normalized.endDate;
        return normalized;
    }

    if (datePreset === 'custom') {
        const { startDate, endDate } = resolveDateRange({ datePreset: 'custom', ...query });
        normalized.startDate = startDate;
        normalized.endDate = endDate;
        return normalized;
    }

    delete normalized.startDate;
    delete normalized.endDate;
    return normalized;
}
