import { X } from 'lucide-react';
import { useSettingsData } from "../hooks/useSettingsData";
import { PeoplePicker } from "../../people/components/PeoplePicker";
import { AlbumPicker } from "../../albums/components/AlbumPicker";
import { LocationPicker } from "../../locations/components/LocationPicker";
import { ThemeSelector } from "../../theme/components/ThemeSelector";
import { CollapsibleSection } from "../../../shared/components";
import { SupportButton } from './SupportButton';
import { DateFilter } from './DateFilter';
import type { PhotoAnimationType } from '../../photos';

export interface SettingsPanelProps {
    onClose: () => void;
}

const Divider = () => (
    <div className="my-4 border-t border-border/60" />
);

export const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
    const { settings, updateSettings, clearSettings } = useSettingsData();

    const handleReset = () => {
        if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
            clearSettings();
        }
    };

    return (
        <div
            className="h-full w-full bg-surface backdrop-blur-sm p-safe-or-8 text-text-primary overflow-y-auto touch-pan-y"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Settings</h2>
                <button
                    onClick={onClose}
                    className="text-text-secondary hover:text-text-primary hover:bg-surface rounded-full p-2 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="mb-6">
                <ThemeSelector />
            </div>

            {/* CONTENT */}
            <CollapsibleSection title="Content">
                {/* Global filter logic */}
                <div className="flex items-center justify-between mb-2">
                    <span className="font-small">Combine filters:</span>
                    <div className="flex gap-1 text-xs">
                        <button
                            className={`px-2 py-1 rounded transition-colors ${settings.slideshow.filter.globalOperator === 'AND'
                                ? 'bg-primary-500 text-white'
                                : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
                                }`}
                            onClick={() => updateSettings({
                                slideshow: { filter: { globalOperator: 'AND' } }
                            })}
                            title="Photos must be in ALL selected items"
                        >
                            ALL
                        </button>
                        <button
                            className={`px-2 py-1 rounded transition-colors ${settings.slideshow.filter.globalOperator === 'OR'
                                ? 'bg-primary-500 text-white'
                                : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
                                }`}
                            onClick={() => updateSettings({
                                slideshow: { filter: { globalOperator: 'OR' } }
                            })}
                            title="Photos can be in ANY of the selected items"
                        >
                            ANY
                        </button>
                    </div>
                </div>
                <p className="text-xs text-text-secondary mt-2">
                    {(settings.slideshow.filter.globalOperator ?? 'AND') === 'AND'
                        ? 'Photos must satisfy all filter categories (Albums AND People)'
                        : 'Photos can satisfy any filter category (Albums OR People)'}
                </p>

                <AlbumPicker
                    label="Albums"
                    selectedIds={settings.slideshow.filter.albumIds || []}
                    excludedIds={settings.slideshow.filter.excludeAlbumIds || []}
                    operator={settings.slideshow.filter.albumOperator || 'OR'}
                    onChange={(albumIds) =>
                        updateSettings({ slideshow: { filter: { albumIds } } })
                    }
                    onExcludedChange={(excludeAlbumIds) =>
                        updateSettings({ slideshow: { filter: { excludeAlbumIds } } })
                    }
                    onOperatorChange={(albumOperator) =>
                        updateSettings({ slideshow: { filter: { albumOperator } } })
                    }
                />
                <PeoplePicker
                    label="People"
                    selectedIds={settings.slideshow.filter.personIds || []}
                    excludedIds={settings.slideshow.filter.excludePersonIds || []}
                    operator={settings.slideshow.filter.personOperator || 'OR'}
                    onChange={(personIds) =>
                        updateSettings({ slideshow: { filter: { personIds } } })
                    }
                    onExcludedChange={(excludePersonIds) =>
                        updateSettings({ slideshow: { filter: { excludePersonIds } } })
                    }
                    onOperatorChange={(personOperator) =>
                        updateSettings({ slideshow: { filter: { personOperator } } })
                    }
                />
                <LocationPicker
                    label="Location"
                    selection={settings.slideshow.filter.location || {}}
                    onChange={(location) =>
                        updateSettings({ slideshow: { filter: { location } } })
                    }
                />
                <DateFilter
                    startDate={settings.slideshow.filter.startDate}
                    endDate={settings.slideshow.filter.endDate}
                    onChange={(startDate, endDate) =>
                        updateSettings({ slideshow: { filter: { startDate, endDate } } })
                    }
                />
            </CollapsibleSection>

            {/* PLAYBACK */}
            <CollapsibleSection title="Playback">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.slideshow.shuffle}
                        onChange={(e) =>
                            updateSettings({ slideshow: { shuffle: e.target.checked } })
                        }
                        className="mr-2 w-4 h-4"
                    />
                    <span>Shuffle</span>
                </label>

                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.slideshow.autoplay}
                        onChange={(e) =>
                            updateSettings({ slideshow: { autoplay: e.target.checked } })
                        }
                        className="mr-2 w-4 h-4"
                    />
                    <span>Autoplay</span>
                </label>

                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.slideshow.ui.showProgressBar}
                        onChange={(e) =>
                            updateSettings({
                                slideshow: { ui: { showProgressBar: e.target.checked } }
                            })
                        }
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Progress Bar</span>
                </label>

                <label className="block">
                    <span className="block mb-1">Interval (seconds)</span>
                    <input
                        type="number"
                        value={settings.slideshow.intervalMs / 1000}
                        min="1"
                        step="1"
                        onChange={(e) => {
                            const intervalMs = Number(e.target.value) * 1000;
                            updateSettings({ slideshow: { intervalMs } });
                        }}
                        className="bg-surface border border-border w-full p-2 rounded"
                    />
                </label>
            </CollapsibleSection>

            {/* TRANSITIONS */}
            <CollapsibleSection title="Transitions">
                <label className="block">
                    <span className="block mb-1">Type</span>
                    <select
                        value={settings.slideshow.transition.type}
                        onChange={(e) =>
                            updateSettings({
                                slideshow: {
                                    transition: {
                                        type: e.target.value as 'fade' | 'slide' | 'none'
                                    }
                                }
                            })
                        }
                        className="bg-surface border border-border w-full p-2 rounded"
                    >
                        <option value="fade">Fade</option>
                        <option value="slide">Slide</option>
                        <option value="none">None</option>
                    </select>
                </label>

                <label className="block">
                    <span className="block mb-1">Duration (ms)</span>
                    <input
                        type="number"
                        min="100"
                        step="100"
                        disabled={settings.slideshow.transition.type === 'none'}
                        value={settings.slideshow.transition.duration}
                        onChange={(e) =>
                            updateSettings({
                                slideshow: {
                                    transition: { duration: Number(e.target.value) }
                                }
                            })
                        }
                        className="bg-surface border border-border w-full p-2 rounded"
                    />
                </label>
            </CollapsibleSection>

            {/* APPEARANCE */}
            <CollapsibleSection title="Appearance">
                <label className="block">
                    <span className="block mb-1">Photo Fit</span>
                    <select
                        value={settings.photos.fit}
                        onChange={(e) =>
                            updateSettings({ photos: { fit: e.target.value as any } })
                        }
                        className="bg-surface border border-border w-full p-2 rounded"
                    >
                        <option value="contain">Contain</option>
                        <option value="cover">Cover</option>
                        <option value="fill">Fill</option>
                    </select>
                </label>

                <label className="block">
                    <span className="block mb-1">Layout</span>
                    <select
                        value={settings.slideshow.layout}
                        onChange={(e) =>
                            updateSettings({ slideshow: { layout: e.target.value as any } })
                        }
                        className="bg-surface border border-border w-full p-2 rounded"
                    >
                        <option value="single">Single</option>
                        <option value="split">Split View</option>
                    </select>
                </label>
            </CollapsibleSection>

            {/* MOTION */}
            <CollapsibleSection title="Motion">
                <label className="block">
                    <span className="block mb-1">Animation</span>
                    <select
                        value={settings.photos.animation.type}
                        onChange={(e) =>
                            updateSettings({
                                photos: {
                                    animation: {
                                        type: e.target.value as PhotoAnimationType
                                    }
                                }
                            })
                        }
                        className="bg-surface border border-border w-full p-2 rounded"
                    >
                        <option value="none">None</option>
                        <option value="zoom-in">Zoom In</option>
                        <option value="zoom-out">Zoom Out</option>
                        <option value="pan">Pan</option>
                        <option value="ken-burns">Ken Burns</option>
                    </select>
                </label>

                {settings.photos.animation.type !== 'none' && (
                    <>
                        <label className="block">
                            <span className="block mb-1">Intensity</span>
                            <input
                                type="range"
                                min="1"
                                max="2"
                                step="0.1"
                                value={settings.photos.animation.intensity}
                                onChange={(e) =>
                                    updateSettings({
                                        photos: {
                                            animation: {
                                                intensity: Number(e.target.value)
                                            }
                                        }
                                    })
                                }
                                className="w-full"
                            />
                        </label>

                        <label className="flex items-center cursor-pointer mt-2">
                            <input
                                type="checkbox"
                                checked={
                                    settings.photos.animation.duration ===
                                    settings.slideshow.intervalMs
                                }
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        updateSettings({
                                            photos: {
                                                animation: {
                                                    duration:
                                                        settings.slideshow.intervalMs
                                                }
                                            }
                                        });
                                    }
                                }}
                                className="mr-2 w-4 h-4"
                            />
                            <span className="text-sm">
                                Match animation duration to slide interval
                            </span>
                        </label>
                    </>
                )}
            </CollapsibleSection>

            {/* LIVE PHOTOS */}
            <CollapsibleSection title="Live Photos">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.photos.livePhoto.enabled}
                        onChange={(e) =>
                            updateSettings({
                                photos: {
                                    livePhoto: {
                                        enabled: e.target.checked,
                                        delay: settings.photos.livePhoto.delay
                                    }
                                }
                            })
                        }
                        className="mr-2 w-4 h-4"
                    />
                    <span>Enable</span>
                </label>

                <label className="block">
                    <span className="block mb-1">Delay (seconds)</span>
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={settings.photos.livePhoto.delay / 1000}
                        onChange={(e) =>
                            updateSettings({
                                photos: {
                                    livePhoto: {
                                        enabled: settings.photos.livePhoto.enabled,
                                        delay: Number(e.target.value) * 1000
                                    }
                                }
                            })
                        }
                        className="bg-surface border border-border w-full p-2 rounded"
                    />
                </label>
            </CollapsibleSection>

            {/* OVERLAYS */}
            <CollapsibleSection title="Overlays">
                {/* Photo Metadata */}
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.photos.metadata.enabled}
                        onChange={(e) =>
                            updateSettings({
                                photos: {
                                    metadata: {
                                        enabled: e.target.checked,
                                        dateFormat:
                                            settings.photos.metadata.dateFormat
                                    }
                                }
                            })
                        }
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Photo Metadata</span>
                </label>

                <label className="block">
                    <span className="block mb-1">Metadata Date Format</span>
                    <input
                        type="text"
                        value={settings.photos.metadata.dateFormat}
                        onChange={(e) =>
                            updateSettings({
                                photos: {
                                    metadata: {
                                        enabled:
                                            settings.photos.metadata.enabled,
                                        dateFormat: e.target.value
                                    }
                                }
                            })
                        }
                        className="bg-surface border border-border w-full p-2 rounded"
                    />
                </label>

                <Divider />

                {/* Clock */}
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.clock.enabled}
                        onChange={(e) =>
                            updateSettings({ clock: { enabled: e.target.checked } })
                        }
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Clock</span>
                </label>

                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.clock.use24HourFormat}
                        onChange={(e) =>
                            updateSettings({
                                clock: { use24HourFormat: e.target.checked }
                            })
                        }
                        className="mr-2 w-4 h-4"
                    />
                    <span>24-Hour Format</span>
                </label>

                <label className="block">
                    <span className="block mb-1">Clock Date Format</span>
                    <input
                        type="text"
                        value={settings.clock.dateFormat}
                        onChange={(e) =>
                            updateSettings({ clock: { dateFormat: e.target.value } })
                        }
                        className="bg-surface border border-border w-full p-2 rounded"
                    />
                </label>

                <Divider />

                {/* Weather */}
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.weather.enabled}
                        onChange={(e) =>
                            updateSettings({ weather: { enabled: e.target.checked } })
                        }
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Weather</span>
                </label>

                <label className="block">
                    <span className="block mb-1">Latitude</span>
                    <input
                        type="number"
                        step="0.0001"
                        value={settings.weather.location.lat}
                        onChange={(e) =>
                            updateSettings({
                                weather: {
                                    location: {
                                        lat: Number(e.target.value)
                                    }
                                }
                            })
                        }
                        className="bg-surface border border-border w-full p-2 rounded"
                    />
                </label>

                <label className="block">
                    <span className="block mb-1">Longitude</span>
                    <input
                        type="number"
                        step="0.0001"
                        value={settings.weather.location.lng}
                        onChange={(e) =>
                            updateSettings({
                                weather: {
                                    location: {
                                        lng: Number(e.target.value)
                                    }
                                }
                            })
                        }
                        className="bg-surface border border-border w-full p-2 rounded"
                    />
                </label>
            </CollapsibleSection>

            {/* ADVANCED */}
            <CollapsibleSection title="Advanced">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.debug.showDebugStats}
                        onChange={(e) =>
                            updateSettings({
                                debug: { showDebugStats: e.target.checked }
                            })
                        }
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Debug Stats</span>
                </label>
            </CollapsibleSection>

            {/* RESET */}
            <div className="mt-8 pt-6">
                <button
                    onClick={handleReset}
                    className="w-full bg-error hover:bg-error/80 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                    Reset All Settings
                </button>
                <p className="text-sm text-text-secondary mt-2 text-center">
                    This will clear all your settings and restore defaults
                </p>
            </div>

            {/* SUPPORT */}
            {settings.support.enabled && (
                <div className="mt-6 pt-24 border-t border-border/60">
                    <div className="text-center">
                        <p className="text-sm text-text-secondary mb-3">
                            Enjoying Slides?
                        </p>
                        <SupportButton
                            url="https://github.com/sponsors/ntrampe"
                            text="Buy me a coffee ☕"
                            className="w-full justify-center"
                        />
                        <button
                            onClick={() => updateSettings({ support: { enabled: false } })}
                            className="mt-3 text-xs text-text-secondary hover:text-text-primary transition-colors underline"
                        >
                            Hide Forever
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};