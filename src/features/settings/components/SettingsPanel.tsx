import { useSettingsData } from "../hooks/useSettingsData";

export const SettingsPanel = () => {
    const { settings, updateSettings } = useSettingsData();

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-slate-900/90 p-8 text-white z-50">
            <h2 className="text-xl font-bold mb-6">Settings</h2>

            <label className="block mb-4">
                <span>Layout</span>
                <select
                    value={settings.slideshow.layout}
                    onChange={(e) => updateSettings({ ...settings, slideshow: { ...settings.slideshow, layout: e.target.value as any } })}
                    className="bg-slate-800 w-full p-2 rounded"
                >
                    <option value="single">Single Image</option>
                    <option value="split">Split View</option>
                </select>
            </label>

            {/* Add more toggles for Object Fit, etc. */}
        </div >
    );
};