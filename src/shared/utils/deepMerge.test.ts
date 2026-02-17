import { describe, it, expect } from 'vitest';
import { deepMerge } from './deepMerge';

describe('deepMerge', () => {
    it('should deep merge nested objects', () => {
        const target = {
            slideshow: {
                layout: 'single' as const,
                intervalMs: 5000,
                shuffle: true,
                filter: {
                    albumIds: ['1', '2'],
                    personIds: [],
                },
            },
            clock: {
                enabled: true,
                use24HourFormat: false,
            },
        };

        const source = {
            slideshow: {
                shuffle: false,
                filter: {
                    albumIds: ['3'],
                },
            },
        };

        const result = deepMerge(target, source);

        expect(result).toEqual({
            slideshow: {
                layout: 'single',
                intervalMs: 5000,
                shuffle: false, // Updated
                filter: {
                    albumIds: ['3'], // Replaced (arrays are replaced, not merged)
                    personIds: [],
                },
            },
            clock: {
                enabled: true,
                use24HourFormat: false,
            },
        });
    });

    it('should not mutate original objects', () => {
        const target = { a: { b: 1 } };
        const source = { a: { c: 2 } };

        const result = deepMerge(target, source);

        expect(target).toEqual({ a: { b: 1 } });
        expect(source).toEqual({ a: { c: 2 } });
        expect(result).toEqual({ a: { b: 1, c: 2 } });
    });

    it('should replace arrays, not merge them', () => {
        const target = { items: [1, 2, 3] };
        const source = { items: [4, 5] };

        const result = deepMerge(target, source);

        expect(result).toEqual({ items: [4, 5] });
    });

    it('should handle empty source', () => {
        const target = { a: 1, b: 2 };
        const source = {};

        const result = deepMerge(target, source);

        expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle undefined values in source', () => {
        const target = { a: 1, b: 2 };
        const source = { a: undefined, c: 3 };

        const result = deepMerge(target, source);

        // undefined values are ignored
        expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should merge deeply nested objects', () => {
        const target = {
            level1: {
                level2: {
                    level3: {
                        value: 'old',
                        keep: true,
                    },
                },
            },
        };

        const source = {
            level1: {
                level2: {
                    level3: {
                        value: 'new',
                    },
                },
            },
        };

        const result = deepMerge(target, source);

        expect(result).toEqual({
            level1: {
                level2: {
                    level3: {
                        value: 'new',
                        keep: true,
                    },
                },
            },
        });
    });
});
