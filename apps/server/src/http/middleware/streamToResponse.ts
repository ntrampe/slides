import { Readable } from 'node:stream';
import type { Response } from 'express';
import type { AssetResponse } from '../../infra/ImmichClient.js';

/**
 * Pipes an `AssetResponse` (from `ImmichClient.fetchAsset`) to an Express
 * response, forwarding the upstream status, caching headers, and body stream.
 *
 * Handles two failure modes:
 * - Upstream read error: destroys the response and logs the error.
 * - Client disconnect: destroys the upstream readable to release the connection.
 *
 * Keeping this in the route/middleware layer (not in ImmichClient) preserves
 * the clean separation between the HTTP client and the Express transport.
 */
export function streamToResponse(asset: AssetResponse, res: Response): void {
    res.status(asset.status);
    for (const [name, value] of Object.entries(asset.headers)) {
        res.setHeader(name, value);
    }
    if (!asset.body) {
        res.end();
        return;
    }

    // Node 18+: convert WHATWG ReadableStream from fetch to a Node Readable.
    const readable = Readable.fromWeb(
        asset.body as unknown as Parameters<typeof Readable.fromWeb>[0]
    );

    readable.on('error', (err) => {
        console.error('[stream] Upstream read error:', err.message);
        if (!res.writableEnded) {
            res.destroy(err);
        }
    });

    // Destroy the upstream readable when the client disconnects mid-stream to
    // avoid leaking the upstream fetch connection.
    res.on('close', () => {
        if (!readable.destroyed) {
            readable.destroy();
        }
    });

    readable.pipe(res);
}
