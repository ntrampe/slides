export interface DomainMapMarker {
    id: string;
    lat: number;
    lon: number;
    city: string;
    state: string;
    country: string;
}

export interface DomainLocationHierarchy {
    countries: DomainLocationItem[];
    states: Record<string, DomainLocationItem[]>;
    cities: Record<string, DomainLocationItem[]>;
}

export interface DomainLocationItem {
    id: string;
    name: string;
    count: number;
}

export interface DomainLocationSelection {
    country?: string;
    state?: string;
    city?: string;
}
