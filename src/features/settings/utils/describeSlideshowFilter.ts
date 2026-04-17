import type { PhotoFilterParams } from '../../photos/types';
import { DEFAULT_FILTER_OPERATOR, type FilterOperator } from '../../photos/types';

function opWord(op: FilterOperator | undefined): 'all' | 'any' {
    return (op ?? DEFAULT_FILTER_OPERATOR) === 'AND' ? 'all' : 'any';
}

function formatLocation(loc: PhotoFilterParams['location']): string | null {
    if (!loc) return null;
    const parts = [loc.city, loc.state, loc.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : null;
}

function formatDateRange(startDate?: string, endDate?: string): string | null {
    if (!startDate && !endDate) return null;
    if (startDate && endDate) return `${startDate} through ${endDate}`;
    if (startDate) return `from ${startDate}`;
    return `through ${endDate!}`;
}

/**
 * Human-readable bullets describing the active slideshow filter (albums, people, global combine, exclusions, location, dates).
 */
export function describeSlideshowFilter(filter: PhotoFilterParams): string[] {
    const lines: string[] = [];

    const albumIds = filter.albumIds ?? [];
    const personIds = filter.personIds ?? [];
    const excludeAlbumIds = filter.excludeAlbumIds ?? [];
    const excludePersonIds = filter.excludePersonIds ?? [];
    const globalOp = filter.globalOperator ?? DEFAULT_FILTER_OPERATOR;

    const hasAlbumFilter = albumIds.length > 0;
    const hasPersonFilter = personIds.length > 0;

    if (!hasAlbumFilter && !hasPersonFilter) {
        lines.push(
            'No album or people filters — every photo in your library can appear (exclusions, location, and dates still apply).'
        );
    } else {
        if (hasAlbumFilter) {
            const w = opWord(filter.albumOperator);
            lines.push(
                `Albums: match ${w} of ${albumIds.length} selected album${albumIds.length === 1 ? '' : 's'}.`
            );
        }
        if (hasPersonFilter) {
            const w = opWord(filter.personOperator);
            lines.push(
                `People: match ${w} of ${personIds.length} selected ${personIds.length === 1 ? 'person' : 'people'}.`
            );
        }
        if (hasAlbumFilter && hasPersonFilter) {
            if (globalOp === 'AND') {
                lines.push('Album and people rules both apply — a photo must satisfy each active rule set.');
            } else {
                lines.push(
                    'Album or people rules — a photo can match either rule set (or both).'
                );
            }
        }
    }

    const exAlbum = excludeAlbumIds.length;
    const exPerson = excludePersonIds.length;
    if (exAlbum > 0 || exPerson > 0) {
        const parts: string[] = [];
        if (exAlbum > 0) {
            parts.push(`${exAlbum} album${exAlbum === 1 ? '' : 's'}`);
        }
        if (exPerson > 0) {
            parts.push(`${exPerson} ${exPerson === 1 ? 'person' : 'people'}`);
        }
        lines.push(`Excluding photos tied to ${parts.join(' and ')}.`);
    }

    const loc = formatLocation(filter.location);
    if (loc) {
        lines.push(`Location narrows to: ${loc}.`);
    }

    const dr = formatDateRange(filter.startDate, filter.endDate);
    if (dr) {
        lines.push(`Date range narrows to ${dr}.`);
    }

    return lines;
}
