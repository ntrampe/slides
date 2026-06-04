import { z } from 'zod';
import { schemas } from '@slides/api-contract';
import type { DeepPartial } from '@slides/shared/utils/deepMerge';
import { ClientError } from '@slides/shared/errors';
import type { DomainAppSettings } from '../domain/settings.js';

function deepPartial(schema: z.ZodType): z.ZodType {
    if (schema instanceof z.ZodObject) {
        const shape = schema.shape as Record<string, z.ZodType>;
        const nextShape: Record<string, z.ZodType> = {};
        for (const key of Object.keys(shape)) {
            nextShape[key] = deepPartial(shape[key]).optional();
        }
        return z.object(nextShape);
    }
    if (schema instanceof z.ZodOptional) {
        return deepPartial(schema.unwrap() as z.ZodType);
    }
    return schema;
}

const settingsOverridesSchema = deepPartial(schemas.AppSettings);

export function parseSettingsOverrides(input: unknown): DeepPartial<DomainAppSettings> {
    const result = settingsOverridesSchema.safeParse(input);
    if (!result.success) {
        const detail = result.error.issues
            .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
            .join('; ');
        throw new ClientError(`Invalid settings payload: ${detail}`, 400);
    }
    return result.data as DeepPartial<DomainAppSettings>;
}
