import type {
    AppSettings,
    ConfigurationSettings,
    PlaybackSettings,
    QuerySettings,
} from '@slides/api-contract';

export type DomainEvent =
    | { type: 'query_updated'; data: QuerySettings }
    | { type: 'playback_updated'; data: PlaybackSettings }
    | { type: 'configuration_updated'; data: ConfigurationSettings }
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

    broadcastConfigurationUpdated(configuration: ConfigurationSettings): void {
        this.emit({ type: 'configuration_updated', data: configuration });
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
