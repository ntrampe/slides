import { schemas } from '@slides/api-contract';
import type {
    DomainConfigurationSettings,
    DomainPlaybackSettings,
    DomainQuerySettings,
} from '../domain/settings.js';
import { ClientError } from '@slides/shared/errors';

export function parseQuerySettings(body: unknown): Partial<DomainQuerySettings> {
    const result = schemas.QuerySettingsUpdate.safeParse(body);
    if (!result.success) {
        throw new ClientError(result.error.message, 400);
    }
    return result.data;
}

export function parsePlaybackSettings(body: unknown): Partial<DomainPlaybackSettings> {
    const result = schemas.PlaybackSettingsUpdate.safeParse(body);
    if (!result.success) {
        throw new ClientError(result.error.message, 400);
    }
    return result.data;
}

export function parseConfigurationSettings(
    body: unknown
): Partial<DomainConfigurationSettings> {
    const result = schemas.ConfigurationSettingsUpdate.safeParse(body);
    if (!result.success) {
        throw new ClientError(result.error.message, 400);
    }
    return result.data;
}
