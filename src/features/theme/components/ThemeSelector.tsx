import { Sun, Moon } from 'lucide-react';
import { SegmentedControl } from '../../../shared/components/SegmentedControl';
import { useTheme } from '../hooks';
import type { ThemeMode } from '../types';

export const ThemeSelector = () => {
    const { mode, setMode } = useTheme();

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
                Theme
            </h3>

            <SegmentedControl<ThemeMode>
                size="md"
                layout="stretch"
                className="w-full max-w-md"
                ariaLabel="Theme"
                value={mode}
                onChange={setMode}
                options={[
                    {
                        value: 'light',
                        label: 'Light',
                        icon: <Sun size={18} aria-hidden />,
                    },
                    {
                        value: 'dark',
                        label: 'Dark',
                        icon: <Moon size={18} aria-hidden />,
                    },
                ]}
            />
        </div>
    );
};
