import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks';

export const ThemeSelector = () => {
    const { mode, setMode } = useTheme();

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
                Theme
            </h3>

            <div className="flex gap-2">
                <button
                    onClick={() => setMode('light')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 ${mode === 'light'
                        ? 'bg-primary-500 text-white border-primary-600 shadow-lg'
                        : 'bg-surface hover:bg-surface-hover border-border text-text-primary'
                        }`}
                >
                    <Sun size={18} />
                    <span className="font-medium">Light</span>
                </button>

                <button
                    onClick={() => setMode('dark')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 ${mode === 'dark'
                        ? 'bg-primary-500 text-white border-primary-600 shadow-lg'
                        : 'bg-surface hover:bg-surface-hover border-border text-text-primary'
                        }`}
                >
                    <Moon size={18} />
                    <span className="font-medium">Dark</span>
                </button>
            </div>
        </div>
    );
};
