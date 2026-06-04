import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { DomainAppSettings } from '../domain/settings.js';
import type { DeepPartial } from '@slides/shared/utils/deepMerge';
import type { SettingsStore } from './SettingsStore.js';

export class FileSettingsStore implements SettingsStore {
    constructor(private readonly filePath: string) {}

    async getOverrides(): Promise<DeepPartial<DomainAppSettings> | null> {
        let raw: string;
        try {
            raw = await readFile(this.filePath, 'utf8');
        } catch (error) {
            if (isNodeError(error) && error.code === 'ENOENT') {
                return null;
            }
            throw error;
        }

        try {
            return JSON.parse(raw) as DeepPartial<DomainAppSettings>;
        } catch (error) {
            console.warn(
                `Failed to parse settings file at ${this.filePath}; treating as no overrides:`,
                error
            );
            return null;
        }
    }

    async setOverrides(overrides: DeepPartial<DomainAppSettings>): Promise<void> {
        await mkdir(dirname(this.filePath), { recursive: true });
        await writeFile(this.filePath, JSON.stringify(overrides, null, 2), 'utf8');
    }

    async clearOverrides(): Promise<void> {
        try {
            await unlink(this.filePath);
        } catch (error) {
            if (isNodeError(error) && error.code === 'ENOENT') {
                return;
            }
            throw error;
        }
    }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error && 'code' in error;
}
