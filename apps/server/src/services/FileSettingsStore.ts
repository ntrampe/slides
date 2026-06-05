import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
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
    private readonly writeMutex = new AsyncMutex();

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
        return this.writeMutex.run(() => this.setDomainOverridesUnlocked(domain, value));
    }

    async clearDomainOverrides(domain: SettingsDomain): Promise<void> {
        return this.writeMutex.run(() => this.clearDomainOverridesUnlocked(domain));
    }

    async clearAllOverrides(): Promise<void> {
        return this.writeMutex.run(() => this.clearAllOverridesUnlocked());
    }

    private async setDomainOverridesUnlocked(
        domain: SettingsDomain,
        value: DomainAppSettings[SettingsDomain]
    ): Promise<void> {
        const filePath = this.domainPath(domain);
        const tempPath = `${filePath}.tmp`;
        const payload = JSON.stringify(value, null, 2);

        await mkdir(dirname(filePath), { recursive: true });

        try {
            await writeFile(tempPath, payload, 'utf8');
        } catch (error) {
            try {
                await unlink(tempPath);
            } catch (cleanupError) {
                if (!isNodeError(cleanupError) || cleanupError.code !== 'ENOENT') {
                    console.warn(
                        `Failed to remove orphaned settings temp file at ${tempPath}:`,
                        cleanupError
                    );
                }
            }
            throw error;
        }

        await rename(tempPath, filePath);
    }

    private async clearDomainOverridesUnlocked(domain: SettingsDomain): Promise<void> {
        try {
            await unlink(this.domainPath(domain));
        } catch (error) {
            if (isNodeError(error) && error.code === 'ENOENT') {
                return;
            }
            throw error;
        }
    }

    private async clearAllOverridesUnlocked(): Promise<void> {
        await Promise.all(
            (Object.keys(DOMAIN_FILES) as SettingsDomain[]).map((domain) =>
                this.clearDomainOverridesUnlocked(domain)
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

class AsyncMutex {
    private tail: Promise<void> = Promise.resolve();

    run<T>(fn: () => Promise<T>): Promise<T> {
        const result = this.tail.then(() => fn());
        this.tail = result.then(
            () => undefined,
            () => undefined
        );
        return result;
    }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error && 'code' in error;
}
