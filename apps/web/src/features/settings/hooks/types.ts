import type { PresentationSettings } from '../types';

export interface UsePresentationSettingsReturn {
    presentation: PresentationSettings;
    updatePresentationSettings: (partial: Partial<PresentationSettings>) => void;
    resetPresentationSettings: () => void;
}
