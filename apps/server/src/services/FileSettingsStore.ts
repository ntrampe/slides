import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type {
    DomainAppSettings,
    DomainDisplaySettings,
    DomainPlaybackSettings,
    DomainQuerySettings,
    SettingsDomain,
} from '../domain/settings.js';
import type { SettingsStore } from './SettingsStore.js';

const DOMAIN_FILES: Record<SettingsDomain, string> = {
    query: 'settings.query.json',
    playback: 'settings.playback.json',
    display: 'settings.display.json',
};

export class FileSettingsStore implements SettingsStore {
    constructor(private readonly dataDir: string) {}

    async getAllDomainOverrides(): Promise<{
        query: DomainQuerySettings | null;
        playback: DomainPlaybackSettings | null;
        display: DomainDisplaySettings | null;
    }> {
        const [query, playback, display] = await Promise.all([
            this.readDomainFile<DomainQuerySettings>('query'),
            this.readDomainFile<DomainPlaybackSettings>('playback'),
            this.readDomainFile<DomainDisplaySettings>('display'),
        ]);

        return { query, playback, display };
    }

    async setDomainOverrides(
        domain: SettingsDomain,
        value: DomainAppSettings[SettingsDomain]
    ): Promise<void> {
        const filePath = this.domainPath(domain);
        await mkdir(dirname(filePath), { recursive: true });
        await writeFile(filePath, JSON.stringify(value, null, 2), 'utf8');
    }

    async clearDomainOverrides(domain: SettingsDomain): Promise<void> {
        try {
            await unlink(this.domainPath(domain));
        } catch (error) {
            if (isNodeError(error) && error.code === 'ENOENT') {
                return;
            }
            throw error;
        }
    }

    async clearAllOverrides(): Promise<void> {
        await Promise.all(
            (Object.keys(DOMAIN_FILES) as SettingsDomain[]).map((domain) =>
                this.clearDomainOverrides(domain)
            )
        );
    }

    private domainPath(domain: SettingsDomain): string {
        return join(this.dataDir, DOMAIN_FILES[domain]);
    }

    private async readDomainFile<T>(domain: SettingsDomain): Promise<T | null> {
        const filePath = this.domainPath(domain);
        try {
            const raw = await readFile(filePath, 'utf8');
            return JSON.parse(raw) as T;
        } catch (error) {
            if (isNodeError(error) && error.code === 'ENOENT') {
                return null;
            }
            console.warn(
                `Failed to parse settings file at ${filePath}; treating as no overrides:`,
                error
            );
            return null;
        }
    }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error && 'code' in error;
}
