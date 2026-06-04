import type { Photo as PhotoDto } from '@slides/api-contract';

export type {
    ObjectFit,
    LayoutMode,
    FilterOperator,
    PhotoFilterParams,
    PhotoAnimationType,
    PhotoLocation,
    PhotoCameraInfo,
    PhotoExifSettings,
} from '@slides/api-contract';

export type Photo = Omit<PhotoDto, 'createdAt'> & { createdAt: Date };
