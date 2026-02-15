import { useSettingsData } from "../hooks/useSettingsData";
import { PeoplePicker } from "../../people/components/PeoplePicker";
import { AlbumPicker } from "../../albums/components/AlbumPicker";
import { LocationPicker } from "../../locations/components/LocationPicker";
import { ThemeSelector } from "../../theme/components/ThemeSelector";
import { CollapsibleSection } from "../../../shared/components";

export const SettingsPanel = () => {
    const { settings, updateSettings } = useSettingsData();

    return (
        <div className="h-full w-full bg-surface/95 backdrop-blur-sm p-8 text-text-primary overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>

            {/* Theme - Always visible */}
            <div className="mb-6">
                <ThemeSelector />
            </div>

            {/* Photo Filters - Most commonly changed, expanded by default */}
            <CollapsibleSection title="Photo Filters">
                <AlbumPicker
                    label="Albums"
                    selectedIds={settings.slideshow.filter.albumIds || []}
                    onChange={(albumIds) => updateSettings({
                        ...settings,
                        slideshow: {
                            ...settings.slideshow,
                            filter: { ...settings.slideshow.filter, albumIds }
                        }
                    })}
                />

                <PeoplePicker
                    label="People"
                    selectedIds={settings.slideshow.filter.personIds || []}
                    onChange={(personIds) => updateSettings({
                        ...settings,
                        slideshow: {
                            ...settings.slideshow,
                            filter: { ...settings.slideshow.filter, personIds }
                        }
                    })}
                />

                <LocationPicker
                    label="Location"
                    selection={settings.slideshow.filter.location || {}}
                    onChange={(location) => updateSettings({
                        ...settings,
                        slideshow: {
                            ...settings.slideshow,
                            filter: { ...settings.slideshow.filter, location }
                        }
                    })}
                />
            </CollapsibleSection>

            {/* Slideshow Behavior - Commonly changed, expanded by default */}
            <CollapsibleSection title="Slideshow Behavior">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.slideshow.shuffle}
                        onChange={(e) => updateSettings({ ...settings, slideshow: { ...settings.slideshow, shuffle: e.target.checked } })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>Shuffle Photos</span>
                </label>

                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.slideshow.ui.showProgressBar}
                        onChange={(e) => updateSettings({
                            ...settings,
                            slideshow: {
                                ...settings.slideshow,
                                ui: {
                                    ...settings.slideshow.ui,
                                    showProgressBar: e.target.checked
                                }
                            }
                        })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Progress Bar</span>
                </label>

                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.slideshow.autoplay}
                        onChange={(e) => updateSettings({ ...settings, slideshow: { ...settings.slideshow, autoplay: e.target.checked } })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>Autoplay</span>
                </label>

                <label className="block">
                    <span className="block mb-1">Interval (seconds)</span>
                    <input
                        type="number"
                        value={settings.slideshow.intervalMs / 1000}
                        onChange={(e) => updateSettings({ ...settings, slideshow: { ...settings.slideshow, intervalMs: Number(e.target.value) * 1000 } })}
                        className="bg-surface border border-border text-text-primary w-full p-2 rounded"
                        min="1"
                        step="1"
                    />
                </label>

                <label className="block">
                    <span className="block mb-1">Layout</span>
                    <select
                        value={settings.slideshow.layout}
                        onChange={(e) => updateSettings({ ...settings, slideshow: { ...settings.slideshow, layout: e.target.value as any } })}
                        className="bg-surface border border-border text-text-primary w-full p-2 rounded"
                    >
                        <option value="single">Single Image</option>
                        <option value="split">Split View</option>
                    </select>
                </label>
            </CollapsibleSection>

            {/* Display Options - Commonly changed */}
            <CollapsibleSection title="Display Options">

                <label className="block">
                    <span className="block mb-1">Font Size</span>
                    <select
                        value={settings.ui.fontSize}
                        onChange={(e) => updateSettings({ ...settings, ui: { ...settings.ui, fontSize: e.target.value as any } })}
                        className="bg-surface border border-border text-text-primary w-full p-2 rounded"
                    >
                        <option value="sm">Small</option>
                        <option value="base">Base</option>
                        <option value="lg">Large</option>
                        <option value="xl">Extra Large</option>
                    </select>
                </label>
            </CollapsibleSection>

            {/* Photo Display - Less commonly changed */}
            <CollapsibleSection title="Photo Display">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.photos.display.showMetadata}
                        onChange={(e) => updateSettings({
                            ...settings,
                            photos: {
                                ...settings.photos,
                                display: {
                                    ...settings.photos.display,
                                    showMetadata: e.target.checked
                                }
                            }
                        })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Photo Metadata</span>
                </label>

                <label className="block">
                    <span className="block mb-1">Photo Fit</span>
                    <select
                        value={settings.photos.display.fit}
                        onChange={(e) => updateSettings({
                            ...settings,
                            photos: {
                                ...settings.photos,
                                display: {
                                    ...settings.photos.display,
                                    fit: e.target.value as any
                                }
                            }
                        })}
                        className="bg-surface border border-border text-text-primary w-full p-2 rounded"
                    >
                        <option value="contain">Contain (show full photo)</option>
                        <option value="cover">Cover (fill screen)</option>
                        <option value="fill">Fill (stretch)</option>
                    </select>
                </label>

                <label className="block">
                    <span className="block mb-1">Date Format</span>
                    <input
                        type="text"
                        value={settings.photos.dateFormat}
                        onChange={(e) => updateSettings({
                            ...settings,
                            photos: {
                                ...settings.photos,
                                dateFormat: e.target.value
                            }
                        })}
                        className="bg-surface border border-border text-text-primary w-full p-2 rounded"
                        placeholder="MMM dd, yyyy"
                    />
                    <span className="text-sm text-text-secondary mt-1 block">e.g., MMM dd, yyyy → Jan 01, 2024</span>
                </label>
            </CollapsibleSection>

            {/* Transitions - Less commonly changed */}
            <CollapsibleSection title="Transitions">
                <label className="block">
                    <span className="block mb-1">Transition Type</span>
                    <select
                        value={settings.slideshow.transition.type}
                        onChange={(e) => updateSettings({
                            ...settings,
                            slideshow: {
                                ...settings.slideshow,
                                transition: {
                                    ...settings.slideshow.transition,
                                    type: e.target.value as 'fade' | 'slide' | 'none'
                                }
                            }
                        })}
                        className="bg-surface border border-border text-text-primary w-full p-2 rounded"
                    >
                        <option value="fade">Fade</option>
                        <option value="slide">Slide</option>
                        <option value="none">None (instant)</option>
                    </select>
                </label>

                <label className="block">
                    <span className="block mb-1">Transition Duration (ms)</span>
                    <input
                        type="number"
                        value={settings.slideshow.transition.duration}
                        onChange={(e) => updateSettings({
                            ...settings,
                            slideshow: {
                                ...settings.slideshow,
                                transition: {
                                    ...settings.slideshow.transition,
                                    duration: Number(e.target.value)
                                }
                            }
                        })}
                        className="bg-surface border border-border text-text-primary w-full p-2 rounded"
                        min="100"
                        step="100"
                        disabled={settings.slideshow.transition.type === 'none'}
                    />
                </label>
            </CollapsibleSection>

            {/* Clock Format - Less commonly changed */}
            <CollapsibleSection title="Clock">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.clock.enabled}
                        onChange={(e) => updateSettings({ ...settings, clock: { ...settings.clock, enabled: e.target.checked } })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Clock</span>
                </label>

                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.clock.use24HourFormat}
                        onChange={(e) => updateSettings({ ...settings, clock: { ...settings.clock, use24HourFormat: e.target.checked } })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>24-Hour Format</span>
                </label>

                <label className="block">
                    <span className="block mb-1">Date Format</span>
                    <input
                        type="text"
                        value={settings.clock.dateFormat}
                        onChange={(e) => updateSettings({ ...settings, clock: { ...settings.clock, dateFormat: e.target.value } })}
                        className="bg-surface border border-border text-text-primary w-full p-2 rounded"
                        placeholder="MMM DD, YYYY"
                    />
                    <span className="text-sm text-text-secondary mt-1 block">e.g., MMM DD, YYYY → JAN 01, 2024</span>
                </label>
            </CollapsibleSection>

            {/* Weather - Less commonly changed */}
            <CollapsibleSection title="Weather">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.weather.enabled}
                        onChange={(e) => updateSettings({ ...settings, weather: { ...settings.weather, enabled: e.target.checked } })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Weather</span>
                </label>

                <label className="block">
                    <span className="block mb-1">Latitude</span>
                    <input
                        type="number"
                        value={settings.weather.location.lat}
                        onChange={(e) => updateSettings({ ...settings, weather: { ...settings.weather, location: { ...settings.weather.location, lat: Number(e.target.value) } } })}
                        className="bg-surface border border-border text-text-primary w-full p-2 rounded"
                        step="0.0001"
                        placeholder="0.0000"
                    />
                </label>

                <label className="block">
                    <span className="block mb-1">Longitude</span>
                    <input
                        type="number"
                        value={settings.weather.location.lng}
                        onChange={(e) => updateSettings({ ...settings, weather: { ...settings.weather, location: { ...settings.weather.location, lng: Number(e.target.value) } } })}
                        className="bg-surface border border-border text-text-primary w-full p-2 rounded"
                        step="0.0001"
                        placeholder="0.0000"
                    />
                </label>
            </CollapsibleSection>

            {/* Debug - Rarely changed */}
            <CollapsibleSection title="Debug">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.debug.showDebugStats}
                        onChange={(e) => updateSettings({ ...settings, debug: { ...settings.debug, showDebugStats: e.target.checked } })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Debug Stats</span>
                </label>
            </CollapsibleSection>
        </div>
    );
};