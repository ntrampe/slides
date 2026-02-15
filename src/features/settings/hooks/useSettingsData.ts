import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../../shared/context/ServiceContext';
import type { AppSettings } from '../types';
import { getDefaultSettings } from '../types';

export function useSettingsData() {
    const { settings: service } = useServices();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['settings'],
        queryFn: () => service.loadSettings(),
    });

    const mutation = useMutation({
        mutationFn: (newSettings: AppSettings) => service.saveSettings(newSettings),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
    });

    // Use environment-aware defaults as fallback
    return {
        settings: query.data ?? getDefaultSettings(),
        updateSettings: mutation.mutate
    };
}