import { useQuery } from '@tanstack/react-query';
import { useServices } from '../../../shared/context/ServiceContext';

export const usePeople = () => {
    const { people: peopleRepo } = useServices();

    return useQuery({
        queryKey: ['people'],
        queryFn: () => peopleRepo.getPeople(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};