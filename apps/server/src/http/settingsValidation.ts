import { schemas } from '@slides/api-contract';
import type {
    DomainDisplaySettings,
    DomainPlaybackSettings,
    DomainQuerySettings,
} from '../domain/settings.js';
import { ClientError } from '@slides/shared/errors';

export function parseQuerySettings(body: unknown): DomainQuerySettings {
    const result = schemas.QuerySettings.safeParse(body);
    if (!result.success) {
        throw new ClientError(result.error.message, 400);
    }
    return result.data;
}

export function parsePlaybackSettings(body: unknown): DomainPlaybackSettings {
    const result = schemas.PlaybackSettings.safeParse(body);
    if (!result.success) {
        throw new ClientError(result.error.message, 400);
    }
    return result.data;
}

export function parseDisplaySettings(body: unknown): DomainDisplaySettings {
    const result = schemas.DisplaySettings.safeParse(body);
    if (!result.success) {
        throw new ClientError(result.error.message, 400);
    }
    return result.data;
}
