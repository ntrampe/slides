const STORAGE_KEY = 'slides:slideshow-seed';

/** Stable per-tab shuffle seed so refetches keep the same order until the tab closes. */
export function getSlideshowSeed(): string {
    if (typeof sessionStorage === 'undefined') {
        return String(Date.now());
    }

    let seed = sessionStorage.getItem(STORAGE_KEY);
    if (!seed) {
        seed = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        sessionStorage.setItem(STORAGE_KEY, seed);
    }
    return seed;
}
