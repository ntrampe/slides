import { useSettingsData } from "../hooks/useSettingsData";
import { StringArrayEditor } from "../../../shared/components";

export const SettingsPanel = () => {
    const { settings, updateSettings } = useSettingsData();

    return (
        <div className="h-full w-full bg-slate-900/90 p-8 text-white overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Settings</h2>

            {/* Slideshow Settings */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b border-slate-700 pb-2">Slideshow</h3>

                <StringArrayEditor
                    label="Album IDs"
                    values={settings.slideshow.filter.albumIds || []}
                    onChange={(albumIds) => updateSettings({
                        ...settings,
                        slideshow: {
                            ...settings.slideshow,
                            filter: { ...settings.slideshow.filter, albumIds }
                        }
                    })}
                    placeholder="Enter album ID..."
                />

                <StringArrayEditor
                    label="Person IDs"
                    values={settings.slideshow.filter.personIds || []}
                    onChange={(personIds) => updateSettings({
                        ...settings,
                        slideshow: {
                            ...settings.slideshow,
                            filter: { ...settings.slideshow.filter, personIds }
                        }
                    })}
                    placeholder="Enter person ID..."
                />

                <label className="block mb-4">
                    <span className="block mb-1">Layout</span>
                    <select
                        value={settings.slideshow.layout}
                        onChange={(e) => updateSettings({ ...settings, slideshow: { ...settings.slideshow, layout: e.target.value as any } })}
                        className="bg-slate-800 w-full p-2 rounded"
                    >
                        <option value="single">Single Image</option>
                        <option value="split">Split View</option>
                    </select>
                </label>

                <label className="block mb-4">
                    <span className="block mb-1">Interval (ms)</span>
                    <input
                        type="number"
                        value={settings.slideshow.intervalMs}
                        onChange={(e) => updateSettings({ ...settings, slideshow: { ...settings.slideshow, intervalMs: Number(e.target.value) } })}
                        className="bg-slate-800 w-full p-2 rounded"
                        min="1000"
                        step="1000"
                    />
                </label>

                <label className="flex items-center mb-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.slideshow.shuffle}
                        onChange={(e) => updateSettings({ ...settings, slideshow: { ...settings.slideshow, shuffle: e.target.checked } })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>Shuffle Photos</span>
                </label>

                <label className="flex items-center mb-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.slideshow.autoplay}
                        onChange={(e) => updateSettings({ ...settings, slideshow: { ...settings.slideshow, autoplay: e.target.checked } })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>Autoplay</span>
                </label>
            </div>

            {/* Photo Settings */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b border-slate-700 pb-2">Photo</h3>

                <label className="block mb-4">
                    <span className="block mb-1">Photo Fit</span>
                    <select
                        value={settings.photo.fit}
                        onChange={(e) => updateSettings({ ...settings, photo: { ...settings.photo, fit: e.target.value as any } })}
                        className="bg-slate-800 w-full p-2 rounded"
                    >
                        <option value="contain">Contain</option>
                        <option value="cover">Cover</option>
                        <option value="fill">Fill</option>
                    </select>
                </label>

                <label className="block mb-4">
                    <span className="block mb-1">Date Format</span>
                    <input
                        type="text"
                        value={settings.photo.dateFormat}
                        onChange={(e) => updateSettings({ ...settings, photo: { ...settings.photo, dateFormat: e.target.value } })}
                        className="bg-slate-800 w-full p-2 rounded"
                        placeholder="MMM dd, yyyy"
                    />
                </label>
            </div>

            {/* Clock Settings */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b border-slate-700 pb-2">Clock</h3>

                <label className="flex items-center mb-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.clock.show24HourFormat}
                        onChange={(e) => updateSettings({ ...settings, clock: { ...settings.clock, show24HourFormat: e.target.checked } })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>24-Hour Format</span>
                </label>

                <label className="block mb-4">
                    <span className="block mb-1">Date Format</span>
                    <input
                        type="text"
                        value={settings.clock.dateFormat}
                        onChange={(e) => updateSettings({ ...settings, clock: { ...settings.clock, dateFormat: e.target.value } })}
                        className="bg-slate-800 w-full p-2 rounded"
                        placeholder="MMM DD, YYYY"
                    />
                </label>
            </div>

            {/* Weather Settings */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b border-slate-700 pb-2">Weather</h3>

                <label className="block mb-4">
                    <span className="block mb-1">Latitude</span>
                    <input
                        type="number"
                        value={settings.weather.location.lat}
                        onChange={(e) => updateSettings({ ...settings, weather: { ...settings.weather, location: { ...settings.weather.location, lat: Number(e.target.value) } } })}
                        className="bg-slate-800 w-full p-2 rounded"
                        step="0.0001"
                        placeholder="0.0000"
                    />
                </label>

                <label className="block mb-4">
                    <span className="block mb-1">Longitude</span>
                    <input
                        type="number"
                        value={settings.weather.location.lng}
                        onChange={(e) => updateSettings({ ...settings, weather: { ...settings.weather, location: { ...settings.weather.location, lng: Number(e.target.value) } } })}
                        className="bg-slate-800 w-full p-2 rounded"
                        step="0.0001"
                        placeholder="0.0000"
                    />
                </label>
            </div>

            {/* UI Settings */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b border-slate-700 pb-2">UI</h3>

                <label className="flex items-center mb-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.ui.showClock}
                        onChange={(e) => updateSettings({ ...settings, ui: { ...settings.ui, showClock: e.target.checked } })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Clock</span>
                </label>

                <label className="flex items-center mb-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.ui.showWeather}
                        onChange={(e) => updateSettings({ ...settings, ui: { ...settings.ui, showWeather: e.target.checked } })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Weather</span>
                </label>

                <label className="flex items-center mb-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.ui.showProgressBar}
                        onChange={(e) => updateSettings({ ...settings, ui: { ...settings.ui, showProgressBar: e.target.checked } })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Progress Bar</span>
                </label>

                <label className="flex items-center mb-4 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.ui.showPhotoMetadata}
                        onChange={(e) => updateSettings({ ...settings, ui: { ...settings.ui, showPhotoMetadata: e.target.checked } })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Photo Metadata</span>
                </label>

                <label className="block mb-4">
                    <span className="block mb-1">Font Size</span>
                    <select
                        value={settings.ui.fontSize}
                        onChange={(e) => updateSettings({ ...settings, ui: { ...settings.ui, fontSize: e.target.value as any } })}
                        className="bg-slate-800 w-full p-2 rounded"
                    >
                        <option value="sm">Small</option>
                        <option value="base">Base</option>
                        <option value="lg">Large</option>
                        <option value="xl">Extra Large</option>
                    </select>
                </label>
            </div>

            {/* Debug Settings */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b border-slate-700 pb-2">Debug</h3>

                <label className="flex items-center mb-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.debug.showDebugStats}
                        onChange={(e) => updateSettings({ ...settings, debug: { ...settings.debug, showDebugStats: e.target.checked } })}
                        className="mr-2 w-4 h-4"
                    />
                    <span>Show Debug Stats</span>
                </label>
            </div>
        </div>
    );
};