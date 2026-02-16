import { useState } from 'react';
import { useKeyToggle } from '../../../shared/hooks';

export interface UseSettingsPanelReturn {
    state: {
        isOpen: boolean;
    };
    actions: {
        open: () => void;
        close: () => void;
        toggle: () => void;
    };
}

/**
 * Hook to manage settings panel visibility
 * Integrates keyboard shortcut ('s' key) with manual toggle
 */
export function useSettingsPanel(): UseSettingsPanelReturn {
    const [isManuallyOpen, setIsManuallyOpen] = useState(false);
    const { isActive: isKeyboardOpen } = useKeyToggle('s');

    // Panel is open if either keyboard shortcut is active OR manually opened
    const isOpen = isKeyboardOpen || isManuallyOpen;

    const open = () => setIsManuallyOpen(true);
    const close = () => setIsManuallyOpen(false);
    const toggle = () => setIsManuallyOpen(prev => !prev);

    return {
        state: { isOpen },
        actions: { open, close, toggle }
    };
}