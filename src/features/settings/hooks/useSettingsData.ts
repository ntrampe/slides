import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../../shared/context/ServiceContext';
import type { AppSettings } from '../types';
import defaultSettings from '../types';

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

    return { settings: query.data ?? defaultSettings, updateSettings: mutation.mutate };
}