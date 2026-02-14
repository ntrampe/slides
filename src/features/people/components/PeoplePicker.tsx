import { useState, useMemo } from 'react';
import { X, User, Search } from 'lucide-react';
import { usePeople } from '../hooks/usePeople';

interface PeoplePickerProps {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    label: string;
}

export const PeoplePicker = ({
    selectedIds,
    onChange,
    label
}: PeoplePickerProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { data: people, isLoading, error } = usePeople();

    // Filter people based on search query
    const filteredPeople = useMemo(() => {
        if (!people) return [];
        if (!searchQuery.trim()) return people;

        const query = searchQuery.toLowerCase();
        return people.filter(person =>
            person.name.toLowerCase().includes(query)
        );
    }, [people, searchQuery]);

    // Get selected people objects
    const selectedPeople = useMemo(() => {
        if (!people) return [];
        return people.filter(person => selectedIds.includes(person.id));
    }, [people, selectedIds]);

    // Available people (not selected)
    const availablePeople = useMemo(() => {
        return filteredPeople.filter(person => !selectedIds.includes(person.id));
    }, [filteredPeople, selectedIds]);

    const handleTogglePerson = (personId: string) => {
        if (selectedIds.includes(personId)) {
            onChange(selectedIds.filter(id => id !== personId));
        } else {
            onChange([...selectedIds, personId]);
        }
    };

    const handleRemove = (personId: string) => {
        onChange(selectedIds.filter(id => id !== personId));
    };

    if (error) {
        return (
            <div className="mb-4">
                <span className="block mb-2 text-red-400">{label} (Error loading)</span>
                <p className="text-sm text-red-400">Failed to load people</p>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <span className="block mb-2">{label}</span>

            {/* Display selected people */}
            {selectedPeople.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedPeople.map((person) => (
                        <div
                            key={person.id}
                            className="flex items-center gap-2 bg-slate-700 px-2 py-1 rounded text-sm"
                        >
                            <img
                                src={person.thumbnailUrl}
                                alt={person.name}
                                className="w-6 h-6 rounded-full object-cover"
                                onError={(e) => {
                                    // Fallback to user icon on error
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            <div className="hidden w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center">
                                <User size={12} />
                            </div>
                            <span>{person.name}</span>
                            <button
                                onClick={() => handleRemove(person.id)}
                                className="hover:bg-slate-600 rounded p-0.5"
                                aria-label="Remove"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Search and dropdown */}
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder={isLoading ? "Loading people..." : "Search people..."}
                        className="bg-slate-800 w-full p-2 pl-10 rounded"
                        disabled={isLoading}
                    />
                </div>

                {/* Dropdown */}
                {isDropdownOpen && !isLoading && (
                    <>
                        {/* Backdrop to close dropdown */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsDropdownOpen(false)}
                        />

                        {/* Dropdown content */}
                        <div className="absolute z-20 w-full mt-1 bg-slate-800 border border-slate-700 rounded max-h-64 overflow-y-auto">
                            {availablePeople.length === 0 ? (
                                <div className="p-3 text-sm text-slate-400">
                                    {searchQuery ? 'No people found' : 'All people selected'}
                                </div>
                            ) : (
                                availablePeople.map(person => (
                                    <button
                                        key={person.id}
                                        onClick={() => {
                                            handleTogglePerson(person.id);
                                            setSearchQuery('');
                                        }}
                                        className="w-full flex items-center gap-2 p-2 hover:bg-slate-700 text-left"
                                    >
                                        <img
                                            src={person.thumbnailUrl}
                                            alt={person.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                            onError={(e) => {
                                                // Fallback to user icon on error
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                        <div className="hidden w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                                            <User size={16} />
                                        </div>
                                        <span>{person.name}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>

            {selectedIds.length === 0 && (
                <p className="text-xs text-slate-400 mt-1">
                    No people selected. Leave empty to show all photos.
                </p>
            )}
        </div>
    );
};