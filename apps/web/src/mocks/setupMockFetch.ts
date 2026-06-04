import { handleMockFetch } from './handlers.js';

const nativeFetch = globalThis.fetch.bind(globalThis);

export function setupMockFetch(): void {
    globalThis.fetch = async (input, init) => {
        const mockResponse = await handleMockFetch(input, init);
        if (mockResponse) {
            return mockResponse;
        }
        return nativeFetch(input, init);
    };
}
