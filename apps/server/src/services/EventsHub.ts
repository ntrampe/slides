import type { Response } from 'express';
import type {
    AppSettings,
    DisplaySettings,
    PlaybackSettings,
    QuerySettings,
} from '@slides/api-contract';

const PING_INTERVAL_MS = 30_000;

export class EventsHub {
    private readonly clients = new Set<Response>();
    private pingTimer: ReturnType<typeof setInterval> | null = null;

    addClient(res: Response): void {
        this.clients.add(res);
        if (this.pingTimer == null) {
            this.pingTimer = setInterval(() => this.sendPing(), PING_INTERVAL_MS);
        }
    }

    removeClient(res: Response): void {
        this.clients.delete(res);
        if (this.clients.size === 0 && this.pingTimer != null) {
            clearInterval(this.pingTimer);
            this.pingTimer = null;
        }
    }

    broadcastQueryUpdated(query: QuerySettings): void {
        this.writeEvent('query_updated', query);
    }

    broadcastPlaybackUpdated(playback: PlaybackSettings): void {
        this.writeEvent('playback_updated', playback);
    }

    broadcastDisplayUpdated(display: DisplaySettings): void {
        this.writeEvent('display_updated', display);
    }

    broadcastSettingsCleared(defaults: AppSettings): void {
        this.writeEvent('settings_cleared', defaults);
    }

    private writeEvent(event: string, data: unknown): void {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        for (const client of this.clients) {
            try {
                client.write(payload);
            } catch {
                this.clients.delete(client);
            }
        }
    }

    private sendPing(): void {
        for (const client of this.clients) {
            try {
                client.write(': ping\n\n');
            } catch {
                this.clients.delete(client);
            }
        }
    }
}
