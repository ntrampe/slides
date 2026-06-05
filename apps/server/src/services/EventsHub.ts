import type {
    AppSettings,
    DisplaySettings,
    PlaybackSettings,
    QuerySettings,
} from '@slides/api-contract';

export type DomainEvent =
    | { type: 'query_updated'; data: QuerySettings }
    | { type: 'playback_updated'; data: PlaybackSettings }
    | { type: 'display_updated'; data: DisplaySettings }
    | { type: 'settings_cleared'; data: AppSettings };

type EventSubscriber = (event: DomainEvent) => void;

export class EventsHub {
    private readonly subscribers = new Set<EventSubscriber>();

    subscribe(callback: EventSubscriber): () => void {
        this.subscribers.add(callback);
        return () => {
            this.subscribers.delete(callback);
        };
    }

    broadcastQueryUpdated(query: QuerySettings): void {
        this.emit({ type: 'query_updated', data: query });
    }

    broadcastPlaybackUpdated(playback: PlaybackSettings): void {
        this.emit({ type: 'playback_updated', data: playback });
    }

    broadcastDisplayUpdated(display: DisplaySettings): void {
        this.emit({ type: 'display_updated', data: display });
    }

    broadcastSettingsCleared(defaults: AppSettings): void {
        this.emit({ type: 'settings_cleared', data: defaults });
    }

    private emit(event: DomainEvent): void {
        for (const subscriber of this.subscribers) {
            subscriber(event);
        }
    }
}
