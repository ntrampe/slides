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

function formatDateConstraint(startDate?: string, endDate?: string): string | null {
    if (!startDate && !endDate) return null;
    if (startDate && endDate) return `taken between ${startDate} and ${endDate}`;
    if (startDate) return `taken on or after ${startDate}`;
    return `taken on or before ${endDate!}`;
}

function joinWithAnd(parts: string[]): string {
    if (parts.length <= 1) return parts[0] ?? '';
    if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
    return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

function selectionTarget(
    kind: 'album' | 'person',
    count: number,
    op: FilterOperator | undefined
): string {
    const label = kind === 'album' ? (count === 1 ? 'album' : 'albums') : count === 1 ? 'person' : 'people';
    if (count === 1) return `the selected ${label}`;
    if (opWord(op) === 'all') return `all ${count} selected ${label}`;
    return `any of ${count} selected ${label}`;
}

/**
 * Human-readable summary describing the active slideshow filter (albums, people, location, dates, exclusions).
 */
export function describeSlideshowFilter(filter: PhotoFilterParams): string[] {
    const albumIds = filter.albumIds ?? [];
    const personIds = filter.personIds ?? [];
    const excludeAlbumIds = filter.excludeAlbumIds ?? [];
    const excludePersonIds = filter.excludePersonIds ?? [];
    const globalOp = filter.globalOperator ?? DEFAULT_FILTER_OPERATOR;

    const hasAlbumFilter = albumIds.length > 0;
    const hasPersonFilter = personIds.length > 0;
    const hasAnyPrimaryFilter = hasAlbumFilter || hasPersonFilter;

    let primaryRule: string;
    if (!hasAnyPrimaryFilter) {
        primaryRule = 'Photos can come from anywhere in your library';
    } else {
        const albumTarget = hasAlbumFilter
            ? selectionTarget('album', albumIds.length, filter.albumOperator)
            : null;
        const personTarget = hasPersonFilter
            ? selectionTarget('person', personIds.length, filter.personOperator)
            : null;

        if (hasAlbumFilter && hasPersonFilter) {
            if (globalOp === 'AND') {
                primaryRule = `Photos must match ${albumTarget} and ${personTarget}`;
            } else {
                primaryRule = `Photos can match ${albumTarget}, ${personTarget}, or both`;
            }
        } else if (albumTarget) {
            primaryRule = `Photos must match ${albumTarget}`;
        } else {
            primaryRule = `Photos must match ${personTarget}`;
        }
    }

    const constraints: string[] = [];

    const loc = formatLocation(filter.location);
    if (loc) {
        constraints.push(`from ${loc}`);
    }

    const dateConstraint = formatDateConstraint(filter.startDate, filter.endDate);
    if (dateConstraint) {
        constraints.push(dateConstraint);
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
        constraints.push(`not tied to ${joinWithAnd(parts)}`);
    }

    if (constraints.length === 0) {
        return [`${primaryRule}.`];
    }

    return [`${primaryRule}, ${joinWithAnd(constraints)}.`];
}
