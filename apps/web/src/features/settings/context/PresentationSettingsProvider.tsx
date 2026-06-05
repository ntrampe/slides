import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import {
    DEFAULT_PRESENTATION_SETTINGS,
    type PresentationSettings,
} from '../types';
import type { UsePresentationSettingsReturn } from '../hooks/types';

const STORAGE_KEY = 'slides:presentationSettings';

function loadPresentationSettings(): PresentationSettings {
    try {
        if (typeof window === 'undefined') {
            return DEFAULT_PRESENTATION_SETTINGS;
        }
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return DEFAULT_PRESENTATION_SETTINGS;
        }
        const parsed = JSON.parse(raw) as Partial<PresentationSettings>;
        return { ...DEFAULT_PRESENTATION_SETTINGS, ...parsed };
    } catch {
        return DEFAULT_PRESENTATION_SETTINGS;
    }
}

const PresentationSettingsContext = createContext<UsePresentationSettingsReturn | undefined>(
    undefined
);

export interface PresentationSettingsProviderProps {
    children: ReactNode;
}

export function PresentationSettingsProvider({ children }: PresentationSettingsProviderProps) {
    const [presentation, setPresentation] = useState(loadPresentationSettings);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(presentation));
        } catch {
            // Storage may be blocked in restrictive privacy modes
        }
    }, [presentation]);

    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key === STORAGE_KEY) {
                setPresentation(loadPresentationSettings());
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const updatePresentationSettings = useCallback((partial: Partial<PresentationSettings>) => {
        setPresentation((current) => ({ ...current, ...partial }));
    }, []);

    const resetPresentationSettings = useCallback(() => {
        setPresentation(DEFAULT_PRESENTATION_SETTINGS);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // Storage may be blocked in restrictive privacy modes
        }
    }, []);

    const value = useMemo(
        (): UsePresentationSettingsReturn => ({
            presentation,
            updatePresentationSettings,
            resetPresentationSettings,
        }),
        [presentation, updatePresentationSettings, resetPresentationSettings]
    );

    return (
        <PresentationSettingsContext.Provider value={value}>
            {children}
        </PresentationSettingsContext.Provider>
    );
}

export function usePresentationSettings(): UsePresentationSettingsReturn {
    const context = useContext(PresentationSettingsContext);
    if (!context) {
        throw new Error(
            'usePresentationSettings must be used within a PresentationSettingsProvider'
        );
    }
    return context;
}
